#!/usr/bin/env bash
set -euo pipefail
API_KEY=$(grep -E '^API_KEY=' /var/www/jetbay-be/.env | head -1 | cut -d= -f2- | tr -d '"')
curl -sk -X POST 'https://api.minhtien.online/auth/login' \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://docs.minhtien.online' \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"email":"admin@jetbay.local","password":"Admin123!"}' \
  -w '\nhttp:%{http_code}\n'
