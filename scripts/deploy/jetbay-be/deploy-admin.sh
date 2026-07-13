#!/usr/bin/env bash
# Deploy Jet-Bay Admin to /var/www/jetbay-admin on 127.0.0.1:3011
# Requires: admin Next.js standalone/build already synced to APP_ROOT
set -euo pipefail

DEPLOY_CONFIRM="${DEPLOY_CONFIRM:-}"
if [ "${DEPLOY_CONFIRM}" != "ĐỒNG Ý TRIỂN KHAI" ]; then
  echo "ABORT: Set DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI'"
  exit 1
fi

APP_ROOT="${APP_ROOT:-/var/www/jetbay-admin}"
PORT=3011
PM2_BIN="${PM2_BIN:-node /usr/lib/node_modules/pm2/bin/pm2}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="/root/backups/jetbay-admin-$(date +%Y%m%d-%H%M%S)"

mkdir -p "${BACKUP_DIR}"
cp -a /etc/nginx/sites-available "${BACKUP_DIR}/" || true
cp -a /etc/nginx/sites-enabled "${BACKUP_DIR}/" || true

if [ ! -f "${APP_ROOT}/package.json" ]; then
  echo "ABORT: ${APP_ROOT}/package.json missing — sync apps/admin first"
  exit 1
fi

if ss -tlnp | grep -q ":${PORT} "; then
  echo "[admin] port ${PORT} already in use — will restart PM2 jetbay-admin"
fi

cd "${APP_ROOT}"

# Always refresh public API URL + key before build (NEXT_PUBLIC_* baked at build time)
API_KEY_LINE=""
API_KEY_LEN=0
if [ -f /var/www/jetbay-be/.env ]; then
  API_KEY_VAL="$(grep -E '^API_KEY=' /var/www/jetbay-be/.env | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'" | tr -d '\r')"
  if [ -n "${API_KEY_VAL}" ]; then
    API_KEY_LINE="NEXT_PUBLIC_API_KEY=${API_KEY_VAL}"
    API_KEY_LEN="${#API_KEY_VAL}"
  fi
fi
printf '%s\n' \
  'NEXT_PUBLIC_API_URL=https://api.minhtien.online' \
  ${API_KEY_LINE} \
  "PORT=${PORT}" \
  'HOSTNAME=127.0.0.1' \
  > .env.local
chmod 600 .env.local
echo "[admin] .env.local refreshed API_URL=prod key_len=${API_KEY_LEN}"

echo "[admin] build i18n vendor..."
cd "${APP_ROOT}/vendor/i18n"
npm install --legacy-peer-deps 2>/dev/null || true
npx tsc -p tsconfig.json
cd "${APP_ROOT}"

npm install --legacy-peer-deps 2>/dev/null || true
npm run build

# PM2 ecosystem inline
cat > "${APP_ROOT}/ecosystem.config.js" <<EOF
module.exports = {
  apps: [{
    name: 'jetbay-admin',
    cwd: '${APP_ROOT}',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -H 127.0.0.1 -p ${PORT}',
    env: { NODE_ENV: 'production', PORT: '${PORT}', HOSTNAME: '127.0.0.1' },
    error_file: '${APP_ROOT}/logs/pm2-error.log',
    out_file: '${APP_ROOT}/logs/pm2-out.log',
  }],
};
EOF
mkdir -p "${APP_ROOT}/logs"

${PM2_BIN} delete jetbay-admin 2>/dev/null || true
${PM2_BIN} start "${APP_ROOT}/ecosystem.config.js"
${PM2_BIN} save

cp "${SCRIPT_DIR}/admin.minhtien.online.http.conf" /etc/nginx/sites-available/admin.minhtien.online
ln -sf /etc/nginx/sites-available/admin.minhtien.online /etc/nginx/sites-enabled/admin.minhtien.online
nginx -t && systemctl reload nginx

if [ ! -f /etc/letsencrypt/live/admin.minhtien.online/fullchain.pem ]; then
  certbot certonly --webroot -w /var/www/certbot -d admin.minhtien.online \
    --non-interactive --agree-tos --register-unsafely-without-email || true
fi

if [ -f /etc/letsencrypt/live/admin.minhtien.online/fullchain.pem ]; then
  cp "${SCRIPT_DIR}/admin.minhtien.online.ssl.conf" /etc/nginx/sites-available/admin.minhtien.online
  nginx -t && systemctl reload nginx
fi

sleep 2
curl -fsS "http://127.0.0.1:${PORT}/" | head -c 120 || true
echo
echo "[admin] done. Backup ${BACKUP_DIR}"
