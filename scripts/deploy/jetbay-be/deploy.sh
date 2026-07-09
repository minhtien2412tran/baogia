#!/usr/bin/env bash
# Jet-Bay BE — full VPS deployment
# REQUIRES: DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI'
# Does NOT touch api.baotienweb.cloud or /var/www/baotienweb-api

set -euo pipefail

DEPLOY_CONFIRM="${DEPLOY_CONFIRM:-}"
APP_ROOT="${APP_ROOT:-/var/www/jetbay-be}"
NGINX_SITE="${NGINX_SITE:-/etc/nginx/sites-available/api.minhtien.online}"
API_DOMAIN="${API_DOMAIN:-api.minhtien.online}"
DB_NAME="${DB_NAME:-jetbay_db}"
DB_USER="${DB_USER:-jetbay_user}"
JETBAY_PORT="${JETBAY_PORT:-3010}"
BACKUP_DIR="${BACKUP_DIR:-/root/backups/jetbay-be-$(date +%Y%m%d-%H%M%S)}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ "${DEPLOY_CONFIRM}" != "ĐỒNG Ý TRIỂN KHAI" ]; then
  echo "ABORT: Set DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI' to run this script."
  exit 1
fi

log() { echo "[jetbay-deploy] $*"; }

log "Step 0: backup Nginx config"
mkdir -p "${BACKUP_DIR}"
cp -a /etc/nginx/sites-available "${BACKUP_DIR}/sites-available"
cp -a /etc/nginx/sites-enabled "${BACKUP_DIR}/sites-enabled"
log "Nginx backup -> ${BACKUP_DIR}"

log "Step 1: preflight"
bash "${SCRIPT_DIR}/preflight.sh"

log "Step 2: create directories"
mkdir -p "${APP_ROOT}/uploads" "${APP_ROOT}/logs"
chmod 750 "${APP_ROOT}/uploads" "${APP_ROOT}/logs"

if [ ! -f "${APP_ROOT}/package.json" ]; then
  echo "ABORT: ${APP_ROOT}/package.json not found. Upload source first (see sync-source.sh)."
  exit 1
fi

log "Step 3: PostgreSQL database + user (idempotent)"
DB_PASS_FILE="${APP_ROOT}/.db_password.generated"
if [ ! -f "${DB_PASS_FILE}" ]; then
  openssl rand -hex 32 > "${DB_PASS_FILE}"
  chmod 600 "${DB_PASS_FILE}"
fi
DB_PASSWORD="$(cat "${DB_PASS_FILE}")"

sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
    EXECUTE format('CREATE ROLE %I LOGIN PASSWORD %L', '${DB_USER}', '${DB_PASSWORD}');
  END IF;
END
\$\$;
SQL

sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
SQL

log "Step 4: create .env (only if missing)"
ENV_FILE="${APP_ROOT}/.env"
if [ ! -f "${ENV_FILE}" ]; then
  cp "${SCRIPT_DIR}/env.production.template" "${ENV_FILE}"
  chmod 600 "${ENV_FILE}"

  JWT_SECRET="$(openssl rand -base64 48)"
  REFRESH_SECRET="$(openssl rand -base64 48)"
  API_KEY="$(openssl rand -base64 32)"
  PAYMENT_SECRET="$(openssl rand -base64 32)"

  sed -i "s|CHANGE_ME_STRONG_PASSWORD|${DB_PASSWORD}|g" "${ENV_FILE}"
  sed -i "s|CHANGE_ME_JWT_SECRET|${JWT_SECRET}|g" "${ENV_FILE}"
  sed -i "s|CHANGE_ME_REFRESH_SECRET|${REFRESH_SECRET}|g" "${ENV_FILE}"
  sed -i "s|CHANGE_ME_API_KEY|${API_KEY}|g" "${ENV_FILE}"
  sed -i "s|CHANGE_ME_PAYMENT_SECRET|${PAYMENT_SECRET}|g" "${ENV_FILE}"

  log ".env created at ${ENV_FILE} (secrets not printed)"
else
  log ".env already exists — skipped (not overwritten)"
fi

log "Step 5: install dependencies + build"
cd "${APP_ROOT}"
if command -v pnpm >/dev/null 2>&1; then
  pnpm install --frozen-lockfile 2>/dev/null || pnpm install
  pnpm prisma generate
  pnpm build
elif command -v npm >/dev/null 2>&1; then
  npm install --legacy-peer-deps
  npx prisma generate
  npm run build
else
  echo "ABORT: pnpm or npm required"
  exit 1
fi

log "Step 6: run migrations"
cd "${APP_ROOT}"
set -a
# shellcheck disable=SC1091
source "${ENV_FILE}"
set +a
npx prisma migrate deploy

PM2_BIN="${PM2_BIN:-node /usr/lib/node_modules/pm2/bin/pm2}"

log "Step 7: PM2 start/restart jetbay-be"
cp "${SCRIPT_DIR}/ecosystem.config.js" "${APP_ROOT}/ecosystem.config.js"
${PM2_BIN} delete jetbay-be 2>/dev/null || true
${PM2_BIN} start "${APP_ROOT}/ecosystem.config.js"
${PM2_BIN} save

sleep 2
log "Step 8: local health check"
curl -fsS "http://127.0.0.1:${JETBAY_PORT}/health" | head -c 500
echo

log "Step 9: Nginx site (HTTP first for certbot)"
cp "${SCRIPT_DIR}/api.minhtien.online.http.conf" "${NGINX_SITE}"
ln -sf "${NGINX_SITE}" "/etc/nginx/sites-enabled/api.minhtien.online"

log "Step 10: nginx -t"
if ! nginx -t; then
  echo "ABORT: nginx -t failed — NOT reloading. Restore from ${BACKUP_DIR}"
  exit 1
fi

log "Step 11: reload nginx"
systemctl reload nginx

log "Step 12: SSL via certbot"
if certbot certificates 2>/dev/null | grep -q "Certificate Name: ${API_DOMAIN}"; then
  log "SSL cert already exists for ${API_DOMAIN}"
else
  certbot certonly --nginx -d "${API_DOMAIN}" --non-interactive --agree-tos --register-unsafely-without-email || \
  certbot certonly --webroot -w /var/www/certbot -d "${API_DOMAIN}" --non-interactive --agree-tos --register-unsafely-without-email
fi

if [ -f /etc/letsencrypt/live/${API_DOMAIN}/fullchain.pem ]; then
  cp "${SCRIPT_DIR}/api.minhtien.online.ssl.conf" "${NGINX_SITE}"
  ln -sf "${NGINX_SITE}" "/etc/nginx/sites-enabled/api.minhtien.online"
  if ! nginx -t; then
    echo "ABORT: nginx -t failed after SSL config — NOT reloading"
    exit 1
  fi
  systemctl reload nginx
fi

log "Step 13: public health check"
curl -fsSk "https://${API_DOMAIN}/health"
echo

log "Step 14: verify old backend untouched"
curl -fsSk "https://api.baotienweb.cloud/api/v1/health" | head -c 300
echo

log "=== DEPLOY COMPLETE ==="
log "API: https://${API_DOMAIN}"
log "Port: 127.0.0.1:${JETBAY_PORT}"
log "Source: ${APP_ROOT}"
log "PM2: jetbay-be"
log "Nginx: ${NGINX_SITE}"
log "Database: ${DB_NAME} (user: ${DB_USER})"
log "Backup: ${BACKUP_DIR}"
log "Restart: pm2 restart jetbay-be"
log "Logs: pm2 logs jetbay-be --lines 100"
