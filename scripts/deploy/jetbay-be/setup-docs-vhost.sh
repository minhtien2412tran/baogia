#!/usr/bin/env bash
# Setup docs.minhtien.online -> 127.0.0.1:3010 (swagger/openapi only)
set -euo pipefail

BACKUP_DIR="/root/backups/jetbay-docs-$(date +%Y%m%d-%H%M%S)"
mkdir -p "${BACKUP_DIR}"
cp -a /etc/nginx/sites-available "${BACKUP_DIR}/"
cp -a /etc/nginx/sites-enabled "${BACKUP_DIR}/"
echo "[docs] Nginx backup -> ${BACKUP_DIR}"

cp /var/www/jetbay-be/deploy/docs.minhtien.online.http.conf /etc/nginx/sites-available/docs.minhtien.online
ln -sf /etc/nginx/sites-available/docs.minhtien.online /etc/nginx/sites-enabled/docs.minhtien.online

if ! nginx -t; then
  echo "ABORT: nginx -t failed"
  exit 1
fi
systemctl reload nginx

# Issue cert if missing
if [ ! -f /etc/letsencrypt/live/docs.minhtien.online/fullchain.pem ]; then
  certbot certonly --webroot -w /var/www/certbot -d docs.minhtien.online \
    --non-interactive --agree-tos --register-unsafely-without-email \
    || certbot certonly --nginx -d docs.minhtien.online \
      --non-interactive --agree-tos --register-unsafely-without-email
fi

if [ -f /etc/letsencrypt/live/docs.minhtien.online/fullchain.pem ]; then
  cp /var/www/jetbay-be/deploy/docs.minhtien.online.nginx.conf /etc/nginx/sites-available/docs.minhtien.online
  if ! nginx -t; then
    echo "ABORT: nginx -t failed after SSL config"
    # restore HTTP-only
    cp /var/www/jetbay-be/deploy/docs.minhtien.online.http.conf /etc/nginx/sites-available/docs.minhtien.online
    nginx -t && systemctl reload nginx
    exit 1
  fi
  systemctl reload nginx
  echo "[docs] SSL enabled"
else
  echo "[docs] WARN: SSL cert not found — HTTP-only left in place"
fi

echo
echo "=== TESTS ==="
curl -fsS http://docs.minhtien.online/health || true
echo
curl -sk https://docs.minhtien.online/health || true
echo
curl -sk -o /dev/null -w "swagger:%{http_code}\n" https://docs.minhtien.online/swagger
curl -sk -o /dev/null -w "openapi:%{http_code}\n" https://docs.minhtien.online/openapi.json
curl -sk --resolve api.baotienweb.cloud:443:127.0.0.1 https://api.baotienweb.cloud/api/v1/health | head -c 120
echo
echo "[docs] done. Backup: ${BACKUP_DIR}"
