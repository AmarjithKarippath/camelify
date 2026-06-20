from pydantic import BaseModel, Field


class LinktreeImportRequest(BaseModel):
    url: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Linktree profile URL or username, e.g. linktr.ee/yourname",
    )


class ImportedLinkOut(BaseModel):
    title: str
    url: str


class LinktreeImportResponse(BaseModel):
    username: str
    display_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    links: list[ImportedLinkOut]
    socials: list[ImportedLinkOut]
    skipped_groups: int = 0
    total_imported: int
