#!/usr/bin/env bash
# Smoke Jet-Bay API production (no secrets printed)
set -euo pipefail
BASE="${BASE_URL:-https://api.minhtien.online}"
PASS=0
FAIL=0

check() {
  local name="$1" url="$2" expect="${3:-200}"
  local code
  code=$(curl -sk -o /tmp/jb-smoke.json -w '%{http_code}' "$url" || echo "000")
  if [ "$code" = "$expect" ]; then
    echo "OK  $code $name"
    PASS=$((PASS+1))
  else
    echo "FAIL $code $name ($url)"
    FAIL=$((FAIL+1))
  fi
}

echo "=== Smoke ${BASE} ==="
check "health" "${BASE}/health"
check "root" "${BASE}/"
check "openapi" "${BASE}/openapi.json"
check "fixed-price" "${BASE}/fixed-price/routes"
check "empty-legs" "${BASE}/empty-legs"
check "jet-card" "${BASE}/jet-card/plans"
check "travel-credits" "${BASE}/travel-credits/packages"
check "news" "${BASE}/content/news"
check "destinations" "${BASE}/content/destinations?limit=5"
check "airports" "${BASE}/airports/search?q=SGN"
check "partners" "${BASE}/partners/programs"

# Login admin
LOGIN_CODE=$(curl -sk -o /tmp/jb-login.json -w '%{http_code}' \
  -X POST "${BASE}/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@j-ta.local","password":"Admin123!"}' || echo "000")
if [ "$LOGIN_CODE" = "200" ] || [ "$LOGIN_CODE" = "201" ]; then
  echo "OK  $LOGIN_CODE auth/login admin"
  PASS=$((PASS+1))
  TOKEN=$(python3 -c "import json; print(json.load(open('/tmp/jb-login.json')).get('tokens',{}).get('accessToken','') or json.load(open('/tmp/jb-login.json')).get('accessToken',''))" 2>/dev/null || true)
  if [ -n "${TOKEN:-}" ]; then
    CODE=$(curl -sk -o /tmp/jb-admin.json -w '%{http_code}' \
      -H "Authorization: Bearer ${TOKEN}" \
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

# Quote request (matches RequestQuoteDto)
QUOTE_CODE=$(curl -sk -o /tmp/jb-quote.json -w '%{http_code}' \
  -X POST "${BASE}/quotes/request" \
  -H 'Content-Type: application/json' \
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
