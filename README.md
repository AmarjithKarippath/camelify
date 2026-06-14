# Camelify

Creator-first link-in-bio. Monorepo with three pieces:

| Folder | Stack | Purpose |
|---|---|---|
| `/` (Next.js root) | Next.js 15, Tailwind, Manrope | Landing page (+ app UI later) |
| `api/` | FastAPI, SQLAlchemy 2.0 async, Alembic, Postgres | JSON API |
| `docker-compose*.yml` | Docker | Local + prod orchestration |

---

**Production deployment**: see [DEPLOY.md](./DEPLOY.md) — VPS + CloudPanel + Docker Compose.

---

## Quick start (everything in Docker)

```bash
cp .env.example .env       # adjust if needed
make dev-up                # web :3000, api :8000, postgres :5432
```

- Landing page: http://localhost:3000
- API docs (Swagger UI): http://localhost:8000/docs
- API health: http://localhost:8000/healthz
- API readiness (DB check): http://localhost:8000/readyz

---

## API — what's in this slice

- `GET /healthz` — process liveness
- `GET /readyz` — verifies DB connection
- `GET /docs` — interactive Swagger UI
- `GET /openapi.json` — OpenAPI schema
- Models: `User`, `Profile`, `Link` (matches PRD)
- Alembic migrations auto-run on container boot
- CORS for `http://localhost:3000` and `https://camelify.com`

### What's coming next (slice 2)

- `POST /v1/auth/google/login` → redirect to Google
- `GET /v1/auth/google/callback` → exchange code, set HttpOnly JWT cookie
- `POST /v1/auth/logout`
- `GET /v1/auth/me`
- `GET/PATCH /v1/profile`
- CRUD on `/v1/links`
- Public `GET /v1/public/{username}`

---

## Migrations (Alembic)

First migration after schema changes:

```bash
# 1. Make sure dev stack is up
make dev-up

# 2. Autogenerate a migration from current models
make db-revision m="initial schema"

# 3. Apply it
make db-upgrade

# 4. Inspect
make db-shell
```

In Docker, migrations run automatically on `api` container startup (`alembic upgrade head` is part of the entrypoint).

---

## Run pieces individually

### Just the web (no Docker)

```bash
make install
make dev
```

### Just the API (no Docker, requires local Postgres)

```bash
make api-install
make api-dev
```

---

## Make targets

```bash
make                  # list everything
make dev-up           # full dev stack (web + api + postgres)
make dev-down
make dev-logs
make dev-shell-api    # shell into the FastAPI container
make dev-shell-web    # shell into the Next.js container

make db-shell         # psql
make db-revision m="message"
make db-upgrade
make db-downgrade
make db-reset         # DESTRUCTIVE

make up               # prod-style stack
make rebuild
make nuke             # destroy everything
```

---

## Project layout

```
.
├── app/                       # Next.js routes (landing page)
├── components/                # Landing page components
├── public/                    # Static assets (favicon, og, avatars/)
├── api/                       # FastAPI service
│   ├── app/
│   │   ├── main.py            # FastAPI entrypoint
│   │   ├── config.py          # Pydantic settings
│   │   ├── db.py              # Async engine + session
│   │   ├── models/            # SQLAlchemy models
│   │   ├── routers/           # Endpoint handlers
│   │   └── schemas/           # Pydantic request/response (slice 2+)
│   ├── alembic/               # Migrations
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml         # prod stack
├── docker-compose.dev.yml     # dev stack with hot reload
├── Dockerfile                 # Next.js
├── Makefile
└── README.md
```
