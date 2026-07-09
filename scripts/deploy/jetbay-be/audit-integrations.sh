#!/usr/bin/env bash
# Audit JWT + supporting tech (no secret values printed)
set -euo pipefail
ENV_FILE=/var/www/jetbay-be/.env

python3 <<'PY'
from pathlib import Path
text = Path("/var/www/jetbay-be/.env").read_text()
lines = {}
for line in text.splitlines():
    if not line or line.startswith("#") or "=" not in line:
        continue
    k, v = line.split("=", 1)
    lines[k] = v.strip().strip('"').strip("'")

required = [
    "JWT_SECRET",
    "REFRESH_TOKEN_SECRET",
    "DATABASE_URL",
    "HOST",
    "PORT",
    "CORS_ORIGIN",
]
optional = [
    "REDIS_URL",
    "SMTP_HOST",
    "SMTP_USER",
    "MINIO_ENDPOINT",
    "GOOGLE_CLIENT_ID",
    "APPLE_CLIENT_ID",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "ONEPAY_MERCHANT_ID",
    "NINEPAY_MERCHANT_KEY",
    "TWILIO_ACCOUNT_SID",
    "ESMS_API_KEY",
    "SMS_API_URL",
    "API_KEY",
    "PAYMENT_SECRET",
]

print("=== REQUIRED ===")
for k in required:
    v = lines.get(k, "")
    if not v:
        print(f"MISSING {k}")
    elif "CHANGE_ME" in v or v.startswith("dev-"):
        print(f"WEAK    {k} len={len(v)}")
    else:
        print(f"OK      {k} len={len(v)}")

print("=== OPTIONAL / G4 ===")
for k in optional:
    v = lines.get(k, "")
    print(f"{'OK     ' if v else 'EMPTY  '} {k}")
PY

echo
echo "=== REDIS PING ==="
redis-cli -n 2 ping 2>/dev/null || redis-cli ping 2>/dev/null || echo "redis-cli failed"

echo
echo "=== LOCAL HEALTH ==="
curl -fsS http://127.0.0.1:3010/health || true
echo

echo "=== LOGIN JWT SHAPE ==="
curl -sk -X POST https://api.minhtien.online/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@jetbay.local","password":"Admin123!"}' \
  -o /tmp/jb-login-audit.json
python3 <<'PY'
import json
from pathlib import Path
d = json.loads(Path("/tmp/jb-login-audit.json").read_text())
tokens = d.get("tokens") or {}
at = tokens.get("accessToken") or d.get("accessToken") or ""
rt = tokens.get("refreshToken") or d.get("refreshToken") or ""
print("accessToken_parts", len(at.split(".")) if at else 0)
print("refreshToken_parts", len(rt.split(".")) if rt else 0)
print("has_user", bool(d.get("user")))
PY
