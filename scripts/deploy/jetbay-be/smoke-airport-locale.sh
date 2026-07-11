#!/usr/bin/env bash
set -euo pipefail
API_KEY="$(grep -E '^API_KEY=' /var/www/jetbay-be/.env | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"

for spec in "hcm:vi" "hue:vi" "hcm:en-us" "hue:en-us"; do
  q="${spec%%:*}"
  loc="${spec##*:}"
  echo "=== search q=${q} locale=${loc} ==="
  curl -sS "https://api.minhtien.online/airports/search?q=${q}&locale=${loc}&limit=3" \
    -H "X-API-Key: ${API_KEY}"
  echo
done

echo "=== pages ==="
curl -sk -o /dev/null -w "fp_paris:%{http_code}\n" "https://www.minhtien.online/vi/fixed-price-charter/paris-to-london"
curl -sk -o /dev/null -w "corporate:%{http_code}\n" "https://www.minhtien.online/vi/corporate-air-charter"
curl -sk -o /dev/null -w "home:%{http_code}\n" "https://www.minhtien.online/en-us"
