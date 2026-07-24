#!/usr/bin/env python3
"""Upsert SMTP_* keys into JetBay API .env. Reads JSON payload from stdin. Prints meta only."""
import json
import sys
from pathlib import Path

REMOTE_ENV = Path("/var/www/jetbay-be/.env")
payload = json.load(sys.stdin)
text = REMOTE_ENV.read_text(encoding="utf-8", errors="replace") if REMOTE_ENV.exists() else ""
lines = text.splitlines()
keys = set(payload)
out = []
seen = set()
for line in lines:
    if (not line.strip()) or line.lstrip().startswith("#") or ("=" not in line):
        out.append(line)
        continue
    k = line.split("=", 1)[0].strip()
    if k in keys:
        out.append(f"{k}={payload[k]}")
        seen.add(k)
    else:
        out.append(line)
for k, v in payload.items():
    if k not in seen:
        out.append(f"{k}={v}")
REMOTE_ENV.write_text("\n".join(out) + "\n", encoding="utf-8")
for k in sorted(payload):
    val = payload[k]
    if k == "SMTP_PASSWORD":
        print(f"{k}=SET len={len(val)}")
    elif k in ("SMTP_USER", "SMTP_FROM", "SMTP_ENQUIRY_TO", "SMTP_FROM_NAME"):
        print(f"{k}=SET")
    else:
        print(f"{k}={val}")
print("WROTE_OK")
