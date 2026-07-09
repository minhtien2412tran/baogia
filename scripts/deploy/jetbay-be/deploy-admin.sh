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
if [ ! -f .env.local ]; then
  cat > .env.local <<EOF
NEXT_PUBLIC_API_URL=https://api.minhtien.online
PORT=${PORT}
HOSTNAME=127.0.0.1
EOF
  chmod 600 .env.local
fi

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
