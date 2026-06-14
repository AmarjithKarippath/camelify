"""Link — a single row on a creator's public page."""

from datetime import datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base

# kind values
LINK_KIND_FEATURED = "featured"  # big dark pill at top, only one allowed
LINK_KIND_LINK = "link"          # standard outlined pill
LINK_KIND_SOCIAL = "social"      # small circular icon, shown in social row

# platform values
PLATFORMS = {
    "youtube", "instagram", "tiktok", "twitter", "x", "facebook", "linkedin",
    "spotify", "apple_music", "soundcloud", "twitch", "pinterest", "threads",
    "snapchat", "reddit", "whatsapp", "telegram", "discord", "calendly",
    "shopify", "stripe", "mailchimp", "klaviyo", "substack", "rss", "custom",
}


class Link(Base):
    __tablename__ = "links"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    kind: Mapped[str] = mapped_column(String(16), default=LINK_KIND_LINK, nullable=False)
    platform: Mapped[str] = mapped_column(String(32), default="custom", nullable=False)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    url: Mapped[str] = mapped_column(String(2048), nullable=False)
    emoji: Mapped[Optional[str]] = mapped_column(String(8), nullable=True)
    position: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_visible: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user: Mapped["User"] = relationship(back_populates="links")

    __table_args__ = (
        Index("ix_links_user_kind_position", "user_id", "kind", "position"),
    )
