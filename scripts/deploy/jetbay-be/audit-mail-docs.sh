#!/usr/bin/env bash
set -euo pipefail

echo "=== MAIL DOMAINS ==="
sqlite3 /www/vmail/postfixadmin.db "SELECT domain, active FROM domain;"

echo
echo "=== EXISTING DKIM KEYS ==="
ls -la /www/server/dkim/ || true
for d in /www/server/dkim/*/; do
  echo "-- $d"
  cat "${d}default.pub" 2>/dev/null || true
done

echo
echo "=== RSPAMD DKIM CONFIG ==="
cat /etc/rspamd/local.d/dkim_signing.conf

echo
echo "=== TOOLS ==="
command -v rspamadm || true
command -v openssl || true
command -v opendkim-genkey || true

echo
echo "=== JETBAY SWAGGER ==="
curl -sk -o /dev/null -w "swagger:%{http_code}\n" https://api.minhtien.online/swagger
curl -sk -o /dev/null -w "openapi:%{http_code}\n" https://api.minhtien.online/openapi.json
curl -sk https://api.minhtien.online/ | head -c 400
echo

echo
echo "=== PORTS 3010-3020 / 4000 ==="
ss -tlnp | grep -E ':(301[0-9]|3020|4000) ' || true

echo
echo "=== UFW 3010 ==="
ufw status | grep 3010 || echo "3010 not in ufw (good)"

echo
echo "=== NGINX MINHTIEN ==="
ls -la /etc/nginx/sites-enabled/api.minhtien.online
grep -E 'server_name|proxy_pass|listen|ssl_certificate' /etc/nginx/sites-available/api.minhtien.online
