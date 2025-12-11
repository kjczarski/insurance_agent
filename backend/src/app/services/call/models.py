from pydantic import BaseModel


class CallInsurerRequest(BaseModel):
    phone_number: str
    agent_id: str | None = None


class CallInsurerResponse(BaseModel):
    call_id: str
    phone_number: str
    status: str


class CallTranscript(BaseModel):
    conversation_id: str
    agent_id: str
    status: str
    transcript: list[dict] | None = None
    metadata: dict | None = None
    analysis: dict | None = None
    user_id: str | None = None
