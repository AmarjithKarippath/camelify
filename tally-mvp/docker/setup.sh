#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"
ENV_FILE="$SCRIPT_DIR/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  cp "$SCRIPT_DIR/.env.example" "$ENV_FILE"
  echo "Created $ENV_FILE from example"
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

SITE_NAME="${SITE_NAME:-frontend}"

echo "==> Waiting for ERPNext site to be ready..."
for i in $(seq 1 60); do
  if docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T backend \
    test -d "/home/frappe/frappe-bench/sites/$SITE_NAME" 2>/dev/null; then
    echo "Site $SITE_NAME found"
    break
  fi
  if [[ $i -eq 60 ]]; then
    echo "Timeout: site $SITE_NAME not created. Check: make logs"
    exit 1
  fi
  sleep 10
done

echo "==> Installing tally_mvp app..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T backend bash -c "
  cd /home/frappe/frappe-bench
  if ! bench --site $SITE_NAME list-apps 2>/dev/null | grep -q tally_mvp; then
    bench --site $SITE_NAME install-app tally_mvp
  else
    echo 'tally_mvp already installed'
  fi
  bench --site $SITE_NAME migrate
"

echo "==> Running India GST company setup..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T backend \
  bench --site "$SITE_NAME" execute tally_mvp.setup.india_gst.setup_company

echo "==> Setup complete!"
echo "    URL:   http://localhost:${HTTP_PORT:-8080}"
echo "    Login: Administrator / ${ADMIN_PASSWORD:-admin}"
echo "    Next:  make seed   (demo data)"
echo "           make migrate (opening balances from CSV)"
