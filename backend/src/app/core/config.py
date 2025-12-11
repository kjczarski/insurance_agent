from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

from app.clients.elevenlabs.config import ElevenLabsSettings, get_elevenlabs_settings
from app.services.call.config import CallServiceSettings, get_call_service_settings


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_nested_delimiter="__",
        env_prefix="APP_",
        env_file=".env.local",
        env_file_encoding="utf-8",
        extra="ignore"
    )
    
    app_name: str = "Insurance Agent API"
    debug: bool = False
    environment: str = "development"
    api_prefix: str = "/api"
    host: str = "0.0.0.0"
    port: int = 8000
    
    elevenlabs: ElevenLabsSettings = Field(default_factory=get_elevenlabs_settings)
    call_service: CallServiceSettings = Field(default_factory=get_call_service_settings)


def get_settings() -> Settings:
    return Settings()
