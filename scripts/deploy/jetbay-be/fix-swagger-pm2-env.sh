#!/usr/bin/env bash
# Sync SWAGGER_BASIC_* from .env into PM2 process env and restart.
set -euo pipefail
APP_ROOT="${APP_ROOT:-/var/www/jetbay-be}"
PM2_BIN="${PM2_BIN:-node /usr/lib/node_modules/pm2/bin/pm2}"
ENV_FILE="${APP_ROOT}/.env"

eval "$(python3 - <<PY
from pathlib import Path
import re, shlex
t = Path("${ENV_FILE}").read_text(encoding="utf-8", errors="replace")
def get(k):
    m = re.search(rf"^{re.escape(k)}=(.*)$", t, re.M)
    if not m: return ""
    return m.group(1).strip().strip('"').strip("'")
u, p = get("SWAGGER_BASIC_USER"), get("SWAGGER_BASIC_PASSWORD")
print(f"export SWAGGER_BASIC_USER={shlex.quote(u)}")
print(f"export SWAGGER_BASIC_PASSWORD={shlex.quote(p)}")
PY
)"

echo "syncing swagger basic into pm2 (user_len=${#SWAGGER_BASIC_USER} pass_len=${#SWAGGER_BASIC_PASSWORD})"
${PM2_BIN} restart jetbay-be --update-env
sleep 4
unset SWAGGER_BASIC_PASSWORD
python3 /tmp/debug-swagger-proc-env.py
python3 /tmp/debug-swagger-basic.py
