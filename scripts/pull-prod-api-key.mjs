/**
 * Pull API_KEY from VPS jetbay-be .env into local apps (no print of secret).
 * Usage: node scripts/pull-prod-api-key.mjs
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const host = process.env.VPS_HOST || 'root@103.200.20.100';
const remote = execFileSync(
  'ssh',
  ['-o', 'BatchMode=yes', host, 'grep -E "^API_KEY=" /var/www/jetbay-be/.env'],
  { encoding: 'utf8' },
).trim();
const m = remote.match(/^API_KEY=(.*)$/);
if (!m) {
  console.error('No API_KEY on VPS');
  process.exit(1);
}
const key = m[1].replace(/^["']|["']$/g, '');
if (key.length < 16) {
  console.error('API_KEY too short');
  process.exit(1);
}

function upsert(path, names) {
  if (!existsSync(path)) {
    console.log('SKIP missing', path);
    return;
  }
  let text = readFileSync(path, 'utf8');
  for (const name of names) {
    const re = new RegExp(`^${name}=.*$`, 'm');
    if (re.test(text)) text = text.replace(re, `${name}=${key}`);
    else text += `\n${name}=${key}\n`;
  }
  writeFileSync(path, text);
  console.log('Updated', path, '(key not printed) len=', key.length);
}

const root = resolve(process.cwd());
upsert(resolve(root, 'apps/api/.env'), ['API_KEY']);
upsert(resolve(root, 'apps/web/.env.local'), ['NEXT_PUBLIC_API_KEY', 'API_KEY']);
upsert(resolve(root, 'apps/admin/.env.local'), ['NEXT_PUBLIC_API_KEY', 'API_KEY']);
console.log('Done. Restart Next.js to pick up env.');
