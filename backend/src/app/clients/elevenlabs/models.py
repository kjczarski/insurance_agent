from pydantic import BaseModel


class PhoneCallRequest(BaseModel):
    agent_id: str
    agent_phone_number_id: str
    phone_number: str


class PhoneCallResponse(BaseModel):
    call_id: str
    agent_id: str
    phone_number: str
    status: str


class ElevenLabsError(Exception):
    def __init__(self, message: str, status_code: int | None = None) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)
