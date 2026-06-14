"""Avatar uploads. Local filesystem for MVP; swap for S3/R2 later."""

import time
from pathlib import Path
from typing import Set

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.crud import profile as profile_crud
from app.db import get_db
from app.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/uploads", tags=["uploads"])
settings = get_settings()

ALLOWED_EXTENSIONS: Set[str] = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
ALLOWED_MIME = {
    "image/jpeg", "image/png", "image/webp", "image/gif",
}


class AvatarUploadResponse(BaseModel):
    url: str


@router.post("/avatar", response_model=AvatarUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_avatar(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # ---- Validate ----
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}.",
        )

    if file.content_type and file.content_type.lower() not in ALLOWED_MIME:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported image type.",
        )

    contents = await file.read()
    if len(contents) > settings.avatar_max_bytes:
        max_mb = settings.avatar_max_bytes / (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Max {max_mb:.0f} MB.",
        )

    if len(contents) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Empty file.",
        )

    # ---- Write to disk ----
    avatars_dir = Path(settings.media_root) / "avatars"
    avatars_dir.mkdir(parents=True, exist_ok=True)

    # Timestamp suffix forces cache invalidation when the image changes.
    filename = f"{user.id}_{int(time.time())}{ext}"
    path = avatars_dir / filename
    path.write_bytes(contents)

    public_url = f"{settings.media_public_url.rstrip('/')}/avatars/{filename}"

    # ---- If the user already has a profile, update its avatar_url ----
    profile = await profile_crud.get_by_user_id(db, user.id)
    if profile is not None:
        profile.avatar_url = public_url
        await db.commit()

    return AvatarUploadResponse(url=public_url)
