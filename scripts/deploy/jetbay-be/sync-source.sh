#!/usr/bin/env bash
# Upload Jet-Bay API source from local monorepo to VPS
# Usage (from repo root):
#   bash scripts/deploy/jetbay-be/sync-source.sh
# Does NOT deploy — only copies files.

set -euo pipefail

VPS_HOST="${VPS_HOST:-root@103.200.20.100}"
APP_ROOT="${APP_ROOT:-/var/www/jetbay-be}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
API_SRC="${REPO_ROOT}/apps/api"

if [ ! -f "${API_SRC}/package.json" ]; then
  echo "ABORT: ${API_SRC}/package.json not found"
  exit 1
fi

echo "[sync] Building API locally..."
cd "${REPO_ROOT}"
pnpm --filter api prisma:generate
pnpm --filter api build

echo "[sync] Creating remote directory ${APP_ROOT}"
ssh -o BatchMode=yes "${VPS_HOST}" "mkdir -p ${APP_ROOT}/uploads ${APP_ROOT}/logs"

echo "[sync] Rsync apps/api -> ${VPS_HOST}:${APP_ROOT}"
rsync -avz --delete \
  --exclude node_modules \
  --exclude .env \
  --exclude coverage \
  --exclude uploads \
  --exclude logs \
  "${API_SRC}/" "${VPS_HOST}:${APP_ROOT}/"

echo "[sync] Copy deploy scripts"
rsync -avz "${REPO_ROOT}/scripts/deploy/jetbay-be/" "${VPS_HOST}:${APP_ROOT}/deploy/"

echo "[sync] Done. On VPS run:"
echo "  bash ${APP_ROOT}/deploy/preflight.sh"
echo "  DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI' bash ${APP_ROOT}/deploy/deploy.sh"
