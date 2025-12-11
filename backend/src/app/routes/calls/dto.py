from pydantic import BaseModel


class CallInsurerRequestDTO(BaseModel):
    phone_number: str
    agent_id: str | None = None


class CallInsurerResponseDTO(BaseModel):
    call_id: str
    phone_number: str
    status: str


class WebhookTranscriptDataDTO(BaseModel):
    agent_id: str
    conversation_id: str
    status: str
    user_id: str | None = None
    transcript: list[dict] | None = None
    metadata: dict | None = None
    analysis: dict | None = None
    conversation_initiation_client_data: dict | None = None


class WebhookTranscriptDTO(BaseModel):
    type: str
    data: WebhookTranscriptDataDTO
    event_timestamp: float


class WebhookResponseDTO(BaseModel):
    message: str
    conversation_id: str


class TranscriptTurnDTO(BaseModel):
    role: str
    message: str


class TranscriptDTO(BaseModel):
    conversation_id: str
    agent_id: str
    status: str
    transcript: list[TranscriptTurnDTO] | None = None
    user_id: str | None = None


class TranscriptListResponseDTO(BaseModel):
    transcripts: list[TranscriptDTO]
    total: int
