#!/usr/bin/env bash
# Ensure SMTP + enquiry inbox + upload path keys exist on VPS (no secret values printed)
set -euo pipefail
ENV_FILE="/var/www/jetbay-be/.env"

python3 <<'PY'
from pathlib import Path

p = Path("/var/www/jetbay-be/.env")
lines = p.read_text().splitlines()
kv = {}
order = []
for line in lines:
    if not line or line.startswith("#") or "=" not in line:
        order.append(("raw", line))
        continue
    k, v = line.split("=", 1)
    kv[k] = v
    order.append(("kv", k))

defaults = {
    "SMTP_PORT": "587",
    "SMTP_SECURE": "false",
    "SMTP_FROM": '"JetBay <noreply@minhtien.online>"',
    "SMTP_ENQUIRY_TO": '"sales@minhtien.online"',
    "UPLOAD_PATH": "/var/www/jetbay-be/uploads",
    "MINIO_USE_SSL": "false",
}

added = []
for k, v in defaults.items():
    if k not in kv or not kv[k].strip().strip('"').strip("'"):
        kv[k] = v
        added.append(k)

if not added:
    print("[smtp] all optional keys present")
else:
    print("[smtp] added defaults for:", ", ".join(added))

out = []
seen = set()
for kind, item in order:
    if kind == "raw":
        out.append(item)
    elif item not in seen:
        out.append(f"{item}={kv[item]}")
        seen.add(item)

for k, v in kv.items():
    if k not in seen:
        out.append(f"{k}={v}")

p.write_text("\n".join(out) + "\n")
PY

mkdir -p /var/www/jetbay-be/uploads/media/enquiries
chmod 750 /var/www/jetbay-be/uploads
echo "[smtp] UPLOAD_PATH ready"
echo "[smtp] Set SMTP_USER/SMTP_PASSWORD if relay requires auth, then: pm2 restart jetbay-be"
