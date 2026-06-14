from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

FeedbackKind = Literal["bug", "feature", "other"]
FeedbackStatus = Literal["new", "in_review", "closed"]


class FeedbackCreate(BaseModel):
    kind: FeedbackKind = "other"
    message: str = Field(..., min_length=3, max_length=4000)


class FeedbackRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    kind: FeedbackKind
    message: str
    status: FeedbackStatus
    created_at: datetime
    updated_at: datetime


class AdminFeedbackItem(BaseModel):
    """Feedback row enriched with the author's email/name for admin views."""
    id: str
    kind: FeedbackKind
    message: str
    status: FeedbackStatus
    created_at: datetime
    updated_at: datetime
    user_id: str
    user_email: str
    user_name: Optional[str] = None


class FeedbackStatusUpdate(BaseModel):
    status: FeedbackStatus
