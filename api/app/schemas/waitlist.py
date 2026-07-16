from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class WaitlistCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=6, max_length=40)
    source: str = Field(default="landing", max_length=60)


class WaitlistRead(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    source: str
    created_at: datetime

    model_config = {"from_attributes": True}
