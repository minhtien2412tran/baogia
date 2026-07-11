#!/usr/bin/env bash
set -euo pipefail
API_KEY="$(grep -E '^API_KEY=' /var/www/jetbay-be/.env | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
for q in "Pháp" "mỹ" "Paris" "SGN"; do
  echo "=== search: $q ==="
  curl -sS "https://api.minhtien.online/airports/search?q=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$q'))")&limit=5" \
    -H "X-API-Key: ${API_KEY}" | head -c 400
  echo
done
