#!/usr/bin/env bash
# Sync apps/web + packages/ui to VPS /var/www/jetbay-web
set -euo pipefail

VPS_HOST="${VPS_HOST:-root@103.200.20.100}"
APP_ROOT="${APP_ROOT:-/var/www/jetbay-web}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"

ssh -o BatchMode=yes "${VPS_HOST}" "mkdir -p ${APP_ROOT}/vendor ${APP_ROOT}/logs"

echo "[sync-web] rsync packages/ui → vendor/ui"
rsync -avz --delete \
  --exclude node_modules \
  --exclude .next \
  "${REPO_ROOT}/packages/ui/" "${VPS_HOST}:${APP_ROOT}/vendor/ui/"

echo "[sync-web] rsync apps/web → ${APP_ROOT}"
rsync -avz --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude .env \
  --exclude .env.local \
  --exclude coverage \
  "${REPO_ROOT}/apps/web/" "${VPS_HOST}:${APP_ROOT}/"

echo "[sync-web] patch package.json for file:vendor/ui"
ssh -o BatchMode=yes "${VPS_HOST}" "python3 - <<'PY'
import json
from pathlib import Path
p = Path('${APP_ROOT}/package.json')
data = json.loads(p.read_text())
data['name'] = 'jetbay-web'
deps = data.setdefault('dependencies', {})
deps['@jetbay/ui'] = 'file:vendor/ui'
p.write_text(json.dumps(data, indent=2) + '\n')
print('patched', p)
PY"

echo "[sync-web] copy deploy nginx configs"
rsync -avz \
  "${REPO_ROOT}/scripts/deploy/jetbay-be/www.minhtien.online.http.conf" \
  "${REPO_ROOT}/scripts/deploy/jetbay-be/www.minhtien.online.ssl.conf" \
  "${REPO_ROOT}/scripts/deploy/jetbay-be/deploy-web.sh" \
  "${REPO_ROOT}/scripts/deploy/jetbay-be/sync-admin-api-key.sh" \
  "${VPS_HOST}:${APP_ROOT}/deploy/"

echo "[sync-web] Done. On VPS:"
echo "  DEPLOY_CONFIRM='ĐỒNG Ý TRIỂN KHAI' bash ${APP_ROOT}/deploy/deploy-web.sh"
