"""Account-level user endpoints (me)."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import user as user_crud
from app.db import get_db
from app.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserRead, UserUpdate
from app.security import is_email_admin

router = APIRouter(prefix="/users", tags=["users"])


def _to_user_read(user: User) -> UserRead:
    payload = UserRead.model_validate(user)
    payload.is_admin = is_email_admin(user.email)
    return payload


@router.get("/me", response_model=UserRead)
async def get_me(user: User = Depends(get_current_user)):
    return _to_user_read(user)


@router.patch("/me", response_model=UserRead)
async def update_me(
    payload: UserUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    updated = await user_crud.update_user(db, user, name=payload.name, image=payload.image)
    return _to_user_read(updated)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_me(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await user_crud.delete_user(db, user)
