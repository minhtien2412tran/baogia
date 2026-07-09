/**
 * Copy API_KEY from apps/api/.env into web/admin .env.local as NEXT_PUBLIC_API_KEY.
 * Usage: node scripts/sync-frontend-api-key.mjs
 * Never prints the key value.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const apiEnv = resolve(root, 'apps/api/.env');
if (!existsSync(apiEnv)) {
  console.error('Missing apps/api/.env — run node scripts/generate-local-env.mjs first');
  process.exit(1);
}

const apiKey = readFileSync(apiEnv, 'utf8')
  .split(/\r?\n/)
  .find((l) => l.startsWith('API_KEY='))
  ?.split('=', 2)[1]
  ?.replace(/^["']|["']$/g, '')
  ?.trim();

if (!apiKey) {
  console.error('API_KEY not found in apps/api/.env');
  process.exit(1);
}

function upsert(path, key, value) {
  let text = existsSync(path) ? readFileSync(path, 'utf8') : '';
  const line = `${key}=${value}`;
  if (new RegExp(`^${key}=`, 'm').test(text)) {
    text = text.replace(new RegExp(`^${key}=.*$`, 'm'), line);
  } else {
    text = `${text.trimEnd()}\n${line}\n`;
  }
  writeFileSync(path, text.endsWith('\n') ? text : `${text}\n`);
  console.log('Updated', path, `(${key} set, value not printed)`);
}

upsert(resolve(root, 'apps/web/.env.local'), 'NEXT_PUBLIC_API_KEY', apiKey);
upsert(resolve(root, 'apps/admin/.env.local'), 'NEXT_PUBLIC_API_KEY', apiKey);
console.log('Done. Restart Next.js web/admin to pick up env.');
