/**
 * Sync API_KEY from apps/api/.env into web/admin .env.local as NEXT_PUBLIC_API_KEY.
 *
 * Modes:
 *   node scripts/sync-frontend-api-key.mjs           # smart (default)
 *   node scripts/sync-frontend-api-key.mjs --force   # always overwrite web+admin
 *   node scripts/sync-frontend-api-key.mjs --admin-only
 *
 * Smart rules (S2 — keep local API key ≠ prod web key):
 * - If apps/web/.env.local has NEXT_PUBLIC_API_URL pointing at prod
 *   (api.minhtien.online) OR USE_PROD_API=true → do NOT overwrite web key
 *   (web stays on prod app-key; local API keeps its own key).
 * - Admin always syncs from local API unless --skip-admin.
 *
 * Never prints the key value.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const adminOnly = args.has('--admin-only');
const skipAdmin = args.has('--skip-admin');

const apiEnv = resolve(root, 'apps/api/.env');
if (!existsSync(apiEnv)) {
  console.error('Missing apps/api/.env — run node scripts/generate-local-env.mjs first');
  process.exit(1);
}

function readEnvFile(path) {
  if (!existsSync(path)) return {};
  /** @type {Record<string, string>} */
  const out = {};
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i < 0) continue;
    const k = line.slice(0, i).trim();
    const v = line.slice(i + 1).replace(/^["']|["']$/g, '').trim();
    out[k] = v;
  }
  return out;
}

const apiKey = readEnvFile(apiEnv).API_KEY;
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

const webEnvPath = resolve(root, 'apps/web/.env.local');
const webEnv = readEnvFile(webEnvPath);
const apiUrl = (webEnv.NEXT_PUBLIC_API_URL || '').toLowerCase();
const useProdFlag =
  String(webEnv.USE_PROD_API || process.env.USE_PROD_API || '')
    .toLowerCase()
    .trim() === 'true' ||
  webEnv.USE_PROD_API === '1' ||
  process.env.USE_PROD_API === '1';
const webPointsAtProd =
  useProdFlag ||
  apiUrl.includes('api.minhtien.online') ||
  apiUrl.includes('minhtien.online');

if (!adminOnly) {
  if (webPointsAtProd && !force) {
    console.log(
      'Skip web API key sync — web points at prod API (USE_PROD_API / NEXT_PUBLIC_API_URL).',
    );
    console.log(
      '  Local API keeps its own key; web keeps prod NEXT_PUBLIC_API_KEY.',
    );
    console.log('  Override with --force if you intentionally want local key on web.');
  } else {
    upsert(webEnvPath, 'NEXT_PUBLIC_API_KEY', apiKey);
    if (webPointsAtProd && force) {
      console.log('Forced web key sync while web URL is prod — ensure keys match target API.');
    }
  }
}

if (!skipAdmin) {
  upsert(resolve(root, 'apps/admin/.env.local'), 'NEXT_PUBLIC_API_KEY', apiKey);
}

console.log('Done. Restart Next.js web/admin to pick up env.');
