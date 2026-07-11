#!/usr/bin/env bash
set -euo pipefail
API_KEY="$(grep -E '^API_KEY=' /var/www/jetbay-be/.env | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
curl -sS -X POST 'https://api.minhtien.online/quotes/search-aircraft' \
  -H 'Content-Type: application/json' \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"tripType":"ONE_WAY","legs":[{"fromAirport":"LTN","toAirport":"LBG","departureDate":"2026-07-11T10:00:00.000Z","passengers":4}]}'
echo
