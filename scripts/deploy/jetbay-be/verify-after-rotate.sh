#!/usr/bin/env bash
set -euo pipefail
curl -fsS http://127.0.0.1:3010/health
echo
python3 <<'PY'
import json, urllib.request
from pathlib import Path

oa = json.load(urllib.request.urlopen("http://127.0.0.1:3010/openapi.json"))
print("title:", oa["info"]["title"])
print("version:", oa["info"]["version"])
print("servers:", [s.get("url") for s in oa.get("servers", [])])
schemes = list((oa.get("components") or {}).get("securitySchemes") or {})
print("securitySchemes:", schemes)

api_key = ""
for line in Path("/var/www/jetbay-be/.env").read_text().splitlines():
    if line.startswith("API_KEY="):
        api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
        break

req = urllib.request.Request(
    "https://api.minhtien.online/auth/login",
    data=json.dumps({"email": "admin@j-ta.local", "password": "Admin123!"}).encode(),
    headers={"Content-Type": "application/json", "X-API-Key": api_key},
    method="POST",
)
try:
    with urllib.request.urlopen(req) as r:
        body = json.load(r)
        tokens = body.get("tokens") or {}
        tok = tokens.get("accessToken") or body.get("accessToken") or ""
        print("login:", r.status, "jwt_parts", len(tok.split(".")) if tok else 0)
except Exception as e:
    print("login_err:", e)
PY
curl -sk -o /dev/null -w "docs_swagger:%{http_code}\n" https://docs.minhtien.online/swagger || true
OLD=$(curl -sk -o /dev/null -w "%{http_code}" https://api.baotienweb.cloud/api/v1/health || true)
echo "old_be:${OLD:-000}"
