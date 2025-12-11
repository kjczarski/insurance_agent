from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from src.app.clients.elevenlabs.client import create_elevenlabs_client
from src.app.core.config import get_settings
from src.app.core.logging import setup_logging
from src.app.routes.calls.routes import create_calls_router
from src.app.services.call.database import create_transcript_repository
from src.app.services.call.service import create_call_service


def create_app() -> FastAPI:
    settings = get_settings()
    setup_logging(debug=settings.debug)
    
    logger.info(f"Starting {settings.app_name} in {settings.environment} mode")
    
    app = FastAPI(
        title=settings.app_name,
        debug=settings.debug,
    )
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    transcript_repository = create_transcript_repository()
    elevenlabs_client = create_elevenlabs_client(settings.elevenlabs)
    call_service = create_call_service(
        elevenlabs_client, 
        settings.call_service,
        transcript_repository
    )
    calls_router = create_calls_router(call_service, settings.elevenlabs, settings.api_prefix)
    
    app.include_router(calls_router.get_router())
    
    @app.get("/health")
    async def health_check() -> dict[str, str]:
        return {"status": "healthy"}
    
    @app.on_event("startup")
    async def startup_event() -> None:
        await transcript_repository.initialize()
    
    @app.on_event("shutdown")
    async def shutdown_event() -> None:
        await elevenlabs_client.close()
    
    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    
    settings = get_settings()
    uvicorn.run(
        "src.app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )
