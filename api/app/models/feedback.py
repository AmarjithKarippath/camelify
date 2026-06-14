"""Feedback — bug reports, feature requests, and other notes from creators."""

from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, Index, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base

# kind values
FEEDBACK_KIND_BUG = "bug"
FEEDBACK_KIND_FEATURE = "feature"
FEEDBACK_KIND_OTHER = "other"

# status values
FEEDBACK_STATUS_NEW = "new"
FEEDBACK_STATUS_IN_REVIEW = "in_review"
FEEDBACK_STATUS_CLOSED = "closed"


class Feedback(Base):
    __tablename__ = "feedback"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    kind: Mapped[str] = mapped_column(String(20), default=FEEDBACK_KIND_OTHER, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default=FEEDBACK_STATUS_NEW, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user: Mapped["User"] = relationship()

    __table_args__ = (
        Index("ix_feedback_status_created", "status", "created_at"),
        Index("ix_feedback_user_created", "user_id", "created_at"),
    )
