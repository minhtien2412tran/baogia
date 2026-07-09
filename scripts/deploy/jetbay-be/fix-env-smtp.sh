#!/usr/bin/env bash
set -euo pipefail
ENV_FILE="/var/www/jetbay-be/.env"
python3 <<'PY'
from pathlib import Path
p = Path("/var/www/jetbay-be/.env")
lines = p.read_text().splitlines()
out = []
for line in lines:
    if line.startswith("SMTP_FROM="):
        out.append('SMTP_FROM="JetBay <noreply@minhtien.online>"')
    else:
        out.append(line)
p.write_text("\n".join(out) + "\n")
PY
