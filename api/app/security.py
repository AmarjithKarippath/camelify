"""Security helpers: JWT, password hashing, cookie issuance."""

from datetime import datetime, timedelta, timezone
from typing import Optional

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHashError
from fastapi import Response
from jose import JWTError, jwt

from app.config import get_settings

settings = get_settings()

_password_hasher = PasswordHasher()


# ----- Admin -----

def is_email_admin(email: str) -> bool:
    """True if the email is in the configured admin list."""
    target = email.strip().lower()
    return any(target == admin.strip().lower() for admin in settings.admin_emails)


# ----- Passwords -----

def hash_password(plain: str) -> str:
    return _password_hasher.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return _password_hasher.verify(hashed, plain)
    except (VerifyMismatchError, InvalidHashError):
        return False


# ----- JWT -----

def create_access_token(user_id: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "iat": now,
        "exp": now + timedelta(seconds=settings.access_token_ttl_seconds),
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.jwt_algorithm]
        )
        return payload.get("sub")
    except JWTError:
        return None


# ----- Cookie helpers -----

def set_session_cookie(response: Response, user_id: str) -> None:
    """Issue an HttpOnly JWT cookie for the user."""
    token = create_access_token(user_id)
    response.set_cookie(
        key=settings.session_cookie_name,
        value=token,
        max_age=settings.access_token_ttl_seconds,
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite="lax",
        path="/",
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(
        key=settings.session_cookie_name,
        path="/",
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite="lax",
    )
