from pydantic import BaseModel


class CallInsurerRequestDTO(BaseModel):
    phone_number: str
    agent_id: str | None = None


class CallInsurerResponseDTO(BaseModel):
    call_id: str
    phone_number: str
    status: str


class WebhookTranscriptDTO(BaseModel):
    call_id: str
    transcript: str
    status: str | None = None
    duration: float | None = None
    metadata: dict | None = None


class WebhookResponseDTO(BaseModel):
    message: str
    call_id: str
