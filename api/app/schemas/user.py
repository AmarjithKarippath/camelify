from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    email: EmailStr
    name: Optional[str] = None
    image: Optional[str] = None
    created_at: datetime
    is_admin: bool = False


class UserUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=255)
    image: Optional[str] = Field(default=None, max_length=1024)
