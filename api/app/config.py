"""Application settings, loaded from environment variables."""

from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ----- App -----
    app_env: str = Field(default="development")
    app_name: str = Field(default="Camelify API")
    api_v1_prefix: str = Field(default="/v1")
    cors_origins: List[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
            "http://localhost:5173",
            "https://camelify.com",
            "https://app.camelify.com",
        ]
    )

    # ----- Database -----
    # asyncpg DSN, e.g. postgresql+asyncpg://user:pass@host:5432/db
    database_url: str = Field(
        default="postgresql+asyncpg://camelify:camelify@localhost:5432/camelify"
    )

    # ----- Security (used by slice 2) -----
    secret_key: str = Field(default="change-me-please")
    jwt_algorithm: str = Field(default="HS256")
    access_token_ttl_seconds: int = Field(default=60 * 60 * 24 * 7)  # 7 days
    session_cookie_name: str = Field(default="cm_session")
    session_cookie_secure: bool = Field(default=False)  # True in prod

    # ----- Google OAuth (used by slice 2) -----
    google_client_id: str = Field(default="")
    google_client_secret: str = Field(default="")
    google_redirect_uri: str = Field(
        default="http://localhost:8000/v1/auth/google/callback"
    )

    # ----- Frontends -----
    # Marketing + storefront app (Next.js)
    frontend_url: str = Field(default="http://localhost:3000")
    # Creator dashboard (Vite)
    dashboard_url: str = Field(default="http://localhost:5173")

    # ----- Admin -----
    admin_emails: List[str] = Field(
        default_factory=lambda: ["buildbeyondlimit1@gmail.com"]
    )

    # ----- Media / uploads -----
    # Local filesystem path inside the container where uploads are written.
    media_root: str = Field(default="/app/media")
    # Base URL the browser uses to fetch uploads. In prod this is a CDN.
    media_public_url: str = Field(default="http://localhost:8000/media")
    # Caps for the avatar upload endpoint.
    avatar_max_bytes: int = Field(default=5 * 1024 * 1024)  # 5 MB


@lru_cache
def get_settings() -> Settings:
    return Settings()
