from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


async def get_by_id(db: AsyncSession, user_id: str) -> Optional[User]:
    return await db.get(User, user_id)


async def get_by_email(db: AsyncSession, email: str) -> Optional[User]:
    stmt = select(User).where(User.email == email.lower())
    return (await db.execute(stmt)).scalar_one_or_none()


async def get_by_google_sub(db: AsyncSession, sub: str) -> Optional[User]:
    stmt = select(User).where(User.google_sub == sub)
    return (await db.execute(stmt)).scalar_one_or_none()


async def create_with_password(
    db: AsyncSession,
    *,
    email: str,
    password_hash: str,
    name: Optional[str] = None,
) -> User:
    user = User(email=email.lower(), password_hash=password_hash, name=name)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def upsert_from_google(
    db: AsyncSession,
    *,
    sub: str,
    email: str,
    name: Optional[str],
    image: Optional[str],
) -> User:
    """Find or create a user from a Google ID-token payload."""
    user = await get_by_google_sub(db, sub)
    if user is None:
        user = await get_by_email(db, email)
        if user is None:
            user = User(email=email.lower(), name=name, image=image, google_sub=sub)
            db.add(user)
        else:
            user.google_sub = sub
            user.name = user.name or name
            user.image = user.image or image
    else:
        if name and user.name != name:
            user.name = name
        if image and user.image != image:
            user.image = image

    await db.commit()
    await db.refresh(user)
    return user


async def update_user(
    db: AsyncSession, user: User, *, name: Optional[str] = None, image: Optional[str] = None
) -> User:
    if name is not None:
        user.name = name
    if image is not None:
        user.image = image
    await db.commit()
    await db.refresh(user)
    return user


async def delete_user(db: AsyncSession, user: User) -> None:
    await db.delete(user)
    await db.commit()
