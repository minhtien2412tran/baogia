#!/usr/bin/env bash
# Safe production recheck for GĐ2 handoff — no secrets printed.
set -euo pipefail

echo "=== health ==="
curl -fsSk https://api.minhtien.online/health
echo

echo "=== integrations (smtp flags only) ==="
curl -fsSk https://api.minhtien.online/integrations/status | python3 -c '
import json,sys
d=json.load(sys.stdin)
i=d.get("integrations", d)
for k in ("smtp","smtpCatcher","smtpTransportReady","smtpBlockedReason","stripe","oauth","sms"):
    if k in i:
        print(f"{k}={i.get(k)}")
'

echo "=== http codes ==="
for pair in \
  "swagger:https://docs.minhtien.online/swagger" \
  "web:https://www.minhtien.online/en-us" \
  "admin:https://admin.minhtien.online/login" \
  "baocao:https://www.minhtien.online/baocaotiendo"
do
  name=${pair%%:*}
  url=${pair#*:}
  code=$(curl -sS -o /dev/null -w "%{http_code}" "$url" || echo ERR)
  echo "${name}:${code}"
done

echo "=== pm2 (names only) ==="
pm2 ls | head -n 20
