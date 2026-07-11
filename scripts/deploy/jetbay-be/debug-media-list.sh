#!/usr/bin/env bash
set -u
API_KEY="$(grep -E '^API_KEY=' /var/www/jetbay-be/.env | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
ADMIN_EMAIL="$(grep -E '^ADMIN_EMAIL=' /var/www/jetbay-be/.env 2>/dev/null | head -1 | cut -d= -f2- | tr -d '"' || echo 'admin@jetbay.com')"
ADMIN_PASS="$(grep -E '^ADMIN_PASSWORD=' /var/www/jetbay-be/.env 2>/dev/null | head -1 | cut -d= -f2- | tr -d '"' || echo '')"

if [ -z "$ADMIN_PASS" ]; then
  # try seed default
  ADMIN_PASS="Admin@123"
fi

TOKEN="$(curl -sS -X POST 'https://api.minhtien.online/auth/login' \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d "{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASS}\"}" \
  | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("tokens",{}).get("accessToken",""))' 2>/dev/null || true)"

if [ -z "$TOKEN" ]; then
  echo "login failed"
  curl -sS -X POST 'https://api.minhtien.online/auth/login' -H "Content-Type: application/json" -H "X-API-Key: ${API_KEY}" -d "{\"email\":\"admin@jetbay.com\",\"password\":\"Admin@123\"}" | head -c 300
  echo
  exit 1
fi

echo "=== admin/media list ==="
curl -sS 'https://api.minhtien.online/admin/media' \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "X-API-Key: ${API_KEY}" | python3 -m json.tool 2>/dev/null | head -40

echo "=== UPLOAD_PATH / MINIO ==="
grep -E '^(UPLOAD_PATH|MINIO_|API_PUBLIC_URL)=' /var/www/jetbay-be/.env | sed 's/=.*/=***/'
