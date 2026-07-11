#!/usr/bin/env bash
set -euo pipefail
grep -A5 'buildPublicUrl' /var/www/jetbay-be/dist/services/storage.service.js 2>/dev/null | head -20 || grep -A5 'buildPublicUrl' /var/www/jetbay-be/src/services/storage.service.ts | head -20
echo "---"
# test URL builder via node if dist exists
node -e "
const fs=require('fs');
const p='/var/www/jetbay-be/src/services/storage.service.ts';
const t=fs.readFileSync(p,'utf8');
const m=t.match(/buildPublicUrl[\s\S]*?return \`\$\{this\.publicBase\}\/media\/\$\{encoded\}\`/);
console.log(m?m[0].slice(0,200):'no match');
" 2>/dev/null || true
echo "--- sample file ---"
find /var/www/jetbay-be/uploads -type f 2>/dev/null | head -5
echo "--- curl media ---"
KEY="enquiries/1723744994129-415bcc27-tu-bep-chu-l-hien-dai.webp"
curl -sk -o /dev/null -w "full_path:%{http_code}\n" "https://api.minhtien.online/media/${KEY}"
curl -sk -o /dev/null -w "truncated:%{http_code}\n" "https://api.minhtien.online/media/enquiries/172"
