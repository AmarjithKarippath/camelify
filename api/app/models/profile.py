"""Profile — the public storefront identity."""

from datetime import date, datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import Date, DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )

    username: Mapped[str] = mapped_column(String(40), unique=True, index=True, nullable=False)
    display_name: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(String(280), nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    banner_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    theme_id: Mapped[str] = mapped_column(String(40), default="minimal", nullable=False)

    # Onboarding fields
    dob: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(40), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user: Mapped["User"] = relationship(back_populates="profile")
