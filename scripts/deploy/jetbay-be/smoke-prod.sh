#!/usr/bin/env bash
# Smoke Jet-Bay API production (no secrets printed)
set -euo pipefail
BASE="${BASE_URL:-https://api.minhtien.online}"
ENV_FILE="${ENV_FILE:-/var/www/jetbay-be/.env}"
PASS=0
FAIL=0

# Load API_KEY from production .env if present (never echo value)
if [ -z "${API_KEY:-}" ] && [ -f "${ENV_FILE}" ]; then
  API_KEY="$(grep -E '^API_KEY=' "${ENV_FILE}" | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
fi
AUTH_H=()
if [ -n "${API_KEY:-}" ]; then
  AUTH_H=(-H "X-API-Key: ${API_KEY}")
  echo "[smoke] X-API-Key: present"
else
  echo "[smoke] X-API-Key: missing (requests may 401)"
fi

check() {
  local name="$1" url="$2" expect="${3:-200}"
  local code
  code=$(curl -sk -o /tmp/jb-smoke.json -w '%{http_code}' "${AUTH_H[@]}" "$url" || echo "000")
  if [ "$code" = "$expect" ]; then
    echo "OK  $code $name"
    PASS=$((PASS+1))
  else
    echo "FAIL $code $name ($url)"
    FAIL=$((FAIL+1))
  fi
}

echo "=== Smoke ${BASE} ==="
# Public (no API key)
code=$(curl -sk -o /tmp/jb-smoke.json -w '%{http_code}' "${BASE}/health" || echo "000")
if [ "$code" = "200" ]; then echo "OK  $code health (public)"; PASS=$((PASS+1)); else echo "FAIL $code health"; FAIL=$((FAIL+1)); fi

check "root" "${BASE}/"
check "openapi" "${BASE}/openapi.json"
# openapi/swagger are public — also verify without key
code=$(curl -sk -o /dev/null -w '%{http_code}' "${BASE}/openapi.json" || echo "000")
[ "$code" = "200" ] && echo "OK  $code openapi (no key)" && PASS=$((PASS+1)) || { echo "FAIL $code openapi no-key"; FAIL=$((FAIL+1)); }

check "fixed-price" "${BASE}/fixed-price/routes"
check "empty-legs" "${BASE}/empty-legs"
check "jet-card" "${BASE}/jet-card/plans"
check "travel-credits" "${BASE}/travel-credits/packages"
check "news" "${BASE}/content/news"
check "destinations" "${BASE}/content/destinations?limit=5"
check "airports" "${BASE}/airports/search?q=SGN"
check "partners" "${BASE}/partners/programs"

# Missing key must fail on protected route
NOKEY=$(curl -sk -o /dev/null -w '%{http_code}' "${BASE}/fixed-price/routes" || echo "000")
if [ "$NOKEY" = "401" ]; then
  echo "OK  $NOKEY fixed-price without key (expected 401)"
  PASS=$((PASS+1))
else
  echo "FAIL $NOKEY expected 401 without X-API-Key"
  FAIL=$((FAIL+1))
fi

LOGIN_CODE=$(curl -sk -o /tmp/jb-login.json -w '%{http_code}' \
  -X POST "${BASE}/auth/login" \
  -H 'Content-Type: application/json' \
  "${AUTH_H[@]}" \
  -d '{"email":"admin@j-ta.local","password":"Admin123!"}' || echo "000")
if [ "$LOGIN_CODE" = "200" ] || [ "$LOGIN_CODE" = "201" ]; then
  echo "OK  $LOGIN_CODE auth/login admin"
  PASS=$((PASS+1))
  TOKEN=$(python3 -c "import json; print(json.load(open('/tmp/jb-login.json')).get('tokens',{}).get('accessToken','') or '')" 2>/dev/null || true)
  if [ -n "${TOKEN:-}" ]; then
    CODE=$(curl -sk -o /tmp/jb-admin.json -w '%{http_code}' \
      -H "Authorization: Bearer ${TOKEN}" \
      "${AUTH_H[@]}" \
      "${BASE}/admin/dashboard/stats" || echo "000")
    if [ "$CODE" = "200" ]; then
      echo "OK  $CODE admin/dashboard/stats"
      PASS=$((PASS+1))
    else
      echo "FAIL $CODE admin/dashboard/stats"
      FAIL=$((FAIL+1))
    fi
  else
    echo "FAIL parse admin token"
    FAIL=$((FAIL+1))
  fi
else
  echo "FAIL $LOGIN_CODE auth/login admin"
  FAIL=$((FAIL+1))
fi

QUOTE_CODE=$(curl -sk -o /tmp/jb-quote.json -w '%{http_code}' \
  -X POST "${BASE}/quotes/request" \
  -H 'Content-Type: application/json' \
  "${AUTH_H[@]}" \
  -d '{"firstName":"Demo","lastName":"User","email":"demo@j-ta.local","phone":"+84900000000","isConsentAccepted":true,"legs":[{"fromAirport":"SGN","toAirport":"HAN","departureDate":"2026-08-01T10:00:00Z","passengers":2}]}' || echo "000")
if [ "$QUOTE_CODE" = "200" ] || [ "$QUOTE_CODE" = "201" ]; then
  echo "OK  $QUOTE_CODE quotes/request"
  PASS=$((PASS+1))
else
  echo "FAIL $QUOTE_CODE quotes/request"
  head -c 200 /tmp/jb-quote.json; echo
  FAIL=$((FAIL+1))
fi

echo "=== RESULT pass=$PASS fail=$FAIL ==="
[ "$FAIL" -eq 0 ]
