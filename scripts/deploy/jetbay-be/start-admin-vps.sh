#!/usr/bin/env bash
# Extract uploaded admin pack and start on 127.0.0.1:3011
set -euo pipefail
APP_ROOT=/var/www/jetbay-admin
PM2_BIN="${PM2_BIN:-node /usr/lib/node_modules/pm2/bin/pm2}"
BACKUP_DIR="/root/backups/jetbay-admin-$(date +%Y%m%d-%H%M%S)"

mkdir -p "${BACKUP_DIR}" "${APP_ROOT}"
cp -a /etc/nginx/sites-available "${BACKUP_DIR}/" 2>/dev/null || true
cp -a /etc/nginx/sites-enabled "${BACKUP_DIR}/" 2>/dev/null || true

rm -rf "${APP_ROOT:?}/"*
tar -xzf /tmp/jetbay-admin.tar.gz -C "${APP_ROOT}"
mkdir -p "${APP_ROOT}/logs"

# Ensure package points to local ui
python3 <<'PY'
import json
from pathlib import Path
p = Path('/var/www/jetbay-admin/package.json')
data = json.loads(p.read_text())
data.setdefault('dependencies', {})['@j-ta/ui'] = 'file:./vendor/ui'
# strip BOM if any
p.write_text(json.dumps(data, indent=2) + '\n')
print('package.json ok')
PY

cat > "${APP_ROOT}/.env.local" <<EOF
NEXT_PUBLIC_API_URL=https://api.minhtien.online
PORT=3011
HOSTNAME=127.0.0.1
EOF
chmod 600 "${APP_ROOT}/.env.local"

cd "${APP_ROOT}"
npm install --legacy-peer-deps 2>&1 | tail -15

# If .next missing, build
if [ ! -d .next ]; then
  npm run build
fi

cat > "${APP_ROOT}/ecosystem.config.js" <<'EOF'
module.exports = {
  apps: [{
    name: 'jetbay-admin',
    cwd: '/var/www/jetbay-admin',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -H 127.0.0.1 -p 3011',
    env: {
      NODE_ENV: 'production',
      PORT: '3011',
      HOSTNAME: '127.0.0.1',
      NEXT_PUBLIC_API_URL: 'https://api.minhtien.online',
    },
    error_file: '/var/www/jetbay-admin/logs/pm2-error.log',
    out_file: '/var/www/jetbay-admin/logs/pm2-out.log',
    merge_logs: true,
  }],
};
EOF

${PM2_BIN} delete jetbay-admin 2>/dev/null || true
${PM2_BIN} start "${APP_ROOT}/ecosystem.config.js"
${PM2_BIN} save

cp /tmp/admin.minhtien.online.http.conf /etc/nginx/sites-available/admin.minhtien.online
ln -sf /etc/nginx/sites-available/admin.minhtien.online /etc/nginx/sites-enabled/admin.minhtien.online
nginx -t
systemctl reload nginx

if [ ! -f /etc/letsencrypt/live/admin.minhtien.online/fullchain.pem ]; then
  certbot certonly --webroot -w /var/www/certbot -d admin.minhtien.online \
    --non-interactive --agree-tos --register-unsafely-without-email || \
  certbot certonly --nginx -d admin.minhtien.online \
    --non-interactive --agree-tos --register-unsafely-without-email || true
fi

if [ -f /etc/letsencrypt/live/admin.minhtien.online/fullchain.pem ]; then
  cp /tmp/admin.minhtien.online.ssl.conf /etc/nginx/sites-available/admin.minhtien.online
  nginx -t && systemctl reload nginx
fi

sleep 3
echo "=== LOCAL ==="
curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3011/ || true
echo "=== PUBLIC ==="
curl -sk -o /dev/null -w '%{http_code}\n' https://admin.minhtien.online/ || true
curl -sk -o /dev/null -w '%{http_code}\n' https://admin.minhtien.online/login || true
ss -tlnp | grep 3011 || true
echo "Backup: ${BACKUP_DIR}"
