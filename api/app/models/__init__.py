"""Importing all models here ensures Alembic sees them via Base.metadata."""

from app.models.feedback import Feedback  # noqa: F401
from app.models.link import Link  # noqa: F401
from app.models.profile import Profile  # noqa: F401
from app.models.user import User  # noqa: F401
