import pytest


@pytest.fixture
def settings():
    from src.app.core.config import Settings
    return Settings(
        app_name="Test App",
        debug=True,
        environment="test",
    )
