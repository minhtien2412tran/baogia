#!/usr/bin/env node
/**
 * W5-12C — Booking without Operator → operator_unassigned sales alert.
 *
 *   API_URL=https://api.minhtien.online API_KEY=… node scripts/deploy/jetbay-be/smoke-w5-12c-operator-unassigned.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

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
const BASE = (
  process.env.API_URL ||
  localEnv.NEXT_PUBLIC_API_URL ||
  'https://api.minhtien.online'
).replace(/\/$/, '');
const API_KEY =
  process.env.API_KEY || localEnv.API_KEY || localEnv.NEXT_PUBLIC_API_KEY || '';
const VPS = process.env.VPS_HOST || 'root@103.200.20.100';
const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL,
  'admin@j-ta.local',
  'admin@jetbay.local',
].filter(Boolean);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';

let fail = 0;
function ok(name, cond, detail = '') {
  if (cond) console.log(`PASS  ${name}${detail ? ` — ${detail}` : ''}`);
  else {
    console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
    fail++;
  }
}

async function req(path, { method = 'GET', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (API_KEY) headers['X-API-Key'] = API_KEY;
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

async function login() {
  for (const email of ADMIN_EMAILS) {
    const { status, json } = await req('/auth/login', {
      method: 'POST',
      body: { email, password: ADMIN_PASSWORD },
    });
    const token = json?.tokens?.accessToken;
    if ((status === 200 || status === 201) && token) return { email, token };
  }
  return null;
}

function queryCampaignLogs(bookingRef) {
  try {
    execSync(
      `scp -o BatchMode=yes "${resolve(__dirname, 'query-campaign-logs.mjs')}" ${VPS}:/tmp/query-campaign-logs.cjs`,
      { stdio: 'pipe' },
    );
    const out = execSync(
      `ssh -o BatchMode=yes ${VPS} "cd /var/www/jetbay-be && NODE_PATH=/var/www/jetbay-be/node_modules node /tmp/query-campaign-logs.cjs '${bookingRef.replace(/'/g, '')}'"`,
      { encoding: 'utf8', timeout: 60000 },
    );
    const line = out
      .split(/\r?\n/)
      .reverse()
      .find((l) => l.trim().startsWith('{'));
    return line ? JSON.parse(line) : null;
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    return null;
  }
}

console.log(`API_URL=${BASE}`);
const session = await login();
ok('login', !!session, session?.email ?? 'none');

const booking = await req('/bookings', {
  method: 'POST',
  token: session?.token,
  body: {
    bookingType: 'CHARTER',
    itinerary: {
      tripType: 'ONE_WAY',
      legs: [
        {
          fromAirport: 'SGN',
          toAirport: 'HAN',
          departureAt: '2026-12-28T09:00:00Z',
        },
      ],
    },
    passengers: [{ firstName: 'Smoke', lastName: 'Unassigned', nationality: 'VN' }],
    contact: {
      firstName: 'Smoke',
      lastName: 'Unassigned',
      email: session?.email || 'admin@j-ta.local',
      phone: '+84900000112',
    },
  },
});
const bookingId = booking.json?.id;
const bookingRef =
  booking.json?.bookingCode ||
  (bookingId ? `BK-${String(bookingId).padStart(6, '0')}` : null);
ok(
  'booking without offer/operator',
  (booking.status === 200 || booking.status === 201) && !!bookingId,
  `id=${bookingId} ref=${bookingRef} status=${booking.status} ${JSON.stringify(booking.json).slice(0, 120)}`,
);

await new Promise((r) => setTimeout(r, 4000));

if (bookingRef) {
  const logs = queryCampaignLogs(bookingRef);
  const keys = (logs?.hit || []).map((h) => h.key);
  const unassigned = keys.some((k) => String(k).includes('operator_unassigned'));
  const sales = keys.some((k) => String(k).includes(':sales'));
  const operator = keys.some(
    (k) => String(k).includes(':operator') && !String(k).includes('unassigned'),
  );
  ok(
    'campaign logs present',
    !!logs && logs.n > 0,
    logs ? `n=${logs.n} keys=${[...new Set(keys)].join(',')}` : 'query fail',
  );
  ok('operator_unassigned:sales key', unassigned, `keys=${keys.join('|')}`);
  ok('sales notify still sent', sales || unassigned, `keys=${keys.join('|')}`);
  ok('no mistaken operator charter mail', !operator, operator ? 'LEAK' : 'ok');
}

console.log(
  fail === 0
    ? 'RESULT W5-12C DEV_API PASS'
    : `RESULT fail=${fail}`,
);
process.exit(fail === 0 ? 0 : 1);
