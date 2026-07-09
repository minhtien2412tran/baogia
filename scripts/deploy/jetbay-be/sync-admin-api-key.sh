#!/usr/bin/env bash
# Sync API_KEY from jetbay-be/.env into jetbay-admin/.env.local as NEXT_PUBLIC_API_KEY
set -euo pipefail
API_ENV="${API_ENV:-/var/www/jetbay-be/.env}"
ADMIN_ENV="${ADMIN_ENV:-/var/www/jetbay-admin/.env.local}"

API_KEY="$(grep -E '^API_KEY=' "${API_ENV}" | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
if [ -z "${API_KEY}" ]; then
  echo "ABORT: API_KEY missing in ${API_ENV}"
  exit 1
fi

if [ ! -f "${ADMIN_ENV}" ]; then
  echo "NEXT_PUBLIC_API_URL=https://api.minhtien.online" > "${ADMIN_ENV}"
fi

if grep -q '^NEXT_PUBLIC_API_KEY=' "${ADMIN_ENV}"; then
  sed -i "s|^NEXT_PUBLIC_API_KEY=.*|NEXT_PUBLIC_API_KEY=${API_KEY}|" "${ADMIN_ENV}"
else
  echo "NEXT_PUBLIC_API_KEY=${API_KEY}" >> "${ADMIN_ENV}"
fi
chmod 600 "${ADMIN_ENV}"
echo "[sync] admin NEXT_PUBLIC_API_KEY updated (value not printed), len=${#API_KEY}"
