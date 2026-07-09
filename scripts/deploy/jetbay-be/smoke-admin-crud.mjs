#!/usr/bin/env node
/**
 * Smoke new admin CRUD surfaces before deploy.
 * Usage:
 *   node scripts/deploy/jetbay-be/smoke-admin-crud.mjs
 *   API_URL=https://api.minhtien.online node scripts/deploy/jetbay-be/smoke-admin-crud.mjs
 *
 * Env: API_URL, API_KEY (or from apps/api/.env), ADMIN_EMAIL, ADMIN_PASSWORD
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../../..');

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

const localEnv = {
  ...loadEnvFile(resolve(repoRoot, 'apps/api/.env')),
  ...loadEnvFile(resolve(repoRoot, 'apps/admin/.env.local')),
};

const API_URL = (process.env.API_URL || localEnv.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000').replace(/\/$/, '');
const API_KEY = process.env.API_KEY || localEnv.API_KEY || localEnv.NEXT_PUBLIC_API_KEY || '';
const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL,
  'admin@jetbay.local',
  'admin@j-ta.local',
].filter(Boolean);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';

const results = [];
function ok(name, detail = '') {
  results.push({ name, pass: true, detail });
  console.log(`PASS  ${name}${detail ? ` — ${detail}` : ''}`);
}
function fail(name, detail = '') {
  results.push({ name, pass: false, detail });
  console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
}

async function req(path, { method = 'GET', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (API_KEY) headers['X-API-Key'] = API_KEY;
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { status: res.status, json, text };
}

async function login() {
  for (const email of ADMIN_EMAILS) {
    const { status, json } = await req('/auth/login', {
      method: 'POST',
      body: { email, password: ADMIN_PASSWORD },
    });
    const token = json?.tokens?.accessToken;
    if (status === 200 || status === 201) {
      if (token) return { email, token };
    }
  }
  return null;
}

async function main() {
  console.log(`API_URL=${API_URL}`);
  console.log(`API_KEY len=${API_KEY.length}`);

  const health = await req('/health');
  if (health.status === 200) ok('health', JSON.stringify(health.json?.status ?? health.status));
  else fail('health', `status=${health.status}`);

  const auth = await login();
  if (!auth) {
    fail('admin login', `tried ${ADMIN_EMAILS.join(', ')}`);
    summarize();
    process.exit(1);
  }
  ok('admin login', auth.email);
  const { token } = auth;

  // Quotes list + status patch (idempotent: set same or cycle PENDING)
  const quotes = await req('/admin/dashboard/recent-quotes?limit=5', { token });
  if (quotes.status === 200 && Array.isArray(quotes.json)) {
    ok('quotes list', `count=${quotes.json.length}`);
    if (quotes.json.length > 0) {
      const q = quotes.json[0];
      const next =
        String(q.status).toUpperCase() === 'PENDING' ? 'OFFERED' : 'PENDING';
      const patch = await req(`/admin/quotes/${q.id}/status`, {
        method: 'PATCH',
        token,
        body: { status: next },
      });
      if (patch.status === 200 && patch.json?.status === next) {
        ok('quotes status patch', `#${q.id} → ${next}`);
        // restore
        await req(`/admin/quotes/${q.id}/status`, {
          method: 'PATCH',
          token,
          body: { status: String(q.status).toUpperCase() },
        });
      } else {
        fail('quotes status patch', `status=${patch.status} body=${JSON.stringify(patch.json).slice(0, 160)}`);
      }
    } else {
      ok('quotes status patch', 'skipped (no quotes)');
    }
  } else {
    fail('quotes list', `status=${quotes.status}`);
  }

  // Airports list
  const airports = await req('/admin/airports?limit=5', { token });
  if (airports.status === 200 && Array.isArray(airports.json?.data)) {
    ok('airports list', `total=${airports.json.pagination?.total ?? airports.json.data.length}`);
  } else {
    fail('airports list', `status=${airports.status}`);
  }

  // Airport create/update/delete roundtrip
  const stamp = Date.now().toString().slice(-6);
  const iata = `Z${stamp.slice(0, 2)}`.slice(0, 3).toUpperCase();
  // ensure 3-letter unique-ish
  const testIata = `T${stamp.slice(-2)}`.toUpperCase();
  const created = await req('/admin/airports', {
    method: 'POST',
    token,
    body: {
      iata: testIata,
      icao: `XX${testIata}`,
      name: `Smoke Test Airport ${stamp}`,
      city: 'Smoke City',
      country: 'Testland',
      timezone: 'UTC',
      status: 'INACTIVE',
    },
  });
  if (created.status === 200 || created.status === 201) {
    const id = created.json?.id;
    ok('airports create', `id=${id} iata=${testIata}`);
    const updated = await req(`/admin/airports/${id}`, {
      method: 'PATCH',
      token,
      body: { city: 'Smoke City Updated' },
    });
    if (updated.status === 200 && updated.json?.city === 'Smoke City Updated') {
      ok('airports update', `id=${id}`);
    } else {
      fail('airports update', `status=${updated.status}`);
    }
    const deleted = await req(`/admin/airports/${id}`, { method: 'DELETE', token });
    if (deleted.status === 200) ok('airports delete', `id=${id}`);
    else fail('airports delete', `status=${deleted.status}`);
  } else {
    fail('airports create', `status=${created.status} ${JSON.stringify(created.json).slice(0, 160)}`);
  }

  // Videos list
  const videos = await req('/admin/content/videos', { token });
  if (videos.status === 200 && Array.isArray(videos.json?.data)) {
    ok('videos list', `count=${videos.json.data.length}`);
  } else {
    fail('videos list', `status=${videos.status}`);
  }

  // CMS pages list + get by id
  const pages = await req('/admin/content/pages', { token });
  if (pages.status === 200 && Array.isArray(pages.json?.data)) {
    ok('cms pages list', `count=${pages.json.data.length}`);
    const first = pages.json.data[0];
    if (first?.id) {
      const one = await req(`/admin/content/pages/${first.id}`, { token });
      if (one.status === 200 && one.json?.id === first.id) {
        ok('cms page get', `id=${first.id} slug=${one.json.slug}`);
      } else {
        fail('cms page get', `status=${one.status}`);
      }
    } else {
      ok('cms page get', 'skipped (no pages)');
    }
  } else {
    fail('cms pages list', `status=${pages.status}`);
  }

  // Partners + travel credits (previous feature)
  const partners = await req('/admin/partners/applications', { token });
  if (partners.status === 200 && Array.isArray(partners.json?.applications)) {
    ok('partners list', `count=${partners.json.applications.length}`);
  } else {
    fail('partners list', `status=${partners.status}`);
  }

  const tc = await req('/admin/travel-credits/packages', { token });
  if (tc.status === 200 && Array.isArray(tc.json?.packages)) {
    ok('travel-credit packages', `count=${tc.json.packages.length}`);
  } else {
    fail('travel-credit packages', `status=${tc.status}`);
  }

  summarize();
}

function summarize() {
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`\nRESULT pass=${passed} fail=${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
