"""Shared FastAPI dependencies."""

from typing import Optional

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.db import get_db
from app.models.user import User
from app.security import decode_access_token, is_email_admin

settings = get_settings()


async def get_current_user_optional(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """Return the user if a valid session cookie is present, else None."""
    token = request.cookies.get(settings.session_cookie_name)
    if not token:
        return None
    user_id = decode_access_token(token)
    if not user_id:
        return None
    return await db.get(User, user_id)


async def get_current_user(
    user: Optional[User] = Depends(get_current_user_optional),
) -> User:
    """Require an authenticated user — returns 401 otherwise."""
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    return user


async def require_admin(user: User = Depends(get_current_user)) -> User:
    """Require an authenticated user whose email is in the admin list."""
    if not is_email_admin(user.email):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )
    return user
