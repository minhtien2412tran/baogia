#!/usr/bin/env bash
# Rotate Jet-Bay production secrets (JWT, refresh, API keys, DB password).
# NEVER prints secret values. Restarts PM2 jetbay-be after update.
set -euo pipefail

APP_ROOT="${APP_ROOT:-/var/www/jetbay-be}"
ENV_FILE="${APP_ROOT}/.env"
BACKUP_DIR="/root/backups/jetbay-secrets-$(date +%Y%m%d-%H%M%S)"
DB_USER="${DB_USER:-jetbay_user}"
DB_NAME="${DB_NAME:-jetbay_db}"

if [ ! -f "${ENV_FILE}" ]; then
  echo "ABORT: ${ENV_FILE} missing"
  exit 1
fi

mkdir -p "${BACKUP_DIR}"
cp -a "${ENV_FILE}" "${BACKUP_DIR}/.env.bak"
chmod 600 "${BACKUP_DIR}/.env.bak"
echo "[rotate] Backup -> ${BACKUP_DIR}/.env.bak (not printed)"

# Generate secrets on server (hex = URL-safe for DATABASE_URL)
JWT="$(openssl rand -hex 48)"
REFRESH="$(openssl rand -hex 48)"
API_KEY="$(openssl rand -hex 32)"
PAYMENT="$(openssl rand -hex 32)"
DB_PASS="$(openssl rand -hex 32)"

# Update PostgreSQL role password first
sudo -u postgres psql -v ON_ERROR_STOP=1 -c \
  "ALTER ROLE ${DB_USER} WITH PASSWORD '${DB_PASS}';" >/dev/null
echo "[rotate] PostgreSQL role password updated for ${DB_USER}"

# Rewrite .env via Python (preserve other keys; never print values)
export ROTATE_JWT="$JWT"
export ROTATE_REFRESH="$REFRESH"
export ROTATE_API_KEY="$API_KEY"
export ROTATE_PAYMENT="$PAYMENT"
export ROTATE_DB_PASS="$DB_PASS"
export ROTATE_DB_USER="$DB_USER"
export ROTATE_DB_NAME="$DB_NAME"

python3 <<'PY'
import os
from pathlib import Path
from urllib.parse import quote_plus

env_path = Path("/var/www/jetbay-be/.env")
text = env_path.read_text()
# Fix accidental literal \n
if "\\n" in text and text.count("\\n") > text.count("\n") // 2:
    text = text.replace("\\n", "\n")

lines = text.splitlines()
keys = {
    "JWT_SECRET": os.environ["ROTATE_JWT"],
    "REFRESH_TOKEN_SECRET": os.environ["ROTATE_REFRESH"],
    "API_KEY": os.environ["ROTATE_API_KEY"],
    "PAYMENT_SECRET": os.environ["ROTATE_PAYMENT"],
    "DB_PASSWORD": os.environ["ROTATE_DB_PASS"],
    "DB_USERNAME": os.environ["ROTATE_DB_USER"],
    "DB_DATABASE": os.environ["ROTATE_DB_NAME"],
    "DB_HOST": "127.0.0.1",
    "DB_PORT": "5432",
}
user = os.environ["ROTATE_DB_USER"]
password = os.environ["ROTATE_DB_PASS"]
dbname = os.environ["ROTATE_DB_NAME"]
keys["DATABASE_URL"] = (
    f"postgresql://{user}:{quote_plus(password)}@127.0.0.1:5432/{dbname}?schema=public"
)

seen = set()
out = []
for line in lines:
    if not line or line.startswith("#") or "=" not in line:
        out.append(line)
        continue
    k, _ = line.split("=", 1)
    if k in keys:
        out.append(f"{k}={keys[k]}")
        seen.add(k)
    else:
        out.append(line)

for k, v in keys.items():
    if k not in seen:
        out.append(f"{k}={v}")

env_path.write_text("\n".join(out) + "\n")
env_path.chmod(0o600)
print("[rotate] .env rewritten; secrets not printed")
print("[rotate] keys updated:", ", ".join(sorted(keys)))
PY

# Clear exported secrets from this shell env
unset ROTATE_JWT ROTATE_REFRESH ROTATE_API_KEY ROTATE_PAYMENT ROTATE_DB_PASS

# Invalidate old refresh tokens (JWT secret changed)
sudo -u postgres psql -v ON_ERROR_STOP=1 -d "${DB_NAME}" -c \
  'TRUNCATE TABLE "RefreshToken";' >/dev/null 2>&1 || true
echo "[rotate] RefreshToken table truncated (users must login again)"

PM2_BIN="${PM2_BIN:-node /usr/lib/node_modules/pm2/bin/pm2}"
${PM2_BIN} restart jetbay-be --update-env
sleep 3

echo "[rotate] Verifying (no secrets)..."
curl -fsS http://127.0.0.1:3010/health >/dev/null
curl -fsS http://127.0.0.1:3010/integrations/status | python3 -c \
  'import sys,json; d=json.load(sys.stdin); print("jwt", d["core"]["jwt"], "db", d["core"]["database"], "redis", d["core"]["redis"])'

# Login smoke
API_KEY_VAL="$(grep -E '^API_KEY=' "${ENV_FILE}" | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
CODE=$(curl -sk -o /tmp/jb-rotate-login.json -w '%{http_code}' \
  -X POST https://api.minhtien.online/auth/login \
  -H 'Content-Type: application/json' \
  -H "X-API-Key: ${API_KEY_VAL}" \
  -d '{"email":"admin@j-ta.local","password":"Admin123!"}')
echo "[rotate] auth/login HTTP ${CODE}"
unset API_KEY_VAL
echo "[rotate] DONE. Backup: ${BACKUP_DIR}"
echo "[rotate] Users must re-login (JWT rotated)."
