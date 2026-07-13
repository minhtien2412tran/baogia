const fs = require('fs');
const path = 'apps/admin/.env.local';
let text = fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : '';
function upsert(key, value) {
  const line = `${key}=${value}`;
  if (new RegExp(`^${key}=`, 'm').test(text)) {
    text = text.replace(new RegExp(`^${key}=.*$`, 'm'), line);
  } else {
    text = `${text.trimEnd()}\n${line}\n`;
  }
}
upsert('NEXT_PUBLIC_API_URL', 'http://127.0.0.1:4000');
// keep key in sync from api .env
const api = fs.readFileSync('apps/api/.env', 'utf8');
const keyLine = api.split(/\r?\n/).find((l) => l.startsWith('API_KEY='));
if (keyLine) {
  const key = keyLine.split('=', 2)[1].replace(/^["']|["']$/g, '').trim();
  upsert('NEXT_PUBLIC_API_KEY', key);
}
fs.writeFileSync(path, text.endsWith('\n') ? text : `${text}\n`);
console.log('admin .env.local updated (URL local; key synced; values not printed)');
console.log(
  'URL line:',
  text
    .split(/\r?\n/)
    .find((l) => l.startsWith('NEXT_PUBLIC_API_URL='))
    ?.replace(/=.*/, '=<set>'),
);
