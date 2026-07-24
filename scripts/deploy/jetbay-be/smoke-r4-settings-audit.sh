#!/usr/bin/env bash
# Smoke: audit-logs + system-health + brand settings (R4 settings/audit)
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

auth() {
  local path="$1"
  curl -sS -o "/tmp/jb-r4.json" -w "%{http_code}" \
    "http://127.0.0.1:3010${path}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "X-API-Key: ${API_KEY}"
}

A=$(auth "/admin/audit-logs?limit=1")
echo "AUDIT_HTTP=${A}"
H=$(auth "/admin/system-health")
echo "HEALTH_HTTP=${H}"
B=$(auth "/admin/site-settings/brand")
echo "BRAND_HTTP=${B}"

if [ "$A" != "200" ] || [ "$H" != "200" ] || [ "$B" != "200" ]; then
  echo "FAIL"
  head -c 400 /tmp/jb-r4.json; echo
  exit 1
fi
echo "R4_SETTINGS_AUDIT_PASS"
