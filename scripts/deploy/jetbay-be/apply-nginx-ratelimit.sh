#!/usr/bin/env bash
# Apply JetBay Nginx rate-limit zones + updated api.minhtien.online SSL conf.
# Run on VPS as root after syncing deploy/ files to /var/www/jetbay-be/deploy/
set -euo pipefail

DEPLOY_DIR="${DEPLOY_DIR:-/var/www/jetbay-be/deploy}"
BACKUP_DIR="/root/backups/jetbay-nginx-$(date +%Y%m%d-%H%M%S)"
mkdir -p "${BACKUP_DIR}"

cp -a /etc/nginx/sites-available/api.minhtien.online "${BACKUP_DIR}/" 2>/dev/null || true
cp -a /etc/nginx/conf.d/jetbay-ratelimit.conf "${BACKUP_DIR}/" 2>/dev/null || true

cp "${DEPLOY_DIR}/nginx-jetbay-ratelimit.conf" /etc/nginx/conf.d/jetbay-ratelimit.conf
cp "${DEPLOY_DIR}/api.minhtien.online.ssl.conf" /etc/nginx/sites-available/api.minhtien.online

if ! nginx -t; then
  echo "ABORT: nginx -t failed — restoring backup from ${BACKUP_DIR}"
  cp -a "${BACKUP_DIR}/api.minhtien.online" /etc/nginx/sites-available/api.minhtien.online 2>/dev/null || true
  if [ -f "${BACKUP_DIR}/jetbay-ratelimit.conf" ]; then
    cp -a "${BACKUP_DIR}/jetbay-ratelimit.conf" /etc/nginx/conf.d/jetbay-ratelimit.conf
  else
    rm -f /etc/nginx/conf.d/jetbay-ratelimit.conf
  fi
  nginx -t
  exit 1
fi

systemctl reload nginx
echo "[nginx] rate-limit zones + api vhost applied. Backup: ${BACKUP_DIR}"
curl -sk -o /dev/null -w "api_health:%{http_code}\n" https://api.minhtien.online/health
