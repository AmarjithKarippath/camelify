#!/usr/bin/env bash
#
# Camelify backup script — runs on the VPS, copies Postgres + media to a
# backup directory and rotates older files. Wire to a cron job.
#
#   crontab -e
#   0 3 * * *  /opt/camelify/scripts/backup.sh >> /var/log/camelify-backup.log 2>&1
#
# Environment:
#   BACKUP_DIR  (default: /var/backups/camelify)
#   KEEP_DAYS   (default: 14)
#   COMPOSE_DIR (default: directory of this script's parent)

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/camelify}"
KEEP_DAYS="${KEEP_DAYS:-14}"
COMPOSE_DIR="${COMPOSE_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
STAMP="$(date +%Y%m%d_%H%M%S)"

mkdir -p "$BACKUP_DIR"

cd "$COMPOSE_DIR"
# shellcheck disable=SC1091
set -a; source .env; set +a

echo "[$(date -Is)] backup starting (target=$BACKUP_DIR)"

# ----- Postgres -----
PG_FILE="$BACKUP_DIR/postgres_${STAMP}.sql.gz"
docker compose exec -T postgres \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" \
  | gzip > "$PG_FILE"
echo "  ✓ postgres → $PG_FILE ($(du -h "$PG_FILE" | cut -f1))"

# ----- Media -----
MEDIA_FILE="$BACKUP_DIR/media_${STAMP}.tar.gz"
tar -czf "$MEDIA_FILE" -C "${MEDIA_HOST_PATH:-./_data/media}" . 2>/dev/null || true
echo "  ✓ media → $MEDIA_FILE ($(du -h "$MEDIA_FILE" | cut -f1))"

# ----- Rotate -----
find "$BACKUP_DIR" -type f -name '*.gz' -mtime "+$KEEP_DAYS" -print -delete \
  | sed 's/^/  ✗ pruned: /'

echo "[$(date -Is)] backup done"
