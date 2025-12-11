from pydantic_settings import BaseSettings


class ElevenLabsSettings(BaseSettings):
    api_key: str
    webhook_secret: str
    base_url: str = "https://api.elevenlabs.io"
    timeout: int = 30


def get_elevenlabs_settings() -> ElevenLabsSettings:
    return ElevenLabsSettings()
