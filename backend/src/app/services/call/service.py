from loguru import logger

from app.clients.elevenlabs.client import ElevenLabsClient
from app.clients.elevenlabs.models import PhoneCallRequest
from app.services.call.config import CallServiceSettings
from app.services.call.models import CallInsurerRequest, CallInsurerResponse, CallTranscript


class CallServiceError(Exception):
    pass


class CallService:
    def __init__(
        self,
        elevenlabs_client: ElevenLabsClient,
        settings: CallServiceSettings,
    ) -> None:
        self.elevenlabs_client = elevenlabs_client
        self.settings = settings

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
        logger.info(f"Processing transcript for call {transcript.call_id}")
        
        print("\n" + "="*80)
        print(f"TRANSCRIPT RECEIVED - Call ID: {transcript.call_id}")
        print("="*80)
        print(transcript.transcript)
        print("="*80 + "\n")
        
        if transcript.status:
            logger.info(f"Call status: {transcript.status}")
        if transcript.duration:
            logger.info(f"Call duration: {transcript.duration}s")
        if transcript.metadata:
            logger.info(f"Call metadata: {transcript.metadata}")


def create_call_service(
    elevenlabs_client: ElevenLabsClient,
    settings: CallServiceSettings,
) -> CallService:
    return CallService(elevenlabs_client, settings)
