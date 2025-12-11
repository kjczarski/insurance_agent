from pydantic import BaseModel


class CallInsurerRequest(BaseModel):
    phone_number: str
    agent_id: str | None = None


class CallInsurerResponse(BaseModel):
    call_id: str
    phone_number: str
    status: str


class CallTranscript(BaseModel):
    call_id: str
    transcript: str
    status: str | None = None
    duration: float | None = None
    metadata: dict | None = None
