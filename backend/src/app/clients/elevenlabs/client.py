import httpx
from loguru import logger

from app.clients.elevenlabs.config import ElevenLabsSettings
from app.clients.elevenlabs.models import (
    ElevenLabsError,
    PhoneCallRequest,
    PhoneCallResponse,
)


class ElevenLabsClient:
    def __init__(self, settings: ElevenLabsSettings) -> None:
        self.settings = settings
        self.client = httpx.AsyncClient(
            base_url=settings.base_url,
            timeout=settings.timeout,
            headers={
                "xi-api-key": settings.api_key,
                "Content-Type": "application/json",
            },
        )

    async def _request(
        self,
        method: str,
        path: str,
        json: dict | None = None,
    ) -> dict:
        try:
            response = await self.client.request(method, path, json=json)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"ElevenLabs API error: {e.response.status_code} - {e.response.text}")
            raise ElevenLabsError(
                message=f"API request failed: {e.response.text}",
                status_code=e.response.status_code,
            ) from e
        except httpx.RequestError as e:
            logger.error(f"ElevenLabs request error: {e}")
            raise ElevenLabsError(message=f"Request failed: {e}") from e

    async def create_phone_call(self, request: PhoneCallRequest) -> PhoneCallResponse:
        data = await self._request(
            method="POST",
            path="/v1/convai/twilio/outbound-call",
            json={
                "agent_id": request.agent_id,
                "agent_phone_number_id": request.agent_phone_number_id,
                "to_number": request.phone_number,
            },
        )
        return PhoneCallResponse(
            call_id=data.get("call_id", ""),
            agent_id=request.agent_id,
            phone_number=request.phone_number,
            status=data.get("status", "initiated"),
        )

    async def close(self) -> None:
        await self.client.aclose()


def create_elevenlabs_client(settings: ElevenLabsSettings) -> ElevenLabsClient:
    return ElevenLabsClient(settings)
