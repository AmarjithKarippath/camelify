"""Third-party profile import — Linktree, etc."""

from fastapi import APIRouter, Depends, HTTPException, status

from app.deps import get_current_user
from app.models.user import User
from app.schemas.import_schema import (
    ImportedLinkOut,
    LinktreeImportRequest,
    LinktreeImportResponse,
)
from app.services.linktree_import import LinktreeImportError, import_linktree_profile

router = APIRouter(prefix="/import", tags=["import"])


@router.post("/linktree", response_model=LinktreeImportResponse)
async def import_from_linktree(
    payload: LinktreeImportRequest,
    _: User = Depends(get_current_user),
):
    try:
        result = await import_linktree_profile(payload.url)
    except LinktreeImportError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    links = [ImportedLinkOut(title=item.title, url=item.url) for item in result.links]
    socials = [
        ImportedLinkOut(title=item.title, url=item.url) for item in result.socials
    ]

    return LinktreeImportResponse(
        username=result.username,
        display_name=result.display_name,
        bio=result.bio,
        avatar_url=result.avatar_url,
        links=links,
        socials=socials,
        skipped_groups=result.skipped_groups,
        total_imported=len(links) + len(socials),
    )
