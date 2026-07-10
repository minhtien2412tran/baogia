#!/usr/bin/env bash
# Smoke docs.minhtien.online + OpenAPI contract (no secrets printed)
set -euo pipefail
PASS=0
FAIL=0
ENV_FILE="${ENV_FILE:-/var/www/jetbay-be/.env}"
API_KEY=""
if [ -f "${ENV_FILE}" ]; then
  API_KEY="$(grep -E '^API_KEY=' "${ENV_FILE}" | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
fi

check() {
  local name="$1" url="$2" expect="${3:-200}"
  local code
  code=$(curl -sk -o /tmp/docs-smoke.out -w '%{http_code}' "$url" || echo "000")
  if [ "$code" = "$expect" ]; then
    echo "OK  $code $name"
    PASS=$((PASS+1))
  else
    echo "FAIL $code $name ($url)"
    FAIL=$((FAIL+1))
  fi
}

echo "=== Docs smoke ==="
check "docs health" "https://docs.minhtien.online/health"
check "docs swagger UI" "https://docs.minhtien.online/swagger"
check "docs openapi.json" "https://docs.minhtien.online/openapi.json"
curl -sk "https://docs.minhtien.online/openapi.json" -o /tmp/docs-openapi.json
check "docs openapi.yaml" "https://docs.minhtien.online/openapi.yaml"
check "api swagger redirect" "https://api.minhtien.online/swagger" "200"
check "api openapi.json" "https://api.minhtien.online/openapi.json"
check "api openapi.yaml" "https://api.minhtien.online/openapi.yaml"

# Default server must be production URL
SERVER0=$(python3 -c "import json; print(json.load(open('/tmp/docs-openapi.json')).get('servers',[{}])[0].get('url',''))" 2>/dev/null || true)
if [ "$SERVER0" = "https://api.minhtien.online" ]; then
  echo "OK  openapi server[0]=https://api.minhtien.online"
  PASS=$((PASS+1))
else
  echo "FAIL openapi server[0]=$SERVER0 (expected https://api.minhtien.online)"
  FAIL=$((FAIL+1))
fi

# CORS from docs origin
CORS=$(curl -sk -D - -o /dev/null -X OPTIONS "https://api.minhtien.online/auth/login" \
  -H "Origin: https://docs.minhtien.online" \
  -H "Access-Control-Request-Method: POST" | tr -d '\r' | grep -i '^access-control-allow-origin:' | awk '{print $2}' || true)
if [ "$CORS" = "https://docs.minhtien.online" ]; then
  echo "OK  CORS docs→api login preflight"
  PASS=$((PASS+1))
else
  echo "FAIL CORS allow-origin=$CORS"
  FAIL=$((FAIL+1))
fi

# Login from docs origin (browser-like)
LOGIN=$(curl -sk -o /tmp/docs-login.json -w '%{http_code}' \
  -X POST "https://api.minhtien.online/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: https://docs.minhtien.online" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"email":"admin@jetbay.local","password":"Admin123!"}' || echo "000")
if [ "$LOGIN" = "200" ] || [ "$LOGIN" = "201" ]; then
  echo "OK  $LOGIN swagger login (docs origin)"
  PASS=$((PASS+1))
else
  echo "FAIL $LOGIN swagger login"
  FAIL=$((FAIL+1))
fi

# integrations status (public)
check "integrations status" "https://api.minhtien.online/integrations/status"

echo "=== RESULT pass=$PASS fail=$FAIL ==="
[ "$FAIL" -eq 0 ]
