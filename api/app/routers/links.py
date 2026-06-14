"""Creator's links — CRUD + reorder."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import link as link_crud
from app.db import get_db
from app.deps import get_current_user
from app.models.user import User
from app.schemas.link import (
    LinkCreate,
    LinkRead,
    LinkReorderRequest,
    LinkUpdate,
)

router = APIRouter(prefix="/links", tags=["links"])


@router.get("", response_model=List[LinkRead])
async def list_links(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await link_crud.list_for_user(db, user.id)


@router.post("", response_model=LinkRead, status_code=status.HTTP_201_CREATED)
async def create_link(
    payload: LinkCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    data = payload.model_dump()
    data["url"] = str(data["url"])
    return await link_crud.create(db, user.id, data)


@router.patch("/{link_id}", response_model=LinkRead)
async def update_link(
    link_id: str,
    payload: LinkUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    link = await link_crud.get_for_user(db, link_id, user.id)
    if link is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Link not found.")

    data = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
    if "url" in data:
        data["url"] = str(data["url"])
    return await link_crud.update(db, link, data)


@router.delete("/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_link(
    link_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    link = await link_crud.get_for_user(db, link_id, user.id)
    if link is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Link not found.")
    await link_crud.delete(db, link)


@router.post("/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_links(
    payload: LinkReorderRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await link_crud.reorder(db, user.id, [(item.id, item.position) for item in payload.items])
