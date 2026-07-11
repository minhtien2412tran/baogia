#!/usr/bin/env bash
set -euo pipefail
API_KEY="$(grep -E '^API_KEY=' /var/www/jetbay-be/.env | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
echo "=== GET nice-to-paris route ==="
curl -sS "https://api.minhtien.online/fixed-price/routes/nice-to-paris" \
  -H "X-API-Key: ${API_KEY}" | head -c 600
echo
echo "=== POST quote ==="
curl -sS -X POST 'https://api.minhtien.online/fixed-price/quote' \
  -H 'Content-Type: application/json' \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"routeId":3,"category":"HEAVY","date":"2026-07-18","passengers":2,"email":"test@example.com"}' \
  -w '\nHTTP:%{http_code}\n'
