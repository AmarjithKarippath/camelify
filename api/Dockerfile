# syntax=docker/dockerfile:1.7

# ---------- Base ----------
FROM python:3.12-slim AS base
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1
WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends curl build-essential libpq-dev \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -r requirements.txt

# ---------- Dev ----------
FROM base AS dev
ENV APP_ENV=development
COPY . .
EXPOSE 8000
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]

# ---------- Production ----------
FROM base AS runner
ENV APP_ENV=production
COPY . .

RUN groupadd --system --gid 1001 fastapi \
 && useradd --system --uid 1001 --gid fastapi --no-create-home fastapi \
 && chown -R fastapi:fastapi /app
USER fastapi

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -fsS http://127.0.0.1:8000/healthz || exit 1

CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2"]
