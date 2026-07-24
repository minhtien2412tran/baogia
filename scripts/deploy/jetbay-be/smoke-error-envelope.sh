#!/usr/bin/env bash
set -euo pipefail
set -a
# shellcheck disable=SC1091
source /var/www/jetbay-be/.env
set +a
CODE=$(curl -sS -o /tmp/jb-err.json -w "%{http_code}" \
  -X POST "http://127.0.0.1:3010/quotes/request" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{}')
echo "HTTP=${CODE}"
cat /tmp/jb-err.json
echo
node -e '
const j=require("/tmp/jb-err.json");
if(!j.code||!j.requestId||!j.path||!j.timestamp){console.error("ENVELOPE_BAD");process.exit(2)}
console.log("ENVELOPE_OK",j.code,j.requestId);
'
