from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.profile import Profile


async def get_by_user_id(db: AsyncSession, user_id: str) -> Optional[Profile]:
    stmt = select(Profile).where(Profile.user_id == user_id)
    return (await db.execute(stmt)).scalar_one_or_none()


async def get_by_username(db: AsyncSession, username: str) -> Optional[Profile]:
    stmt = select(Profile).where(Profile.username == username.lower())
    return (await db.execute(stmt)).scalar_one_or_none()


async def username_taken(
    db: AsyncSession, username: str, exclude_user_id: Optional[str] = None
) -> bool:
    stmt = select(Profile.id).where(Profile.username == username.lower())
    if exclude_user_id:
        stmt = stmt.where(Profile.user_id != exclude_user_id)
    return (await db.execute(stmt)).scalar_one_or_none() is not None


async def upsert(db: AsyncSession, user_id: str, data: dict) -> Profile:
    existing = await get_by_user_id(db, user_id)
    if existing:
        for key, value in data.items():
            setattr(existing, key, value)
        profile = existing
    else:
        profile = Profile(user_id=user_id, **data)
        db.add(profile)
    await db.commit()
    await db.refresh(profile)
    return profile
