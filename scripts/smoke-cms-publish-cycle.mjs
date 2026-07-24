/**
 * W2-09: create draft news → publish → verify public → unpublish → delete.
 * Credentials via env or VPS demo-passwords.txt (never printed).
 *
 * Local: ADMIN_EMAIL=... ADMIN_PASSWORD=... API_KEY=... node scripts/smoke-cms-publish-cycle.mjs
 * VPS:   node /tmp/smoke-cms-publish-cycle.mjs  (script loads /var/www/jetbay-be/.env + latest demo-passwords)
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

function loadEnv(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

function latestDemoPasswords() {
  const root = '/root/backups';
  if (!existsSync(root)) return {};
  const dirs = readdirSync(root)
    .filter((d) => d.startsWith('jetbay-security-ops-'))
    .sort()
    .reverse();
  for (const d of dirs) {
    const p = join(root, d, 'demo-passwords.txt');
    if (existsSync(p)) return loadEnv(p);
  }
  return {};
}

const env = {
  ...loadEnv(resolve(process.cwd(), 'apps/api/.env')),
  ...loadEnv('/var/www/jetbay-be/.env'),
  ...latestDemoPasswords(),
};

const BASE = (process.env.API_URL || env.API_URL || 'https://api.minhtien.online').replace(
  /\/$/,
  '',
);
const API_KEY = process.env.API_KEY || env.API_KEY || '';
const EMAIL = process.env.ADMIN_EMAIL || env.ADMIN_EMAIL || 'admin@jetbay.local';
const PASS = process.env.ADMIN_PASSWORD || env.ADMIN_PASSWORD || '';

if (!API_KEY || !PASS) {
  console.log('SKIP — need API_KEY + ADMIN_PASSWORD (env or VPS demo-passwords.txt)');
  process.exit(0);
}

const headers = (token) => ({
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY,
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

async function jfetch(path, opts = {}) {
  const r = await fetch(`${BASE}${path}`, opts);
  const j = await r.json().catch(() => ({}));
  return { status: r.status, j };
}

const slug = `gd2-smoke-publish-${Date.now()}`;
console.log('BASE', BASE);
console.log('ADMIN_EMAIL set', Boolean(EMAIL), 'API_KEY len', API_KEY.length);

const login = await jfetch('/auth/login', {
  method: 'POST',
  headers: headers(),
  body: JSON.stringify({ email: EMAIL, password: PASS }),
});
const token = login.j?.tokens?.accessToken;
if (!token) {
  console.log('FAIL login', login.status, login.j?.message || login.j?.error || '');
  process.exit(1);
}
console.log('OK login');

const create = await jfetch('/admin/content/articles', {
  method: 'POST',
  headers: headers(token),
  body: JSON.stringify({
    type: 'news',
    slug,
    status: 'draft',
    author: 'GD2 Smoke',
    translation: {
      locale: 'en',
      title: 'GD2 smoke publish cycle (auto-delete)',
      excerpt: 'Internal smoke — do not keep',
      body: '<p>Temporary draft for publish/unpublish verification.</p>',
      seoTitle: 'GD2 smoke',
      seoDescription: 'Internal smoke article',
    },
  }),
});
const id = create.j?.id ?? create.j?.article?.id;
if (!id) {
  console.log('FAIL create', create.status, JSON.stringify(create.j).slice(0, 300));
  process.exit(1);
}
console.log('OK create draft id=', id);

const pub = await jfetch(`/admin/content/articles/${id}`, {
  method: 'PATCH',
  headers: headers(token),
  body: JSON.stringify({ status: 'published' }),
});
console.log(pub.status < 300 ? 'OK publish' : `FAIL publish ${pub.status}`);

const list = await jfetch('/content/news?locale=en', { headers: headers() });
const found = (list.j.news || []).some((n) => n.slug === slug || n.id === id);
console.log(found ? 'OK public list contains article' : 'FAIL not in public list');

const unpub = await jfetch(`/admin/content/articles/${id}`, {
  method: 'PATCH',
  headers: headers(token),
  body: JSON.stringify({ status: 'draft' }),
});
console.log(unpub.status < 300 ? 'OK unpublish→draft' : `FAIL unpublish ${unpub.status}`);

const list2 = await jfetch('/content/news?locale=en', { headers: headers() });
const still = (list2.j.news || []).some((n) => n.slug === slug);
console.log(!still ? 'OK removed from public list' : 'FAIL still public');

const del = await jfetch(`/admin/content/articles/${id}`, {
  method: 'DELETE',
  headers: headers(token),
});
console.log(del.status < 300 ? 'OK cleanup delete' : `WARN delete ${del.status}`);

const ok = found && !still && pub.status < 300 && unpub.status < 300;
console.log(ok ? 'RESULT pass' : 'RESULT fail');
process.exit(ok ? 0 : 1);
