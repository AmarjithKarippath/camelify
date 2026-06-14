"""Admin-only endpoints. Access gated by ADMIN_EMAILS env var."""

from datetime import date, datetime, timedelta, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import cast, Date, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import require_admin
from app.models.user import User

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
