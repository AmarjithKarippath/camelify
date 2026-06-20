"""Application settings, loaded from environment variables."""

from functools import lru_cache
from typing import List

import logging

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)


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
            "https://www.camelify.com",
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

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: object) -> List[str]:
        if isinstance(value, str):
            import json

            return json.loads(value)
        return value  # type: ignore[return-value]

    @model_validator(mode="after")
    def expand_cors_www_pairs(self) -> "Settings":
        # Signup/login on the marketing site may be served from www while CORS
        # only lists the apex domain — auto-include both variants.
        expanded = list(self.cors_origins)
        for origin in self.cors_origins:
            paired = _www_origin_pair(origin)
            if paired and paired not in expanded:
                expanded.append(paired)
        self.cors_origins = expanded
        return self

    @model_validator(mode="after")
    def disable_secure_cookies_for_http_oauth(self) -> "Settings":
        # OAuth state lives in the session cookie between /login and /callback.
        # Secure cookies are ignored by browsers on http://, which breaks Google auth locally.
        if self.session_cookie_secure and self.google_redirect_uri.startswith("http://"):
            logger.warning(
                "SESSION_COOKIE_SECURE is true but GOOGLE_REDIRECT_URI is http — "
                "disabling secure session cookies for local OAuth."
            )
            self.session_cookie_secure = False
        return self


def _www_origin_pair(origin: str) -> str | None:
    """Return apex ↔ www counterpart for a bare marketing-site origin."""
    if origin == "https://camelify.com":
        return "https://www.camelify.com"
    if origin == "https://www.camelify.com":
        return "https://camelify.com"
    if origin == "http://localhost:3000":
        return None
    return None


@lru_cache
def get_settings() -> Settings:
    return Settings()
