#!/usr/bin/env bash
# Patch prod .env for Swagger: API_PUBLIC_URL + docs CORS (idempotent)
set -euo pipefail
ENV_FILE="${1:-/var/www/jetbay-be/.env}"
python3 - "$ENV_FILE" <<'PY'
import sys
from pathlib import Path

p = Path(sys.argv[1])
lines = p.read_text().splitlines()
out = []
changed = []
for line in lines:
    if line.startswith("API_PUBLIC_URL="):
        out.append("API_PUBLIC_URL=https://api.minhtien.online")
        changed.append("API_PUBLIC_URL")
        continue
    if line.startswith("CORS_ORIGIN="):
        val = line.split("=", 1)[1].strip().strip('"').strip("'")
        if "https://docs.minhtien.online" not in val:
            val = val.rstrip(",") + ",https://docs.minhtien.online"
            changed.append("CORS_ORIGIN")
        out.append("CORS_ORIGIN=" + val)
        continue
    out.append(line)
p.write_text("\n".join(out) + "\n")
print("updated:", ", ".join(changed) if changed else "already ok")
PY
grep -E '^(API_PUBLIC_URL|CORS_ORIGIN)=' "$ENV_FILE"
