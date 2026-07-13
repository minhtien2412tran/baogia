import fs from 'node:fs';

const path = 'apps/api/.env';
let text = fs.readFileSync(path, 'utf8');
const needed = [
  'http://127.0.0.1:3011',
  'http://localhost:3011',
];
const m = text.match(/^CORS_ORIGIN=(.*)$/m);
if (!m) {
  text += `\nCORS_ORIGIN=${needed.join(',')}\n`;
} else {
  const raw = m[1].replace(/^["']|["']$/g, '');
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
  for (const n of needed) {
    if (!parts.includes(n)) parts.push(n);
  }
  text = text.replace(/^CORS_ORIGIN=.*$/m, `CORS_ORIGIN=${parts.join(',')}`);
}
fs.writeFileSync(path, text.endsWith('\n') ? text : `${text}\n`);
console.log('CORS_ORIGIN updated to include :3011 (value not printed)');
