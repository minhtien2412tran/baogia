#!/usr/bin/env bash
set -euo pipefail
echo "=== LOCAL HEALTH ==="
curl -fsS http://127.0.0.1:3010/health; echo
echo "=== BIND ==="
ss -tlnp | grep 3010 || true
echo "=== PM2 ==="
node /usr/lib/node_modules/pm2/bin/pm2 status
echo "=== DKIM DNS ==="
host -t TXT default._domainkey.minhtien.online 2>/dev/null || dig +short TXT default._domainkey.minhtien.online || true
echo "=== OLD BE (local resolve) ==="
curl -sk --resolve api.baotienweb.cloud:443:127.0.0.1 https://api.baotienweb.cloud/api/v1/health | head -c 200; echo
echo "=== PUBLIC API/DOCS ==="
for u in \
  https://api.minhtien.online/health \
  https://docs.minhtien.online/health \
  https://api.minhtien.online/swagger \
  https://docs.minhtien.online/swagger \
  https://api.minhtien.online/openapi.json
do
  code=$(curl -sk -o /dev/null -w '%{http_code}' "$u")
  echo "$code $u"
done
