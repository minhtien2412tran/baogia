#!/usr/bin/env bash
# Deploy JetBay public web clone → www.minhtien.online → 127.0.0.1:3012
set -euo pipefail

DEPLOY_CONFIRM="${DEPLOY_CONFIRM:-}"
if [ "${DEPLOY_CONFIRM}" != "ĐỒNG Ý TRIỂN KHAI" ]; then
  echo "ABORT: Set DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI'"
  exit 1
fi

APP_ROOT="${APP_ROOT:-/var/www/jetbay-web}"
API_ENV="${API_ENV:-/var/www/jetbay-be/.env}"
PORT=3012
DOMAIN_WWW=www.minhtien.online
DOMAIN_APEX=minhtien.online
PM2_BIN="${PM2_BIN:-node /usr/lib/node_modules/pm2/bin/pm2}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="/root/backups/jetbay-web-$(date +%Y%m%d-%H%M%S)"

mkdir -p "${BACKUP_DIR}"
cp -a /etc/nginx/sites-available "${BACKUP_DIR}/" 2>/dev/null || true
cp -a /etc/nginx/sites-enabled "${BACKUP_DIR}/" 2>/dev/null || true

if [ ! -f "${APP_ROOT}/package.json" ]; then
  echo "ABORT: ${APP_ROOT}/package.json missing — run sync-web.sh first"
  exit 1
fi

# Sync API_KEY from jetbay-be into web .env.local
API_KEY=""
if [ -f "${API_ENV}" ]; then
  API_KEY="$(grep -E '^API_KEY=' "${API_ENV}" | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
fi

cat > "${APP_ROOT}/.env.local" <<EOF
NEXT_PUBLIC_API_URL=https://api.minhtien.online
NEXT_PUBLIC_SITE_URL=https://${DOMAIN_WWW}
NEXT_PUBLIC_API_KEY=${API_KEY}
PORT=${PORT}
HOSTNAME=127.0.0.1
EOF
chmod 600 "${APP_ROOT}/.env.local"
echo "[web] .env.local written (API_KEY len=${#API_KEY})"

echo "[web] build i18n vendor..."
cd "${APP_ROOT}/vendor/i18n"
npx tsc -p tsconfig.json
cd "${APP_ROOT}"

cd "${APP_ROOT}"
npm install --legacy-peer-deps
npm run build

mkdir -p "${APP_ROOT}/logs"
cat > "${APP_ROOT}/ecosystem.config.js" <<EOF
module.exports = {
  apps: [{
    name: 'jetbay-web',
    cwd: '${APP_ROOT}',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -H 127.0.0.1 -p ${PORT}',
    env: {
      NODE_ENV: 'production',
      PORT: '${PORT}',
      HOSTNAME: '127.0.0.1',
    },
    error_file: '${APP_ROOT}/logs/pm2-error.log',
    out_file: '${APP_ROOT}/logs/pm2-out.log',
  }],
};
EOF

${PM2_BIN} delete jetbay-web 2>/dev/null || true
${PM2_BIN} start "${APP_ROOT}/ecosystem.config.js"
${PM2_BIN} save

# Nginx HTTP first
cp "${SCRIPT_DIR}/www.minhtien.online.http.conf" /etc/nginx/sites-available/www.minhtien.online
ln -sf /etc/nginx/sites-available/www.minhtien.online /etc/nginx/sites-enabled/www.minhtien.online
nginx -t && systemctl reload nginx

mkdir -p /var/www/certbot
if [ ! -f "/etc/letsencrypt/live/${DOMAIN_WWW}/fullchain.pem" ]; then
  certbot certonly --webroot -w /var/www/certbot \
    -d "${DOMAIN_WWW}" -d "${DOMAIN_APEX}" \
    --non-interactive --agree-tos --register-unsafely-without-email \
    --expand || true
fi

if [ -f "/etc/letsencrypt/live/${DOMAIN_WWW}/fullchain.pem" ]; then
  cp "${SCRIPT_DIR}/www.minhtien.online.ssl.conf" /etc/nginx/sites-available/www.minhtien.online
  nginx -t && systemctl reload nginx
  echo "[web] SSL enabled for ${DOMAIN_WWW}"
else
  echo "[web] WARN: SSL cert missing — HTTP only for now"
fi

# CORS: add www to API if missing
if [ -f "${API_ENV}" ] && ! grep -q "${DOMAIN_WWW}" "${API_ENV}"; then
  python3 - <<PY
from pathlib import Path
p = Path("${API_ENV}")
text = p.read_text()
lines = text.splitlines()
out = []
for line in lines:
    if line.startswith("CORS_ORIGIN="):
        val = line.split("=", 1)[1]
        extras = ["https://${DOMAIN_WWW}", "https://${DOMAIN_APEX}"]
        for e in extras:
            if e not in val:
                val = val.rstrip(",") + "," + e
        out.append("CORS_ORIGIN=" + val)
    else:
        out.append(line)
p.write_text("\\n".join(out) + "\\n")
print("[web] CORS_ORIGIN updated")
PY
  ${PM2_BIN} restart jetbay-be --update-env || true
fi

sleep 3
curl -fsS "http://127.0.0.1:${PORT}/" | head -c 160 || true
echo
curl -sk -o /dev/null -w "https_www:%{http_code}\n" "https://${DOMAIN_WWW}/" || true
curl -sk -o /dev/null -w "https_en:%{http_code}\n" "https://${DOMAIN_WWW}/en-us" || true
echo "[web] done. Backup ${BACKUP_DIR}"
echo "[web] Public: https://${DOMAIN_WWW}/en-us"
