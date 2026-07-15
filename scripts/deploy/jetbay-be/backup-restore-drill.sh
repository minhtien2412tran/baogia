#!/usr/bin/env bash
# JetBay DB backup + restore dry-run (T-S4-02)
# Run on VPS as root. Does NOT overwrite production DB.
#
# Usage:
#   bash /var/www/jetbay-be/deploy/backup-restore-drill.sh
#   DRY_RUN_ONLY=1 bash …   # backup + count only
set -euo pipefail

APP_ENV_FILE="${APP_ENV_FILE:-/var/www/jetbay-be/.env}"
BACKUP_DIR="${BACKUP_DIR:-/root/backups/jetbay-db}"
KEEP="${KEEP_BACKUPS:-14}"
TS="$(date +%Y%m%d-%H%M%S)"
LOG="${BACKUP_DIR}/drill-${TS}.log"
TEST_DB="jetbay_db_restore_test"

mkdir -p "${BACKUP_DIR}"
chmod 700 "${BACKUP_DIR}" 2>/dev/null || true
exec > >(tee -a "${LOG}") 2>&1

echo "=== JetBay backup+restore drill ${TS} ==="
echo "host=$(hostname) user=$(whoami)"

if [[ ! -f "${APP_ENV_FILE}" ]]; then
  echo "FAIL: missing ${APP_ENV_FILE}"
  exit 1
fi

DATABASE_URL_RAW="$(grep -E '^DATABASE_URL=' "${APP_ENV_FILE}" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")"
# Strip Prisma ?schema= for libpq
DATABASE_URL="$(python3 - "${DATABASE_URL_RAW}" <<'PY'
import sys
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode
u = urlparse(sys.argv[1])
q = parse_qs(u.query)
q.pop("schema", None)
query = urlencode({k: v[0] for k, v in q.items()})
print(urlunparse((u.scheme, u.netloc, u.path, "", query, "")))
PY
)"
PROD_DB="$(python3 - "${DATABASE_URL}" <<'PY'
import sys
from urllib.parse import urlparse
print(urlparse(sys.argv[1]).path.lstrip("/") or "jetbay_db")
PY
)"

if [[ -z "${DATABASE_URL}" ]]; then
  echo "FAIL: DATABASE_URL empty"
  exit 1
fi

DUMP="${BACKUP_DIR}/jetbay-${TS}.dump"
DUMP_TMP="/tmp/jetbay-${TS}.dump"
echo "[1/4] pg_dump prod DB=${PROD_DB} -> ${DUMP}"
# Prefer postgres peer when root (app role often cannot CREATE DATABASE)
if [[ "$(id -u)" -eq 0 ]] && id postgres >/dev/null 2>&1; then
  sudo -u postgres pg_dump -Fc -d "${PROD_DB}" -f "${DUMP_TMP}"
  mv -f "${DUMP_TMP}" "${DUMP}"
  chown root:root "${DUMP}"
  chmod 600 "${DUMP}"
else
  pg_dump "${DATABASE_URL}" -Fc -f "${DUMP}"
fi
ls -lh "${DUMP}"

echo "[2/4] prune old dumps (keep ${KEEP})"
ls -1t "${BACKUP_DIR}"/jetbay-*.dump 2>/dev/null | tail -n +"$((KEEP + 1))" | xargs -r rm -f

if [[ "$(id -u)" -eq 0 ]] && id postgres >/dev/null 2>&1; then
  PROD_AIRPORTS="$(cd /tmp && sudo -u postgres psql -d "${PROD_DB}" -Atc 'SELECT COUNT(*) FROM "Airport"' | tr -d '[:space:]')"
else
  PROD_AIRPORTS="$(psql "${DATABASE_URL}" -Atc 'SELECT COUNT(*) FROM "Airport"' | tr -d '[:space:]')"
fi
echo "prod Airport count=${PROD_AIRPORTS}"

if [[ "${DRY_RUN_ONLY:-0}" == "1" ]]; then
  echo "OK backup-only (DRY_RUN_ONLY=1) airports=${PROD_AIRPORTS}"
  echo "PASS backup"
  exit 0
fi

echo "[3/4] restore into ${TEST_DB}"
if [[ "$(id -u)" -ne 0 ]] || ! id postgres >/dev/null 2>&1; then
  echo "FAIL: restore drill requires root + postgres peer (app DB role lacks CREATE DATABASE)"
  exit 1
fi

cd /tmp
sudo -u postgres psql -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS ${TEST_DB};"
sudo -u postgres psql -v ON_ERROR_STOP=1 -c "CREATE DATABASE ${TEST_DB};"

set +e
cp -f "${DUMP}" "${DUMP_TMP}"
chmod 644 "${DUMP_TMP}"
cd /tmp
sudo -u postgres pg_restore --clean --if-exists --no-owner --no-acl -d "${TEST_DB}" "${DUMP_TMP}"
RESTORE_RC=$?
rm -f "${DUMP_TMP}"
set -e
if [[ "${RESTORE_RC}" -ne 0 ]]; then
  echo "WARN: pg_restore exited ${RESTORE_RC} — checking tables anyway"
fi

TEST_AIRPORTS="$(cd /tmp && sudo -u postgres psql -d "${TEST_DB}" -Atc 'SELECT COUNT(*) FROM "Airport"' 2>/dev/null | tr -d '[:space:]' || echo 0)"
echo "restore_test Airport count=${TEST_AIRPORTS}"

echo "[4/4] drop restore DB"
cd /tmp
sudo -u postgres psql -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS ${TEST_DB};"

if [[ -n "${PROD_AIRPORTS}" && "${PROD_AIRPORTS}" == "${TEST_AIRPORTS}" && "${PROD_AIRPORTS}" != "0" ]]; then
  echo "PASS restore drill airports=${TEST_AIRPORTS} log=${LOG}"
  exit 0
fi

echo "FAIL restore drill prod=${PROD_AIRPORTS} test=${TEST_AIRPORTS}"
exit 1
