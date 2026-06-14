"""Admin-only endpoints. Access gated by ADMIN_EMAILS env var."""

from datetime import date, datetime, timedelta, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import cast, Date, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import require_admin
from app.models.feedback import Feedback
from app.models.user import User
from app.schemas.feedback import (
    AdminFeedbackItem,
    FeedbackStatus,
    FeedbackStatusUpdate,
)

router = APIRouter(prefix="/admin", tags=["admin"])


class DayCount(BaseModel):
    date: date
    new_users: int


class UsersStatsResponse(BaseModel):
    days: int
    total_all_time: int
    total_in_period: int
    new_today: int
    new_this_week: int
    data: List[DayCount]


@router.get("/stats/users", response_model=UsersStatsResponse)
async def users_stats(
    days: int = Query(default=30, ge=1, le=365),
    _admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Returns registrations per day for the last N days, plus headline counts."""
    now = datetime.now(timezone.utc)
    start_dt = now - timedelta(days=days - 1)
    start_date = start_dt.date()

    # Daily counts in the window.
    stmt = (
        select(
            cast(User.created_at, Date).label("day"),
            func.count(User.id).label("count"),
        )
        .where(User.created_at >= start_dt.replace(hour=0, minute=0, second=0, microsecond=0))
        .group_by(cast(User.created_at, Date))
    )
    rows = (await db.execute(stmt)).all()
    counts: dict[date, int] = {row.day: row.count for row in rows}

    # Fill every day in the range (zeros where there were no signups).
    series: List[DayCount] = []
    total_in_period = 0
    for i in range(days):
        day = start_date + timedelta(days=i)
        new = counts.get(day, 0)
        total_in_period += new
        series.append(DayCount(date=day, new_users=new))

    # Headline totals.
    total_all_time = (await db.execute(select(func.count(User.id)))).scalar_one()

    today = now.date()
    new_today = counts.get(today, 0)

    week_start = today - timedelta(days=6)
    new_this_week = sum(c for d, c in counts.items() if d >= week_start)

    return UsersStatsResponse(
        days=days,
        total_all_time=total_all_time,
        total_in_period=total_in_period,
        new_today=new_today,
        new_this_week=new_this_week,
        data=series,
    )


class RecentUser(BaseModel):
    id: str
    email: str
    name: str | None = None
    created_at: datetime


@router.get("/users/recent", response_model=List[RecentUser])
async def recent_users(
    limit: int = Query(default=10, ge=1, le=100),
    _admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(User).order_by(User.created_at.desc()).limit(limit)
    users = (await db.execute(stmt)).scalars().all()
    return [
        RecentUser(id=u.id, email=u.email, name=u.name, created_at=u.created_at)
        for u in users
    ]


# ---------- Feedback ----------


class FeedbackCounts(BaseModel):
    new: int
    in_review: int
    closed: int
    total: int


class FeedbackListResponse(BaseModel):
    counts: FeedbackCounts
    items: List[AdminFeedbackItem]


@router.get("/feedback", response_model=FeedbackListResponse)
async def list_feedback(
    status_filter: Optional[FeedbackStatus] = Query(default=None, alias="status"),
    limit: int = Query(default=100, ge=1, le=500),
    _admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List feedback enriched with the author's email + name."""
    # Headline counts (always for full table)
    count_stmt = (
        select(Feedback.status, func.count(Feedback.id))
        .group_by(Feedback.status)
    )
    counts_rows = (await db.execute(count_stmt)).all()
    counts_map = {status: count for status, count in counts_rows}
    counts = FeedbackCounts(
        new=int(counts_map.get("new", 0)),
        in_review=int(counts_map.get("in_review", 0)),
        closed=int(counts_map.get("closed", 0)),
        total=int(sum(counts_map.values())),
    )

    # Item list
    stmt = (
        select(Feedback, User)
        .join(User, User.id == Feedback.user_id)
        .order_by(Feedback.created_at.desc())
        .limit(limit)
    )
    if status_filter is not None:
        stmt = stmt.where(Feedback.status == status_filter)

    rows = (await db.execute(stmt)).all()
    items = [
        AdminFeedbackItem(
            id=fb.id,
            kind=fb.kind,
            message=fb.message,
            status=fb.status,
            created_at=fb.created_at,
            updated_at=fb.updated_at,
            user_id=author.id,
            user_email=author.email,
            user_name=author.name,
        )
        for fb, author in rows
    ]
    return FeedbackListResponse(counts=counts, items=items)


@router.patch("/feedback/{feedback_id}", response_model=AdminFeedbackItem)
async def update_feedback_status(
    feedback_id: str,
    payload: FeedbackStatusUpdate,
    _admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    fb = await db.get(Feedback, feedback_id)
    if fb is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found.")

    fb.status = payload.status
    await db.commit()

    author = await db.get(User, fb.user_id)
    return AdminFeedbackItem(
        id=fb.id,
        kind=fb.kind,
        message=fb.message,
        status=fb.status,
        created_at=fb.created_at,
        updated_at=fb.updated_at,
        user_id=fb.user_id,
        user_email=author.email if author else "",
        user_name=author.name if author else None,
    )
