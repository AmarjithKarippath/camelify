"""Auth — Google OAuth, email/password register & login, /me, logout."""

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.crud import user as user_crud
from app.db import get_db
from app.deps import get_current_user
from app.models.user import User
from app.oauth import oauth
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest
from app.schemas.user import UserRead
from app.security import (
    clear_session_cookie,
    create_access_token,
    hash_password,
    is_email_admin,
    set_session_cookie,
    verify_password,
)


def _to_user_read(user: User) -> UserRead:
    payload = UserRead.model_validate(user)
    payload.is_admin = is_email_admin(user.email)
    return payload

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()


# ----- Email / password -----

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(
    payload: RegisterRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    existing = await user_crud.get_by_email(db, payload.email)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user = await user_crud.create_with_password(
        db,
        email=payload.email,
        password_hash=hash_password(payload.password),
        name=payload.name,
    )
    set_session_cookie(response, user.id)
    return AuthResponse(user=_to_user_read(user))


@router.post("/login", response_model=AuthResponse)
async def login(
    payload: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    # Same error for both cases to avoid leaking which emails exist.
    invalid = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password.",
    )

    user = await user_crud.get_by_email(db, payload.email)
    if user is None or not user.password_hash:
        raise invalid
    if not verify_password(payload.password, user.password_hash):
        raise invalid

    set_session_cookie(response, user.id)
    return AuthResponse(user=_to_user_read(user))


# ----- Google OAuth -----

@router.get("/google/login", summary="Start Google OAuth")
async def google_login(request: Request):
    return await oauth.google.authorize_redirect(request, settings.google_redirect_uri)


@router.get("/google/callback", summary="Google OAuth callback")
async def google_callback(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"OAuth exchange failed: {exc}",
        ) from exc

    userinfo = token.get("userinfo")
    if not userinfo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google did not return a user profile.",
        )

    user = await user_crud.upsert_from_google(
        db,
        sub=userinfo["sub"],
        email=userinfo["email"],
        name=userinfo.get("name"),
        image=userinfo.get("picture"),
    )

    jwt_token = create_access_token(user.id)
    # After Google OAuth, land in the creator dashboard (separate Vite app).
    response = RedirectResponse(url=settings.dashboard_url, status_code=302)
    response.set_cookie(
        key=settings.session_cookie_name,
        value=jwt_token,
        max_age=settings.access_token_ttl_seconds,
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite="lax",
        path="/",
    )
    return response


# ----- Session -----

@router.post("/logout", summary="Clear session cookie")
async def logout(response: Response):
    clear_session_cookie(response)
    return {"status": "ok"}


@router.get("/me", response_model=UserRead, summary="Current authenticated user")
async def me(user: User = Depends(get_current_user)):
    return _to_user_read(user)
