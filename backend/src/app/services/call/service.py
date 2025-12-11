from loguru import logger

from app.clients.elevenlabs.client import ElevenLabsClient
from app.clients.elevenlabs.models import PhoneCallRequest
from app.services.call.config import CallServiceSettings
from app.services.call.database import TranscriptRepository
from app.services.call.models import CallInsurerRequest, CallInsurerResponse, CallTranscript


class CallServiceError(Exception):
    pass


class CallService:
    def __init__(
        self,
        elevenlabs_client: ElevenLabsClient,
        settings: CallServiceSettings,
        transcript_repository: TranscriptRepository,
    ) -> None:
        self.elevenlabs_client = elevenlabs_client
        self.settings = settings
        self.transcript_repository = transcript_repository

    async def initiate_call(self, request: CallInsurerRequest) -> CallInsurerResponse:
        agent_id = request.agent_id or self.settings.default_agent_id
        
        if not agent_id:
            raise CallServiceError("Agent ID is required")

        logger.info(f"Initiating call to {request.phone_number} with agent {agent_id}")
        
        try:
            phone_call_request = PhoneCallRequest(
                agent_id=agent_id,
                agent_phone_number_id=self.settings.default_agent_phone_number_id,
                phone_number=request.phone_number,
            )
            response = await self.elevenlabs_client.create_phone_call(phone_call_request)
            
            logger.info(f"Call initiated successfully: {response.call_id}")
            
            return CallInsurerResponse(
                call_id=response.call_id,
                phone_number=response.phone_number,
                status=response.status,
            )
        except Exception as e:
            logger.error(f"Failed to initiate call: {e}")
            raise CallServiceError(f"Failed to initiate call: {e}") from e

    async def process_transcript(self, transcript: CallTranscript) -> None:
        logger.info(f"Processing transcript for conversation {transcript.conversation_id}")
        
        await self.transcript_repository.save_transcript(transcript)
        
        print("\n" + "="*80)
        print(f"TRANSCRIPT RECEIVED - Conversation ID: {transcript.conversation_id}")
        print(f"Agent ID: {transcript.agent_id}")
        print(f"Status: {transcript.status}")
        print("="*80)
        
        if transcript.transcript:
            for turn in transcript.transcript:
                role = turn.get("role", "unknown")
                message = turn.get("message", "")
                print(f"{role.upper()}: {message}")
        
        print("="*80 + "\n")
        
        if transcript.metadata:
            logger.info(f"Call metadata: {transcript.metadata}")
        if transcript.analysis:
            logger.info(f"Call analysis: {transcript.analysis}")
    
    async def get_transcripts(
        self, 
        limit: int = 100, 
        offset: int = 0
    ) -> list[CallTranscript]:
        return await self.transcript_repository.list_transcripts(limit=limit, offset=offset)
    
    async def get_transcript(self, conversation_id: str) -> CallTranscript | None:
        return await self.transcript_repository.get_transcript(conversation_id)


def create_call_service(
    elevenlabs_client: ElevenLabsClient,
    settings: CallServiceSettings,
    transcript_repository: TranscriptRepository,
) -> CallService:
    return CallService(elevenlabs_client, settings, transcript_repository)
