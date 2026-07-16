"""Public waitlist endpoint for Talley landing page."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models.waitlist import WaitlistEntry
from app.schemas.waitlist import WaitlistCreate, WaitlistRead

router = APIRouter(prefix="/waitlist", tags=["waitlist"])


@router.post("", response_model=WaitlistRead, status_code=status.HTTP_201_CREATED)
async def join_waitlist(
    payload: WaitlistCreate,
    db: AsyncSession = Depends(get_db),
):
    email = payload.email.strip().lower()

    existing = await db.execute(
        select(WaitlistEntry).where(WaitlistEntry.email == email)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This email is already on the waiting list.",
        )

    entry = WaitlistEntry(
        name=payload.name.strip(),
        email=email,
        phone=payload.phone.strip(),
        source=payload.source.strip() or "landing",
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry
