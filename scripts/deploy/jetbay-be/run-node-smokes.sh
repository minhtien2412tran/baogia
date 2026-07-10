#!/usr/bin/env bash
set -euo pipefail
export API_URL=https://api.minhtien.online
export API_KEY="$(grep -E '^API_KEY=' /var/www/jetbay-be/.env | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
echo "API_KEY len=${#API_KEY}"
node /tmp/smoke-admin-crud.mjs
echo "---"
node /tmp/smoke-web-api.mjs
