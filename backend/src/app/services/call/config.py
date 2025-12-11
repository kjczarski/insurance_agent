from pydantic_settings import BaseSettings


class CallServiceSettings(BaseSettings):
    default_agent_id: str
    default_agent_phone_number_id: str


def get_call_service_settings() -> CallServiceSettings:
    return CallServiceSettings()
