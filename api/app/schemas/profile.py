import re
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

USERNAME_PATTERN = re.compile(r"^[a-z0-9][a-z0-9_-]{2,39}$")

RESERVED_USERNAMES: set[str] = {
    "about", "admin", "api", "app", "auth", "billing", "camelify", "blog",
    "contact", "dashboard", "faq", "features", "help", "home", "login",
    "logout", "onboarding", "pricing", "privacy", "settings", "signup",
    "support", "terms", "u", "user", "users", "www",
}

ALLOWED_CATEGORIES: set[str] = {
    "fitness", "fashion", "beauty", "food", "travel", "music", "gaming",
    "tech", "business", "finance", "education", "art", "photography",
    "lifestyle", "comedy", "parenting", "other",
}


def normalize_username(value: str) -> str:
    return value.strip().lower()


def validate_username_format(value: str) -> str:
    v = normalize_username(value)
    if not USERNAME_PATTERN.match(v):
        raise ValueError(
            "Username must be 3-40 chars, start with a letter or number, "
            "and only contain lowercase letters, numbers, '-' or '_'."
        )
    if v in RESERVED_USERNAMES:
        raise ValueError("That username is reserved.")
    return v


class ProfileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    username: str
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    banner_url: Optional[str] = None
    theme_id: str
    dob: Optional[date] = None
    category: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class ProfileUpsert(BaseModel):
    username: str = Field(..., min_length=3, max_length=40)
    display_name: Optional[str] = Field(default=None, max_length=80)
    bio: Optional[str] = Field(default=None, max_length=280)
    avatar_url: Optional[str] = Field(default=None, max_length=1024)
    banner_url: Optional[str] = Field(default=None, max_length=1024)
    theme_id: str = Field(default="minimal", max_length=40)
    dob: Optional[date] = None
    category: Optional[str] = Field(default=None, max_length=40)

    @field_validator("username")
    @classmethod
    def _username(cls, v: str) -> str:
        return validate_username_format(v)

    @field_validator("category")
    @classmethod
    def _category(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "":
            return None
        v = v.strip().lower()
        if v not in ALLOWED_CATEGORIES:
            raise ValueError(f"Category must be one of: {', '.join(sorted(ALLOWED_CATEGORIES))}.")
        return v


class UsernameAvailability(BaseModel):
    username: str
    available: bool
    reason: Optional[str] = None
