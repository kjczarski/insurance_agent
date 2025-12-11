import time
import hmac
from hashlib import sha256

from fastapi import APIRouter, HTTPException, Request, status
from loguru import logger

from app.clients.elevenlabs.config import ElevenLabsSettings
from app.routes.calls.dto import (
    CallInsurerRequestDTO,
    CallInsurerResponseDTO,
    TranscriptDTO,
    TranscriptListResponseDTO,
    TranscriptTurnDTO,
    WebhookResponseDTO,
    WebhookTranscriptDTO,
)
from app.services.call.models import CallInsurerRequest, CallTranscript
from app.services.call.service import CallService, CallServiceError


class CallsRouter:
    def __init__(
        self,
        call_service: CallService,
        elevenlabs_settings: ElevenLabsSettings,
        api_prefix: str = "/api",
    ) -> None:
        self.call_service = call_service
        self.elevenlabs_settings = elevenlabs_settings
        self.router = APIRouter(prefix=f"{api_prefix}/calls", tags=["calls"])
        
        self.router.post("/insurer")(self.call_insurer)
        self.router.post("/webhook/transcript")(self.webhook_transcript)
        self.router.get("/transcripts")(self.get_transcripts)
        self.router.get("/transcripts/{conversation_id}")(self.get_transcript)

    async def call_insurer(self, request: CallInsurerRequestDTO) -> CallInsurerResponseDTO:
        try:
            call_request = CallInsurerRequest(
                phone_number=request.phone_number,
                agent_id=request.agent_id,
            )
            
            response = await self.call_service.initiate_call(call_request)
            
            return CallInsurerResponseDTO(
                call_id=response.call_id,
                phone_number=response.phone_number,
                status=response.status,
            )
        except CallServiceError as e:
            logger.error(f"Call service error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e),
            ) from e
        except Exception as e:
            logger.error(f"Unexpected error in call_insurer: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to initiate call",
            ) from e

    async def webhook_transcript(self, request: Request) -> WebhookResponseDTO:
        payload = await request.body()
        signature_header = request.headers.get("elevenlabs-signature")
        
        if not signature_header:
            logger.error("Missing elevenlabs-signature header")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing signature header",
            )
        
        parts = signature_header.split(",")
        if len(parts) != 2:
            logger.error("Invalid signature header format")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid signature format",
            )
        
        timestamp = parts[0][2:]
        hmac_signature = parts[1]
        
        tolerance = int(time.time()) - 30 * 60
        if int(timestamp) < tolerance:
            logger.error("Webhook timestamp too old")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Timestamp too old",
            )
        
        full_payload_to_sign = f"{timestamp}.{payload.decode('utf-8')}"
        mac = hmac.new(
            key=self.elevenlabs_settings.webhook_secret.encode("utf-8"),
            msg=full_payload_to_sign.encode("utf-8"),
            digestmod=sha256,
        )
        digest = "v0=" + mac.hexdigest()
        
        if hmac_signature != digest:
            logger.error("Invalid webhook signature")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid signature",
            )
        
        try:
            import json
            webhook_data = json.loads(payload.decode("utf-8"))
            
            logger.info(f"Received webhook payload: {json.dumps(webhook_data, indent=2)}")
            
            webhook = WebhookTranscriptDTO(**webhook_data)
            
            transcript = CallTranscript(
                conversation_id=webhook.data.conversation_id,
                agent_id=webhook.data.agent_id,
                status=webhook.data.status,
                transcript=webhook.data.transcript,
                metadata=webhook.data.metadata,
                analysis=webhook.data.analysis,
                user_id=webhook.data.user_id,
            )
            
            await self.call_service.process_transcript(transcript)
            
            return WebhookResponseDTO(
                message="Transcript processed successfully",
                conversation_id=webhook.data.conversation_id,
            )
        except CallServiceError as e:
            logger.error(f"Call service error processing transcript: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e),
            ) from e
        except Exception as e:
            logger.error(f"Unexpected error processing transcript: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to process transcript",
            ) from e

    async def get_transcripts(
        self, 
        limit: int = 100, 
        offset: int = 0
    ) -> TranscriptListResponseDTO:
        try:
            transcripts = await self.call_service.get_transcripts(limit=limit, offset=offset)
            
            return TranscriptListResponseDTO(
                transcripts=[
                    TranscriptDTO(
                        conversation_id=t.conversation_id,
                        agent_id=t.agent_id,
                        status=t.status,
                        transcript=[
                            TranscriptTurnDTO(
                                role=turn.get("role", "unknown"),
                                message=turn.get("message", "")
                            )
                            for turn in (t.transcript or [])
                        ] if t.transcript else None,
                        user_id=t.user_id,
                    )
                    for t in transcripts
                ],
                total=len(transcripts),
            )
        except Exception as e:
            logger.error(f"Error fetching transcripts: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to fetch transcripts",
            ) from e

    async def get_transcript(self, conversation_id: str) -> TranscriptDTO:
        try:
            transcript = await self.call_service.get_transcript(conversation_id)
            
            if not transcript:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Transcript not found for conversation {conversation_id}",
                )
            
            return TranscriptDTO(
                conversation_id=transcript.conversation_id,
                agent_id=transcript.agent_id,
                status=transcript.status,
                transcript=[
                    TranscriptTurnDTO(
                        role=turn.get("role", "unknown"),
                        message=turn.get("message", "")
                    )
                    for turn in (transcript.transcript or [])
                ] if transcript.transcript else None,
                user_id=transcript.user_id,
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching transcript {conversation_id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to fetch transcript",
            ) from e

    def get_router(self) -> APIRouter:
        return self.router


def create_calls_router(
    call_service: CallService,
    elevenlabs_settings: ElevenLabsSettings,
    api_prefix: str = "/api",
) -> CallsRouter:
    return CallsRouter(call_service, elevenlabs_settings, api_prefix)
