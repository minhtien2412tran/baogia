#!/usr/bin/env bash
# GĐ1 prod closure: APP_ENV=production, clear broken MinIO, re-seed, restart, smoke
# Run ON VPS as root:
#   DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI' bash /var/www/jetbay-be/deploy/fix-gd1-prod.sh
set -euo pipefail

if [ "${DEPLOY_CONFIRM:-}" != "ĐỒNG Ý TRIỂN KHAI" ]; then
  echo "Set DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI' to run."
  exit 1
fi

BE_DIR="${BE_DIR:-/var/www/jetbay-be}"
ENV_FILE="${BE_DIR}/.env"
BACKUP_DIR="/root/backups/jetbay-gd1-$(date +%Y%m%d-%H%M%S)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== GĐ1 prod fix ==="
mkdir -p "$BACKUP_DIR"
cp -a "$ENV_FILE" "$BACKUP_DIR/.env.bak"
echo "backup: $BACKUP_DIR"

python3 - "$ENV_FILE" <<'PY'
import sys
from pathlib import Path

p = Path(sys.argv[1])
lines = p.read_text().splitlines()
out = []
changed = []

def set_kv(key: str, value: str):
    global out, changed
    found = False
    new_out = []
    for line in out:
        if line.startswith(key + "="):
            new_out.append(f"{key}={value}")
            found = True
            changed.append(key)
        else:
            new_out.append(line)
    out = new_out
    if not found:
        out.append(f"{key}={value}")
        changed.append(key + "(new)")

for line in lines:
  if line.startswith("APP_ENV="):
    out.append("APP_ENV=production")
    changed.append("APP_ENV")
    continue
  if line.startswith("NODE_ENV="):
    out.append("NODE_ENV=production")
    changed.append("NODE_ENV")
    continue
  if line.startswith("MINIO_ENDPOINT="):
    out.append("MINIO_ENDPOINT=")
    changed.append("MINIO_ENDPOINT(cleared)")
    continue
  out.append(line)

set_kv("UPLOAD_PATH", "/var/www/jetbay-be/uploads")
p.write_text("\n".join(out) + "\n")
print("env updated:", ", ".join(changed))
PY

mkdir -p "${BE_DIR}/uploads"

cd "$BE_DIR"
echo "=== build ==="
if command -v pnpm >/dev/null 2>&1; then
  pnpm install --frozen-lockfile 2>/dev/null || pnpm install
  pnpm prisma generate
  pnpm build
else
  npm install --legacy-peer-deps
  npx prisma generate
  npm run build
fi

echo "=== prisma migrate deploy ==="
set -a
# shellcheck disable=SC1091
source "$ENV_FILE"
set +a
npx prisma migrate deploy

echo "=== prisma seed ==="
if command -v pnpm >/dev/null 2>&1; then
  pnpm prisma:seed
else
  npm run prisma:seed
fi

echo "=== pm2 restart ==="
node /usr/lib/node_modules/pm2/bin/pm2 restart jetbay-be --update-env

sleep 3
echo "=== health ==="
curl -sk "https://api.minhtien.online/health" | head -c 200
echo

echo "=== integrations ==="
curl -sk "https://api.minhtien.online/integrations/status" | head -c 400
echo

if [ -f "${SCRIPT_DIR}/smoke-all.sh" ]; then
  echo "=== smoke-all ==="
  bash "${SCRIPT_DIR}/smoke-all.sh"
else
  echo "=== smoke (inline) ==="
  bash "${SCRIPT_DIR}/smoke-prod.sh"
  bash "${SCRIPT_DIR}/run-node-smokes.sh"
fi

echo "=== GĐ1 prod fix DONE ==="
