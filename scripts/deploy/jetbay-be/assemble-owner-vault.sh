#!/usr/bin/env bash
# Build ONE owner vault file on VPS (passwords + paths). Never commit / never chat.
# Usage on VPS:
#   bash /var/www/jetbay-be/deploy/assemble-owner-vault.sh
# Optional:
#   STAMP=20260716-221238 bash assemble-owner-vault.sh
set -euo pipefail

APP_ROOT="${APP_ROOT:-/var/www/jetbay-be}"
ENV_FILE="${APP_ROOT}/.env"
OUT_DIR="${OUT_DIR:-/root/backups}"
STAMP_NOW="$(date +%Y%m%d-%H%M%S)"
OUT_FILE="${OUT_DIR}/jetbay-owner-vault-${STAMP_NOW}.txt"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ABORT: missing ${ENV_FILE}"
  exit 1
fi

# Prefer explicit STAMP, else newest rotate backup that has fe-dev-handoff.txt
if [[ -n "${STAMP:-}" ]]; then
  OPS_DIR="/root/backups/jetbay-security-ops-${STAMP}"
else
  OPS_DIR="$(ls -1dt /root/backups/jetbay-security-ops-*/ 2>/dev/null | head -1 || true)"
  OPS_DIR="${OPS_DIR%/}"
fi

if [[ -z "${OPS_DIR}" || ! -d "${OPS_DIR}" ]]; then
  echo "ABORT: no jetbay-security-ops-* backup found under /root/backups"
  exit 1
fi

mkdir -p "${OUT_DIR}"
umask 077

{
  echo "# JetVina / JetBay — OWNER VAULT (CONFIDENTIAL)"
  echo "# Generated: ${STAMP_NOW}"
  echo "# Host: $(hostname -f 2>/dev/null || hostname)"
  echo "# DO NOT commit · DO NOT paste to chat / baocaotiendo"
  echo

  echo "========== 1) FE DEV HANDOFF =========="
  if [[ -f "${OPS_DIR}/fe-dev-handoff.txt" ]]; then
    cat "${OPS_DIR}/fe-dev-handoff.txt"
  else
    echo "(missing fe-dev-handoff.txt in ${OPS_DIR})"
  fi
  echo

  echo "========== 2) DEMO + SWAGGER PASSWORDS (raw) =========="
  if [[ -f "${OPS_DIR}/demo-passwords.txt" ]]; then
    cat "${OPS_DIR}/demo-passwords.txt"
  else
    echo "(missing demo-passwords.txt in ${OPS_DIR})"
  fi
  echo

  echo "========== 3) PROD API_KEY + SWAGGER FROM .env =========="
  grep -E '^(API_KEY|SWAGGER_BASIC_USER|SWAGGER_BASIC_PASSWORD)=' "${ENV_FILE}" || true
  echo

  echo "========== 4) IMPORTANT PATHS (no full .env dump) =========="
  echo "Prod API env:     ${ENV_FILE}  (chmod 600)"
  echo "Rotate backup:    ${OPS_DIR}"
  echo "  - fe-dev-handoff.txt"
  echo "  - demo-passwords.txt"
  echo "  - env.before"
  echo "This vault:       ${OUT_FILE}"
  echo "PM2 apps:         jetbay-be · jetbay-web · jetbay-admin"
  echo "Docs URL:         https://docs.minhtien.online/swagger"
  echo "API URL:          https://api.minhtien.online"
  echo "Admin URL:        https://admin.minhtien.online"
  echo "Web URL:          https://www.minhtien.online"
  echo "Official brand:   https://jetvina.com/"
  echo

  echo "========== 5) LOCAL DEV (Windows machine — fill if needed) =========="
  echo "Repo local API:   apps/api/.env          (gitignored)"
  echo "Repo local web:   apps/web/.env.local    (gitignored)"
  echo "Owner vault copy: .secrets/OWNER_VAULT.txt (gitignored)"
  echo

  echo "========== 6) ROTATE / RECOVER =========="
  echo "Rotate demo+swagger: bash ${APP_ROOT}/deploy/rotate-demo-swagger.sh"
  echo "Rotate core secrets: bash ${APP_ROOT}/deploy/rotate-secrets.sh"
  echo "Re-assemble vault:   bash ${APP_ROOT}/deploy/assemble-owner-vault.sh"
} > "${OUT_FILE}"

chmod 600 "${OUT_FILE}"
echo "OK: vault=${OUT_FILE}"
echo "Pull to PC: scp root@103.200.20.100:${OUT_FILE} .secrets/OWNER_VAULT.txt"
