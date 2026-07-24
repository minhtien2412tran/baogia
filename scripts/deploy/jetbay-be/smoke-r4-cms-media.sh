#!/usr/bin/env bash
# Smoke: ADMIN can list CMS after R4 PermissionGuard migrate
set -euo pipefail
set -a
# shellcheck disable=SC1091
source /var/www/jetbay-be/.env
set +a

EMAILS=("admin@jetbay.local" "admin@j-ta.local" "admin@jetbay.com")
PASSES=("Admin123!" "Admin@123" "Admin123!")
TOKEN=""
for EMAIL in "${EMAILS[@]}"; do
  for PASS in "${PASSES[@]}"; do
    LOGIN=$(curl -sS -X POST "http://127.0.0.1:3010/auth/login" \
      -H "Content-Type: application/json" \
      -H "X-API-Key: ${API_KEY}" \
      -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASS}\"}" || true)
    CAND=$(node -e 'try{const j=JSON.parse(process.argv[1]); const t=j.tokens?.accessToken||j.accessToken; if(t) process.stdout.write(t)}catch{}' "$LOGIN" || true)
    if [ -n "$CAND" ]; then
      TOKEN="$CAND"
      echo "LOGIN_OK email=${EMAIL}"
      break 2
    fi
  done
done
if [ -z "$TOKEN" ]; then
  echo "LOGIN_FAIL"
  exit 1
fi

CODE=$(curl -sS -o /tmp/jb-cms.json -w "%{http_code}" \
  "http://127.0.0.1:3010/admin/content/articles?limit=1" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "X-API-Key: ${API_KEY}")
echo "CMS_ARTICLES_HTTP=${CODE}"
MEDIA=$(curl -sS -o /tmp/jb-media.json -w "%{http_code}" \
  "http://127.0.0.1:3010/admin/media" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "X-API-Key: ${API_KEY}")
echo "CMS_MEDIA_HTTP=${MEDIA}"
if [ "$CODE" != "200" ] || [ "$MEDIA" != "200" ]; then
  echo "FAIL"
  head -c 300 /tmp/jb-cms.json; echo
  head -c 300 /tmp/jb-media.json; echo
  exit 1
fi
echo "R4_CMS_MEDIA_PASS"
