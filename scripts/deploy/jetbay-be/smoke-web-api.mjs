/**
 * Smoke: web-facing API contract used by apps/web.
 * Usage:
 *   node scripts/deploy/jetbay-be/smoke-web-api.mjs
 *   API_URL=http://127.0.0.1:4000 API_KEY=... node scripts/deploy/jetbay-be/smoke-web-api.mjs
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
  ...loadEnvFile(resolve(repoRoot, 'apps/web/.env.local')),
};

const BASE = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://api.minhtien.online'
).replace(/\/$/, '');
const API_KEY =
  process.env.API_KEY || localEnv.API_KEY || localEnv.NEXT_PUBLIC_API_KEY || '';

function headers(extra = {}) {
  return {
    'Content-Type': 'application/json',
    ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
    ...extra,
  };
}

async function get(path) {
  const r = await fetch(`${BASE}${path}`, { headers: headers() });
  const j = await r.json().catch(() => ({}));
  return { status: r.status, j };
}

async function post(path, body) {
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  return { status: r.status, j };
}

let fail = 0;
function ok(name, cond, detail = '') {
  if (cond) console.log('OK ', name, detail);
  else {
    console.log('FAIL', name, detail);
    fail++;
  }
}

const checks = [
  [
    'fixed-price',
    () =>
      get('/fixed-price/routes').then(({ status, j }) =>
        ok('fixed-price', status === 200 && (j.routes?.length ?? 0) >= 12, `n=${j.routes?.length}`),
      ),
  ],
  [
    'empty-legs',
    () =>
      get('/empty-legs').then(({ status, j }) =>
        ok('empty-legs', status === 200 && (j.emptyLegs?.length ?? 0) > 0, `n=${j.emptyLegs?.length}`),
      ),
  ],
  [
    'jet-card',
    () =>
      get('/jet-card/plans').then(({ status, j }) =>
        ok('jet-card', status === 200 && (j.plans?.length ?? 0) > 0, `n=${j.plans?.length}`),
      ),
  ],
  [
    'travel-credits',
    () =>
      get('/travel-credits/packages').then(({ status, j }) =>
        ok(
          'travel-credits',
          status === 200 && (j.packages?.length ?? 0) > 0,
          `n=${j.packages?.length}`,
        ),
      ),
  ],
  [
    'news',
    () =>
      get('/content/news?locale=en').then(({ status, j }) =>
        ok('news', status === 200 && (j.news?.length ?? 0) >= 1, `n=${j.news?.length}`),
      ),
  ],
  [
    'destinations',
    () =>
      get('/content/destinations?limit=5').then(({ status, j }) =>
        ok(
          'destinations',
          status === 200 && (j.destinations?.length ?? 0) > 0,
          `n=${j.destinations?.length}`,
        ),
      ),
  ],
  [
    'airports',
    () =>
      get('/airports/search?q=SGN').then(({ status, j }) =>
        ok('airports', status === 200 && (j.airports?.length ?? 0) > 0, `n=${j.airports?.length}`),
      ),
  ],
  [
    'quote',
    () =>
      post('/quotes/request', {
        firstName: 'Web',
        lastName: 'Smoke',
        email: 'demo@jetbay.local',
        phone: '+84900000000',
        isConsentAccepted: true,
        legs: [
          {
            fromAirport: 'SGN',
            toAirport: 'HAN',
            departureDate: '2026-09-15T10:00:00Z',
            passengers: 2,
          },
        ],
      }).then(({ status, j }) =>
        ok('quote', status === 201 || status === 200, `id=${j.requestId ?? j.id}`),
      ),
  ],
];

console.log('BASE', BASE);
console.log('API_KEY len', API_KEY.length);
for (const [, fn] of checks) await fn();
console.log(fail === 0 ? 'RESULT pass' : `RESULT fail=${fail}`);
process.exit(fail === 0 ? 0 : 1);
