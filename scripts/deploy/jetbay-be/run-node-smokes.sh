#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export API_URL="${API_URL:-https://api.minhtien.online}"
if [ -z "${API_KEY:-}" ] && [ -f /var/www/jetbay-be/.env ]; then
  export API_KEY="$(grep -E '^API_KEY=' /var/www/jetbay-be/.env | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
fi
echo "API_URL=$API_URL"
echo "API_KEY len=${#API_KEY}"
node "${SCRIPT_DIR}/smoke-admin-crud.mjs"
echo "---"
node "${SCRIPT_DIR}/smoke-web-api.mjs"
echo "---"
node "${SCRIPT_DIR}/smoke-auth-booking.mjs"
