#!/usr/bin/env bash
# Seed jetbay_db on VPS (idempotent upserts)
set -euo pipefail
APP_ROOT="${APP_ROOT:-/var/www/jetbay-be}"
cd "${APP_ROOT}"
set -a
# shellcheck disable=SC1091
source .env
set +a

echo "[seed] prisma generate"
npx prisma generate

echo "[seed] running seed.ts"
if npx ts-node --transpile-only prisma/seed.ts; then
  echo "[seed] OK via ts-node"
elif npx tsx prisma/seed.ts; then
  echo "[seed] OK via tsx"
else
  echo "[seed] compiling seed with tsc fallback"
  npx tsc prisma/seed.ts --esModuleInterop --resolveJsonModule --module commonjs --outDir /tmp/jetbay-seed --skipLibCheck
  node /tmp/jetbay-seed/seed.js
fi

echo "[seed] done"
