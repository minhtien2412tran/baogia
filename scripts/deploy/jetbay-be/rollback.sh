#!/usr/bin/env bash
# Jet-Bay BE — rollback (does not touch old backend)
set -euo pipefail

DEPLOY_CONFIRM="${DEPLOY_CONFIRM:-}"
BACKUP_DIR="${1:-}"

if [ "${DEPLOY_CONFIRM}" != "ĐỒNG Ý TRIỂN KHAI" ]; then
  echo "ABORT: Set DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI' to run rollback."
  exit 1
fi

echo "[rollback] stop PM2 jetbay-be"
pm2 delete jetbay-be 2>/dev/null || true
pm2 save 2>/dev/null || true

echo "[rollback] remove Nginx site api.minhtien.online"
rm -f /etc/nginx/sites-enabled/api.minhtien.online
rm -f /etc/nginx/sites-available/api.minhtien.online

if [ -n "${BACKUP_DIR}" ] && [ -d "${BACKUP_DIR}/sites-available" ]; then
  echo "[rollback] restore Nginx from ${BACKUP_DIR}"
  cp -a "${BACKUP_DIR}/sites-available/." /etc/nginx/sites-available/
  cp -a "${BACKUP_DIR}/sites-enabled/." /etc/nginx/sites-enabled/
fi

if nginx -t; then
  systemctl reload nginx
  echo "[rollback] nginx reloaded"
else
  echo "[rollback] WARN: nginx -t failed after rollback — manual fix required"
  exit 1
fi

echo "[rollback] done. Old backend should still be at api.baotienweb.cloud"
curl -fsSk https://api.baotienweb.cloud/api/v1/health | head -c 200 || true
echo
