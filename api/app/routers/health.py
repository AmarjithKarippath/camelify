"""Health endpoints — used by Docker healthchecks and uptime monitors."""

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db

router = APIRouter(tags=["health"])


@router.get("/healthz", summary="Liveness probe")
async def liveness() -> dict:
    """Returns 200 if the process is up. No DB check."""
    return {"status": "ok"}


@router.get("/readyz", summary="Readiness probe")
async def readiness(db: AsyncSession = Depends(get_db)) -> dict:
    """Returns 200 if the DB is reachable."""
    await db.execute(text("SELECT 1"))
    return {"status": "ready"}
