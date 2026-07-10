#!/usr/bin/env bash
# Redeploy JetBay API after sync-api (build + PM2 restart)
set -euo pipefail

DEPLOY_CONFIRM="${DEPLOY_CONFIRM:-}"
if [ "${DEPLOY_CONFIRM}" != "ĐỒNG Ý TRIỂN KHAI" ]; then
  echo "ABORT: Set DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI'"
  exit 1
fi

APP_ROOT="${APP_ROOT:-/var/www/jetbay-be}"
PM2_BIN="${PM2_BIN:-node /usr/lib/node_modules/pm2/bin/pm2}"
BACKUP_DIR="/root/backups/jetbay-be-$(date +%Y%m%d-%H%M%S)"

echo "[api] backup tag: ${BACKUP_DIR}"
mkdir -p "${BACKUP_DIR}"

cd "${APP_ROOT}"
echo "[api] build i18n package..."
cd "${APP_ROOT}/vendor/i18n"
npm install --legacy-peer-deps 2>/dev/null || true
npx tsc -p tsconfig.json
cd "${APP_ROOT}"

echo "[api] npm install..."
npm install --legacy-peer-deps

echo "[api] prisma generate..."
npx prisma generate

echo "[api] build..."
npm run build

echo "[api] migrate deploy..."
set -a
# shellcheck disable=SC1091
source "${APP_ROOT}/.env"
set +a
npx prisma migrate deploy

echo "[api] pm2 restart..."
${PM2_BIN} restart jetbay-be --update-env
sleep 3

echo "[api] health..."
curl -fsSk "https://api.minhtien.online/health" | head -c 300
echo

echo "[api] i18n config..."
curl -fsSk "https://api.minhtien.online/i18n/config" | head -c 400
echo

echo "[api] done. Backup ref: ${BACKUP_DIR}"
