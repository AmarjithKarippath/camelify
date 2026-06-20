"""FastAPI application entrypoint."""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware

from app.config import get_settings
from app.routers import (
    admin,
    auth,
    feedback,
    health,
    imports,
    links,
    profile,
    public,
    uploads,
    users,
)

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Path(settings.media_root).mkdir(parents=True, exist_ok=True)
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        docs_url="/docs",
        redoc_url=None,
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # Outermost middleware — CORS must run first so OPTIONS preflight succeeds.
    app.add_middleware(
        SessionMiddleware,
        secret_key=settings.secret_key,
        same_site="lax",
        https_only=settings.session_cookie_secure,
        max_age=60 * 10,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Serve user-uploaded files at /media/*
    media_path = Path(settings.media_root)
    media_path.mkdir(parents=True, exist_ok=True)
    app.mount("/media", StaticFiles(directory=str(media_path)), name="media")

    app.include_router(health.router)

    v1 = settings.api_v1_prefix
    app.include_router(auth.router, prefix=v1)
    app.include_router(imports.router, prefix=v1)
    app.include_router(users.router, prefix=v1)
    app.include_router(profile.router, prefix=v1)
    app.include_router(links.router, prefix=v1)
    app.include_router(uploads.router, prefix=v1)
    app.include_router(feedback.router, prefix=v1)
    app.include_router(admin.router, prefix=v1)
    app.include_router(public.router, prefix=v1)

    return app


app = create_app()
