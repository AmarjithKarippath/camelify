# Camelify — Production Deployment (CloudPanel + Docker)

Single-VPS production deployment using CloudPanel for nginx + SSL, and Docker Compose for the three apps + Postgres.

## Architecture

```
Internet ─→ CloudPanel (nginx + Let's Encrypt, on host)
              ├─ camelify.com      → 127.0.0.1:3000  (Next.js web)
              ├─ www.camelify.com  → redirect to camelify.com
              ├─ app.camelify.com  → 127.0.0.1:5173  (Vite dashboard)
              └─ api.camelify.com  → 127.0.0.1:8000  (FastAPI)
                                          │
                                          ▼
                                 Postgres 16 (docker-internal only)
```

---

## 1. VPS prerequisites

You should already have these from CloudPanel:
- Docker
- Docker Compose v2

Verify:
```bash
docker --version
docker compose version
```

If missing on a fresh VPS:
```bash
curl -fsSL https://get.docker.com | sh
sudo systemctl enable --now docker
```

---

## 2. DNS

Point these A records at the VPS IP:

| Host | Type | Target |
|---|---|---|
| `camelify.com` | A | (VPS IPv4) |
| `www.camelify.com` | A | (VPS IPv4) |
| `app.camelify.com` | A | (VPS IPv4) |
| `api.camelify.com` | A | (VPS IPv4) |

Wait for DNS to propagate before requesting SSL in CloudPanel.

---

## 3. Clone the repo on the VPS

```bash
sudo mkdir -p /opt/camelify
sudo chown $USER:$USER /opt/camelify
cd /opt/camelify
git clone <your-repo-url> .
```

---

## 4. Create persistent data directories

```bash
sudo mkdir -p /var/lib/camelify/postgres /var/lib/camelify/media
sudo chown -R 999:999 /var/lib/camelify/postgres   # postgres image UID
sudo chown -R 1001:1001 /var/lib/camelify/media    # fastapi user UID in our image
```

Postgres data and uploaded avatars live outside Docker — they survive `docker compose down`, image rebuilds, and CloudPanel updates.

---

## 5. Configure env

```bash
cp .env.prod.example .env
nano .env
```

Required:
- `SECRET_KEY` — `openssl rand -hex 32`
- `POSTGRES_PASSWORD` — `openssl rand -base64 24`
- `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`

Set the host paths to the dirs created above:
```
MEDIA_HOST_PATH=/var/lib/camelify/media
POSTGRES_HOST_PATH=/var/lib/camelify/postgres
```

---

## 6. Google OAuth — add prod redirect URI

[Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials) → Edit your OAuth client → **Authorized redirect URIs**, add:

```
https://api.camelify.com/v1/auth/google/callback
```

And **Authorized JavaScript origins**:
```
https://camelify.com
https://app.camelify.com
```

---

## 7. Build + start the stack

```bash
cd /opt/camelify
docker compose up -d --build
```

This:
- Builds all three app images using build args from `.env`
- Starts Postgres + waits for healthcheck
- Runs Alembic migrations automatically on api boot
- Starts all four containers

Verify:
```bash
docker compose ps        # all healthy?
make prod-logs           # any errors?
curl http://127.0.0.1:8000/healthz       # → {"status":"ok"}
curl http://127.0.0.1:8000/readyz        # → {"status":"ready"} (DB check)
curl http://127.0.0.1:3000/              # landing page HTML
curl http://127.0.0.1:5173/              # dashboard HTML shell
```

---

## 8. Create the three sites in CloudPanel

For each domain below, in CloudPanel:

1. **Sites → Add Site → Reverse Proxy**
2. Domain name (see table)
3. Reverse proxy target: `http://127.0.0.1:PORT`
4. Save
5. **SSL/TLS** tab → **Issue Let's Encrypt certificate** → enable HSTS
6. **Settings → Security** → add your IP to allowlist for `/docs` if you want (optional)

| Site | Reverse-proxy target |
|---|---|
| `camelify.com` | `http://127.0.0.1:3000` |
| `app.camelify.com` | `http://127.0.0.1:5173` |
| `api.camelify.com` | `http://127.0.0.1:8000` |

For `www.camelify.com`: create a separate site that redirects to `https://camelify.com` (CloudPanel has a built-in **Redirect** site type).

---

## 9. Tune the API nginx site for uploads

Avatars can be up to 5 MB + multipart overhead. CloudPanel's nginx defaults are usually under that.

In CloudPanel → **api.camelify.com** → **Vhost** → add inside the `server { ... }` block:

```nginx
client_max_body_size 10m;
proxy_read_timeout 60s;
proxy_send_timeout 60s;
proxy_request_buffering off;
```

Save. CloudPanel reloads nginx automatically.

---

## 10. Verify end-to-end

Hit each domain in a browser:

1. `https://camelify.com` → landing page, valid HTTPS
2. `https://camelify.com/signup` → register form
3. Sign up → redirected to `https://app.camelify.com/onboarding`
4. Walk the onboarding wizard, upload an avatar
5. Finish → `https://app.camelify.com/`
6. `https://camelify.com/{your-username}` → storefront with avatar visible
7. Sign out → back at `https://camelify.com`
8. Sign in with Google → also lands on dashboard

---

## 11. Set up nightly backups

```bash
sudo mkdir -p /var/backups/camelify /var/log
sudo touch /var/log/camelify-backup.log
sudo chown $USER:$USER /var/log/camelify-backup.log

crontab -e
```

Add:
```
0 3 * * *  /opt/camelify/scripts/backup.sh >> /var/log/camelify-backup.log 2>&1
```

This dumps Postgres and tars the media directory every day at 03:00, keeping the last 14 days in `/var/backups/camelify/`.

Run one once manually to verify:
```bash
make prod-backup
ls -lh /var/backups/camelify/
```

For off-site copies, point CloudPanel's S3-compatible backup feature at `/var/backups/camelify/`, or `rclone sync` to a bucket.

---

## Day-to-day operations

```bash
cd /opt/camelify

make prod-logs            # tail logs
make prod-ps              # container health
make prod-restart         # restart everything
make prod-shell-api       # shell into the FastAPI container

# After pulling new code
make prod-deploy          # pull + rebuild + migrate + restart

# Just migrations
make prod-migrate

# Manual backup
make prod-backup
```

---

## Updating a single service

```bash
docker compose build api
docker compose up -d api
docker compose exec api alembic upgrade head    # if schema changed
```

Same pattern for `web` and `dashboard`.

---

## Rolling back

The Alembic migrations are versioned; to roll back one:

```bash
docker compose exec api alembic downgrade -1
```

To roll back the apps to a previous commit:

```bash
git checkout <previous-sha>
make prod-deploy
```

---

## Where things live on disk

| Item | Path |
|---|---|
| Code | `/opt/camelify/` |
| Postgres data | `/var/lib/camelify/postgres/` |
| Uploaded media | `/var/lib/camelify/media/` |
| Daily backups | `/var/backups/camelify/` |
| Backup logs | `/var/log/camelify-backup.log` |
| CloudPanel nginx vhost configs | `/etc/nginx/sites-enabled/` (read-only via UI) |

---

## Troubleshooting

### "ECONNREFUSED" between web and api

The web container reaches the API via the internal Docker DNS at `http://api:8000`, set by `NEXT_INTERNAL_API_URL` in the compose file. If you see ECONNREFUSED, both containers may not be on the same network — run `docker network inspect camelify_camelify` and confirm both are present.

### 502 Bad Gateway from CloudPanel

CloudPanel's nginx can't reach `127.0.0.1:PORT`. Check:
```bash
ss -ltnp | grep 127.0.0.1
```
You should see the three ports listening on 127.0.0.1 only (not 0.0.0.0).

### Avatar upload returns 413

CloudPanel's nginx `client_max_body_size` is too small — see step 9.

### Cookie not stuck after login

Verify in the browser dev tools:
- Cookie name: `cm_session`
- Domain: `api.camelify.com`
- `Secure: ✓` and `HttpOnly: ✓` and `SameSite: Lax`

`app.camelify.com` ↔ `api.camelify.com` are same-site (both under `camelify.com`), so SameSite=Lax allows credentialed fetches across them.

### Migrations fail on first boot

The api container runs `alembic upgrade head` as part of its startup command. Tail logs:
```bash
docker compose logs api | head -50
```
If the DB isn't reachable, check `docker compose ps postgres` — postgres has to be healthy first.
