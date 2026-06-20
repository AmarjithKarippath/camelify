from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, HttpUrl

LinkKind = Literal["featured", "link", "social"]


class LinkRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    kind: LinkKind
    platform: str
    title: str
    url: str
    emoji: Optional[str] = None
    position: int
    is_visible: bool
    created_at: datetime
    updated_at: datetime


class LinkCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=120)
    url: HttpUrl
    kind: LinkKind = "link"
    platform: str = Field(default="custom", max_length=32)
    emoji: Optional[str] = Field(default=None, max_length=8)
    is_visible: bool = True


class LinkBulkCreateItem(BaseModel):
    title: str = Field(..., min_length=1, max_length=120)
    url: HttpUrl
    kind: LinkKind = "link"
    platform: str = Field(default="custom", max_length=32)
    emoji: Optional[str] = Field(default=None, max_length=8)
    is_visible: bool = True


class LinkBulkCreateRequest(BaseModel):
    items: List[LinkBulkCreateItem] = Field(..., min_length=1, max_length=500)


class LinkUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=120)
    url: Optional[HttpUrl] = None
    kind: Optional[LinkKind] = None
    platform: Optional[str] = Field(default=None, max_length=32)
    emoji: Optional[str] = Field(default=None, max_length=8)
    is_visible: Optional[bool] = None


class LinkReorderItem(BaseModel):
    id: str
    position: int = Field(..., ge=0)


class LinkReorderRequest(BaseModel):
    items: List[LinkReorderItem]


class PublicProfile(BaseModel):
    """The full payload for the public storefront page."""
    username: str
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    banner_url: Optional[str] = None
    theme_id: str
    featured: Optional[LinkRead] = None
    links: List[LinkRead] = []
    socials: List[LinkRead] = []
