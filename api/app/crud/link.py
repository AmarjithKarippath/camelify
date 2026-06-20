from typing import List, Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.link import Link


async def list_for_user(db: AsyncSession, user_id: str) -> List[Link]:
    stmt = (
        select(Link)
        .where(Link.user_id == user_id)
        .order_by(Link.kind.asc(), Link.position.asc(), Link.created_at.asc())
    )
    return list((await db.execute(stmt)).scalars())


async def list_visible_for_user(db: AsyncSession, user_id: str) -> List[Link]:
    stmt = (
        select(Link)
        .where(Link.user_id == user_id, Link.is_visible.is_(True))
        .order_by(Link.kind.asc(), Link.position.asc(), Link.created_at.asc())
    )
    return list((await db.execute(stmt)).scalars())


async def get_for_user(db: AsyncSession, link_id: str, user_id: str) -> Optional[Link]:
    stmt = select(Link).where(Link.id == link_id, Link.user_id == user_id)
    return (await db.execute(stmt)).scalar_one_or_none()


async def _next_position(db: AsyncSession, user_id: str, kind: str) -> int:
    stmt = select(func.coalesce(func.max(Link.position), -1)).where(
        Link.user_id == user_id, Link.kind == kind
    )
    current = (await db.execute(stmt)).scalar_one()
    return int(current) + 1


async def create_bulk(db: AsyncSession, user_id: str, payloads: List[dict]) -> List[Link]:
    """Insert many links in one transaction — used after Linktree import."""
    if not payloads:
        return []

    has_featured = any(item.get("kind") == "featured" for item in payloads)
    if has_featured:
        existing_stmt = select(Link).where(
            Link.user_id == user_id, Link.kind == "featured"
        )
        for old in (await db.execute(existing_stmt)).scalars():
            old.kind = "link"
            old.position = await _next_position(db, user_id, "link")

    counters: dict[str, int] = {"featured": 0, "link": 0, "social": 0}
    created: List[Link] = []

    for payload in payloads:
        data = dict(payload)
        kind = data.get("kind", "link")
        data["position"] = counters[kind]
        counters[kind] += 1
        link = Link(user_id=user_id, **data)
        db.add(link)
        created.append(link)

    await db.commit()
    for link in created:
        await db.refresh(link)
    return created


async def create(db: AsyncSession, user_id: str, payload: dict) -> Link:
    # If creating a featured link, demote any existing featured to a regular link.
    if payload.get("kind") == "featured":
        existing_stmt = select(Link).where(
            Link.user_id == user_id, Link.kind == "featured"
        )
        for old in (await db.execute(existing_stmt)).scalars():
            old.kind = "link"
            old.position = await _next_position(db, user_id, "link")

    kind = payload.get("kind", "link")
    payload["position"] = await _next_position(db, user_id, kind)

    link = Link(user_id=user_id, **payload)
    db.add(link)
    await db.commit()
    await db.refresh(link)
    return link


async def update(db: AsyncSession, link: Link, payload: dict) -> Link:
    # If kind is changing TO featured, demote others first.
    new_kind = payload.get("kind")
    if new_kind == "featured" and link.kind != "featured":
        existing_stmt = select(Link).where(
            Link.user_id == link.user_id, Link.kind == "featured", Link.id != link.id
        )
        for old in (await db.execute(existing_stmt)).scalars():
            old.kind = "link"
            old.position = await _next_position(db, link.user_id, "link")

    for key, value in payload.items():
        setattr(link, key, value)

    await db.commit()
    await db.refresh(link)
    return link


async def delete(db: AsyncSession, link: Link) -> None:
    await db.delete(link)
    await db.commit()


async def reorder(db: AsyncSession, user_id: str, items: List[tuple[str, int]]) -> None:
    """Bulk-update positions for links owned by user_id."""
    if not items:
        return

    ids = [item[0] for item in items]
    stmt = select(Link).where(Link.user_id == user_id, Link.id.in_(ids))
    owned = {link.id: link for link in (await db.execute(stmt)).scalars()}

    for link_id, position in items:
        link = owned.get(link_id)
        if link is not None:
            link.position = position

    await db.commit()
