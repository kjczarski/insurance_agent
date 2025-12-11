# Insurance Agent Backend

FastAPI backend for the Insurance Agent application.

## Setup

Install dependencies using UV:
```bash
cd backend
uv sync
```

## Running the Application

```bash
uv run python -m src.app.main
```

Or with uvicorn directly:
```bash
uv run uvicorn src.app.main:app --reload
```

## Running Tests

```bash
uv run pytest
```

## Linting

Check code quality:
```bash
uv run ruff check .
```

Format code:
```bash
uv run ruff format .
```

## Environment Variables

Configuration can be set via environment variables with the `APP_` prefix:

- `APP_DEBUG`: Enable debug mode (default: false)
- `APP_ENVIRONMENT`: Environment name (default: development)
- `APP_HOST`: Server host (default: 0.0.0.0)
- `APP_PORT`: Server port (default: 8000)
