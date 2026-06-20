"""Fetch and parse public Linktree profiles for onboarding import."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from typing import Any
from urllib.parse import urlparse

import httpx

LINKTREE_USERNAME_RE = re.compile(
    r"^(?:https?://)?(?:www\.)?linktr\.ee/(?P<username>[A-Za-z0-9_]+)(?:[/?#]|$)",
    re.IGNORECASE,
)
NEXT_DATA_RE = re.compile(
    r'<script id="__NEXT_DATA__"[^>]*>(?P<payload>.*?)</script>',
    re.DOTALL,
)
LINKTREE_FETCH_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; CamelifyBot/1.0; +https://camelify.com)"
    ),
    "Accept": "text/html,application/xhtml+xml",
}

# Link types that never carry a destination URL.
_SKIP_TYPES = frozenset({"GROUP", "HEADER", "TEXT", "COMMERCE_STORE"})

_SOCIAL_TYPE_MAP = {
    "INSTAGRAM": "instagram",
    "YOUTUBE": "youtube",
    "TIKTOK": "tiktok",
    "TWITTER": "twitter",
    "X": "x",
    "FACEBOOK": "facebook",
    "LINKEDIN": "linkedin",
    "THREADS": "threads",
    "SNAPCHAT": "snapchat",
    "PINTEREST": "pinterest",
    "REDDIT": "reddit",
    "TWITCH": "twitch",
    "SPOTIFY": "spotify",
    "SOUNDCLOUD": "soundcloud",
    "WHATSAPP": "whatsapp",
    "TELEGRAM": "telegram",
    "DISCORD": "discord",
    "EMAIL": "custom",
    "WEBSITE": "custom",
}


class LinktreeImportError(Exception):
    """Raised when a Linktree profile cannot be imported."""


@dataclass
class ImportedLinkItem:
    title: str
    url: str


@dataclass
class LinktreeImportResult:
    username: str
    display_name: str | None
    bio: str | None
    avatar_url: str | None
    links: list[ImportedLinkItem]
    socials: list[ImportedLinkItem]
    skipped_groups: int


def parse_linktree_username(raw: str) -> str:
    value = raw.strip()
    if not value:
        raise LinktreeImportError("Paste your Linktree URL or username.")
    if "@" in value and "://" not in value:
        value = value.lstrip("@")
    if "://" not in value and "/" not in value:
        return value
    match = LINKTREE_USERNAME_RE.match(value)
    if not match:
        raise LinktreeImportError(
            "That doesn't look like a Linktree profile. Example: linktr.ee/yourname"
        )
    return match.group("username")


async def import_linktree_profile(raw: str) -> LinktreeImportResult:
    username = parse_linktree_username(raw)
    html = await _fetch_profile_html(username)
    page_props = _extract_page_props(html)
    account = page_props.get("account") or {}
    raw_links: list[dict[str, Any]] = page_props.get("links") or account.get("links") or []
    social_rows: list[dict[str, Any]] = page_props.get("socialLinks") or []

    links: list[ImportedLinkItem] = []
    skipped_groups = 0

    for row in sorted(raw_links, key=lambda item: item.get("position", 0)):
        link_type = (row.get("type") or "").upper()
        url = (row.get("url") or "").strip()
        if link_type in _SKIP_TYPES or not url:
            if link_type == "GROUP":
                skipped_groups += 1
            continue
        title = _normalize_title(row.get("title"), url)
        links.append(ImportedLinkItem(title=title, url=url))

    socials: list[ImportedLinkItem] = []
    for row in sorted(social_rows, key=lambda item: item.get("position", 0)):
        url = (row.get("url") or "").strip()
        if not url:
            continue
        platform_key = _SOCIAL_TYPE_MAP.get((row.get("type") or "").upper(), "custom")
        title = _social_title(platform_key, url)
        socials.append(ImportedLinkItem(title=title, url=url))

    display_name = (account.get("pageTitle") or account.get("username") or username).strip()
    if display_name.startswith("@"):
        display_name = display_name[1:]

    return LinktreeImportResult(
        username=username,
        display_name=display_name or None,
        bio=(account.get("description") or "").strip() or None,
        avatar_url=account.get("profilePictureUrl") or account.get("customAvatar"),
        links=links,
        socials=socials,
        skipped_groups=skipped_groups,
    )


async def _fetch_profile_html(username: str) -> str:
    url = f"https://linktr.ee/{username}"
    try:
        async with httpx.AsyncClient(timeout=20.0, follow_redirects=True) as client:
            response = await client.get(url, headers=LINKTREE_FETCH_HEADERS)
    except httpx.HTTPError as exc:
        raise LinktreeImportError("Could not reach Linktree. Try again in a moment.") from exc

    if response.status_code == 404:
        raise LinktreeImportError(f"Linktree profile @{username} was not found.")
    if response.status_code >= 400:
        raise LinktreeImportError(
            f"Linktree returned an error (HTTP {response.status_code})."
        )
    return response.text


def _extract_page_props(html: str) -> dict[str, Any]:
    match = NEXT_DATA_RE.search(html)
    if not match:
        raise LinktreeImportError(
            "Could not read that Linktree page. The profile may be private or removed."
        )
    try:
        payload = json.loads(match.group("payload"))
        page_props = payload.get("props", {}).get("pageProps") or {}
    except json.JSONDecodeError as exc:
        raise LinktreeImportError("Linktree returned an unexpected response.") from exc
    if not page_props.get("account"):
        raise LinktreeImportError("That Linktree profile could not be parsed.")
    return page_props


def _normalize_title(raw_title: Any, url: str) -> str:
    title = str(raw_title or "").strip()
    if not title:
        try:
            host = urlparse(url).hostname or "Link"
            title = host.removeprefix("www.")
        except Exception:  # noqa: BLE001
            title = "Link"
    if len(title) > 120:
        title = title[:117].rstrip() + "..."
    return title


def _social_title(platform: str, url: str) -> str:
    labels = {
        "instagram": "Instagram",
        "youtube": "YouTube",
        "tiktok": "TikTok",
        "x": "X",
        "facebook": "Facebook",
        "linkedin": "LinkedIn",
        "threads": "Threads",
        "spotify": "Spotify",
        "twitch": "Twitch",
    }
    return labels.get(platform, "Social link")
