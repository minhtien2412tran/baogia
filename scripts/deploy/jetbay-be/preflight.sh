#!/usr/bin/env bash
# Jet-Bay BE — read-only preflight checks (safe to run before deploy confirmation)
set -euo pipefail

VPS_IP="${VPS_IP:-103.200.20.100}"
API_DOMAIN="${API_DOMAIN:-api.minhtien.online}"
OLD_HEALTH_URL="${OLD_HEALTH_URL:-https://api.baotienweb.cloud/api/v1/health}"
JETBAY_PORT="${JETBAY_PORT:-3010}"

echo "=== Jet-Bay preflight (read-only) ==="
echo "Time: $(date -Is)"
echo

echo "[1] Old backend health: ${OLD_HEALTH_URL}"
if curl -fsSk --max-time 15 "${OLD_HEALTH_URL}" | head -c 300; then
  echo
  echo "  -> OK"
else
  echo "  -> WARN: old backend health check failed or empty response"
fi
echo

echo "[2] Port ${JETBAY_PORT} availability"
if ss -tlnp | grep -q ":${JETBAY_PORT} "; then
  echo "  -> FAIL: port ${JETBAY_PORT} is in use"
  ss -tlnp | grep ":${JETBAY_PORT} " || true
  exit 1
else
  echo "  -> OK: port ${JETBAY_PORT} is free"
fi
echo

echo "[3] DNS ${API_DOMAIN}"
RESOLVED="$(getent hosts "${API_DOMAIN}" | awk '{print $1}' | head -1 || true)"
echo "  Resolved: ${RESOLVED:-<none>}"
if [ "${RESOLVED}" = "${VPS_IP}" ]; then
  echo "  -> OK: points to ${VPS_IP}"
else
  echo "  -> FAIL: expected ${VPS_IP}"
  echo "  Add DNS A record: api -> ${VPS_IP} (TTL 3600)"
  exit 1
fi
echo

echo "[4] Nginx syntax (no reload)"
nginx -t
echo

echo "[5] Existing Jet-Bay paths"
for p in /var/www/jetbay-be /etc/nginx/sites-available/api.minhtien.online; do
  if [ -e "$p" ]; then
    echo "  EXISTS: $p"
  else
    echo "  MISSING (expected before first deploy): $p"
  fi
done
echo

echo "[6] PostgreSQL service"
systemctl is-active postgresql && echo "  -> postgresql active" || echo "  -> WARN: postgresql not active"
echo

echo "[7] Disk usage"
df -h / | tail -1
echo

echo "=== Preflight complete ==="
