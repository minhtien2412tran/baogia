#!/usr/bin/env bash
# Rotate demo user passwords + Swagger Basic.
# Writes plaintext ONLY under /root/backups/... — never prints secrets to stdout.
#
# Optional fixed passwords (for FE-dev handoff — still do NOT commit):
#   ADMIN_PASS='...' DEMO_PASS='...' SWAGGER_PASS='...' SWAGGER_USER='docs' \
#     bash rotate-demo-swagger.sh
#
# Default: openssl random passwords.
set -euo pipefail

APP_ROOT="${APP_ROOT:-/var/www/jetbay-be}"
ENV_FILE="${APP_ROOT}/.env"
PM2_BIN="${PM2_BIN:-node /usr/lib/node_modules/pm2/bin/pm2}"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="/root/backups/jetbay-security-ops-${STAMP}"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ABORT: missing ${ENV_FILE}"
  exit 1
fi

mkdir -p "${BACKUP_DIR}"
chmod 700 "${BACKUP_DIR}"
cp -a "${ENV_FILE}" "${BACKUP_DIR}/env.before"

# Passwords: env override OR generated
if [[ -z "${ADMIN_PASS:-}" ]]; then
  ADMIN_PASS="$(openssl rand -base64 18 | tr -d '/+=' | head -c 20)Aa1!"
fi
if [[ -z "${DEMO_PASS:-}" ]]; then
  DEMO_PASS="$(openssl rand -base64 18 | tr -d '/+=' | head -c 20)Aa1!"
fi
if [[ -z "${SWAGGER_PASS:-}" ]]; then
  SWAGGER_PASS="$(openssl rand -base64 24 | tr -d '/+=' | head -c 28)"
fi
SWAGGER_USER="${SWAGGER_USER:-}"
if [[ -z "${SWAGGER_USER}" ]]; then
  SWAGGER_USER="$(grep -E '^SWAGGER_BASIC_USER=' "${ENV_FILE}" | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'" | tr -d '\r' || true)"
fi
if [[ -z "${SWAGGER_USER}" ]]; then
  SWAGGER_USER="docs"
fi

umask 077
{
  echo "# JetBay / JetVina credential rotation ${STAMP}"
  echo "# NEVER commit · chmod 600 · Owner / FE handoff only via private channel"
  echo "ADMIN_EMAIL=admin@jetbay.local"
  echo "ADMIN_PASSWORD=${ADMIN_PASS}"
  echo "DEMO_EMAIL=demo@jetbay.local"
  echo "DEMO_PASSWORD=${DEMO_PASS}"
  echo "SWAGGER_BASIC_USER=${SWAGGER_USER}"
  echo "SWAGGER_BASIC_PASSWORD=${SWAGGER_PASS}"
  echo "ADMIN_URL=https://admin.minhtien.online/login"
  echo "WEB_LOGIN=https://www.minhtien.online/en-us/login"
  echo "SWAGGER_URL=https://docs.minhtien.online/swagger"
  echo "API_URL=https://api.minhtien.online"
} > "${BACKUP_DIR}/demo-passwords.txt"
chmod 600 "${BACKUP_DIR}/demo-passwords.txt"

# FE-oriented handoff (same secrets — separate filename for sharing copy-paste)
{
  echo "# JetVina API / Swagger — handoff for FE developer"
  echo "# Generated ${STAMP} · Do not commit to Git · Do not post on baocaotiendo"
  echo ""
  echo "## 1. Open Swagger docs"
  echo "URL: https://docs.minhtien.online/swagger"
  echo "Browser Basic Auth:"
  echo "  Username: ${SWAGGER_USER}"
  echo "  Password: ${SWAGGER_PASS}"
  echo ""
  echo "## 2. Authorize in Swagger (X-API-Key)"
  echo "Value = API_KEY from VPS /var/www/jetbay-be/.env (Owner pastes separately)."
  echo "Header: X-API-Key: <API_KEY>"
  echo ""
  echo "## 3. JWT login (Authorize bearer)"
  echo "POST https://api.minhtien.online/auth/login"
  echo "  Admin: admin@jetbay.local / ${ADMIN_PASS}"
  echo "  Demo:  demo@jetbay.local / ${DEMO_PASS}"
  echo ""
  echo "## 4. Web / Admin smoke"
  echo "  Web:   https://www.minhtien.online/en-us/login"
  echo "  Admin: https://admin.minhtien.online/login"
  echo "  Use same emails/passwords as above."
  echo ""
  echo "## Notes"
  echo "- Seed Admin123! / Demo123! are INVALID after this rotation."
  echo "- Local FE must use prod API_KEY (or ask Owner) — local apps/api/.env key ≠ prod."
} > "${BACKUP_DIR}/fe-dev-handoff.txt"
chmod 600 "${BACKUP_DIR}/fe-dev-handoff.txt"

# Patch .env Swagger Basic (preserve other keys)
python3 - <<PY
from pathlib import Path
import re
env_path = Path("${ENV_FILE}")
text = env_path.read_text(encoding="utf-8", errors="replace")
user = """${SWAGGER_USER}"""
pw = """${SWAGGER_PASS}"""

def upsert(key: str, value: str, src: str) -> str:
    pat = re.compile(rf"^{re.escape(key)}=.*$", re.M)
    line = f"{key}={value}"
    if pat.search(src):
        return pat.sub(line, src)
    if not src.endswith("\n"):
        src += "\n"
    return src + line + "\n"

text = upsert("SWAGGER_BASIC_USER", user, text)
text = upsert("SWAGGER_BASIC_PASSWORD", pw, text)
env_path.write_text(text, encoding="utf-8")
print("env swagger keys updated")
PY

cp -a "${ENV_FILE}" "${BACKUP_DIR}/env.after"

# Update DB password hashes via Nest prisma / bcrypt in app node_modules
cd "${APP_ROOT}"
export ADMIN_PASS DEMO_PASS
node --input-type=module <<'NODE'
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const adminPass = process.env.ADMIN_PASS;
const demoPass = process.env.DEMO_PASS;
if (!adminPass || !demoPass) {
  console.error('missing passwords in env');
  process.exit(1);
}
const adminHash = bcrypt.hashSync(adminPass, 10);
const demoHash = bcrypt.hashSync(demoPass, 10);

const admin = await prisma.user.updateMany({
  where: { email: 'admin@jetbay.local' },
  data: { passwordHash: adminHash, role: 'ADMIN', status: 'ACTIVE' },
});
const demo = await prisma.user.updateMany({
  where: { email: 'demo@jetbay.local' },
  data: { passwordHash: demoHash, role: 'USER', status: 'ACTIVE' },
});
console.log(JSON.stringify({ adminUpdated: admin.count, demoUpdated: demo.count }));
await prisma.$disconnect();
NODE

unset ADMIN_PASS DEMO_PASS

export SWAGGER_BASIC_USER="${SWAGGER_USER}"
export SWAGGER_BASIC_PASSWORD="${SWAGGER_PASS}"
${PM2_BIN} restart jetbay-be --update-env
sleep 4
unset SWAGGER_PASS SWAGGER_BASIC_PASSWORD SWAGGER_BASIC_USER SWAGGER_USER

curl -fsSk https://api.minhtien.online/health >/dev/null
CODE_ANON=$(curl -sS -o /dev/null -w '%{http_code}' https://docs.minhtien.online/swagger || true)
USER_V=$(grep '^SWAGGER_BASIC_USER=' "${BACKUP_DIR}/demo-passwords.txt" | cut -d= -f2-)
PASS_V=$(grep '^SWAGGER_BASIC_PASSWORD=' "${BACKUP_DIR}/demo-passwords.txt" | cut -d= -f2-)
CODE_AUTH=$(curl -sS -o /dev/null -w '%{http_code}' -u "${USER_V}:${PASS_V}" https://docs.minhtien.online/swagger || true)
unset USER_V PASS_V

python3 - <<PY
import json, re, urllib.request, pathlib
env = pathlib.Path("${ENV_FILE}").read_text(encoding="utf-8", errors="replace")
m = re.search(r"^API_KEY=(.*)$", env, re.M)
if not m:
    raise SystemExit("API_KEY missing")
api_key = m.group(1).strip().strip('"').strip("'")
p = pathlib.Path("${BACKUP_DIR}/demo-passwords.txt")
vals = {}
for line in p.read_text().splitlines():
    if "=" in line and not line.startswith("#"):
        k,v = line.split("=",1); vals[k]=v

def login(email, password):
    req = urllib.request.Request(
        "https://api.minhtien.online/auth/login",
        data=json.dumps({"email": email, "password": password}).encode(),
        headers={"Content-Type": "application/json", "X-API-Key": api_key},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status
    except Exception as e:
        code = getattr(e, "code", None) or 0
        return int(code) if code else 0

admin_code = login(vals["ADMIN_EMAIL"], vals["ADMIN_PASSWORD"])
demo_code = login(vals["DEMO_EMAIL"], vals["DEMO_PASSWORD"])
print(json.dumps({
  "swagger_anon": "${CODE_ANON}",
  "swagger_auth": "${CODE_AUTH}",
  "admin_login": admin_code,
  "demo_login": demo_code,
  "backup_dir": "${BACKUP_DIR}",
  "password_file": "demo-passwords.txt",
  "fe_handoff": "fe-dev-handoff.txt",
}))
if admin_code not in (200, 201) or demo_code not in (200, 201):
    raise SystemExit(1)
if "${CODE_ANON}" != "401":
    print("WARN: swagger anon expected 401")
if "${CODE_AUTH}" == "401":
    raise SystemExit("swagger auth still 401")
PY

echo "OK: rotated demo + swagger · backup=${BACKUP_DIR}"
echo "Owner: sudo less ${BACKUP_DIR}/fe-dev-handoff.txt"
echo "Also paste API_KEY from ${ENV_FILE} into the FE message (not stored in fe-dev-handoff)."
