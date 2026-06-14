"""Public storefront — consumed by Next.js SSR."""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import link as link_crud
from app.crud import profile as profile_crud
from app.db import get_db
from app.schemas.link import LinkRead, PublicProfile

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/{username}", response_model=PublicProfile)
async def get_storefront(username: str, db: AsyncSession = Depends(get_db)):
    profile = await profile_crud.get_by_username(db, username)
    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found."
        )

    visible = await link_crud.list_visible_for_user(db, profile.user_id)
    featured = next((link for link in visible if link.kind == "featured"), None)
    links = [link for link in visible if link.kind == "link"]
    socials = [link for link in visible if link.kind == "social"]

    return PublicProfile(
        username=profile.username,
        display_name=profile.display_name,
        bio=profile.bio,
        avatar_url=profile.avatar_url,
        banner_url=profile.banner_url,
        theme_id=profile.theme_id,
        featured=LinkRead.model_validate(featured) if featured else None,
        links=[LinkRead.model_validate(link) for link in links],
        socials=[LinkRead.model_validate(link) for link in socials],
    )


@router.get(
    "/click/{link_id}",
    summary="Server-side redirect that logs a click",
    responses={302: {"description": "Redirect to the link's URL."}},
)
async def click_link(link_id: str, db: AsyncSession = Depends(get_db)):
    """Logs a click (slice 5) then 302s to the destination URL."""
    from app.models.link import Link  # local import to avoid circulars

    link = await db.get(Link, link_id)
    if link is None or not link.is_visible:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Link not found."
        )
    # TODO (slice 5): write a LinkClick row here
    return RedirectResponse(url=link.url, status_code=302)
