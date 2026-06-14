"""Storefront identity — username, bio, theme."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import profile as profile_crud
from app.db import get_db
from app.deps import get_current_user
from app.models.user import User
from app.schemas.profile import (
    ProfileRead,
    ProfileUpsert,
    UsernameAvailability,
    normalize_username,
    validate_username_format,
)

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", response_model=ProfileRead)
async def get_my_profile(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    profile = await profile_crud.get_by_user_id(db, user.id)
    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not yet created.",
        )
    return profile


@router.put("", response_model=ProfileRead)
async def upsert_profile(
    payload: ProfileUpsert,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if await profile_crud.username_taken(db, payload.username, exclude_user_id=user.id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken.",
        )
    return await profile_crud.upsert(db, user.id, payload.model_dump())


@router.get(
    "/username/{username}/availability",
    response_model=UsernameAvailability,
    summary="Check if a username is available",
)
async def check_username(username: str, db: AsyncSession = Depends(get_db)):
    normalized = normalize_username(username)
    try:
        validate_username_format(normalized)
    except ValueError as exc:
        return UsernameAvailability(username=normalized, available=False, reason=str(exc))

    if await profile_crud.username_taken(db, normalized):
        return UsernameAvailability(
            username=normalized, available=False, reason="Already taken."
        )
    return UsernameAvailability(username=normalized, available=True)
