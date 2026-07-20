#!/usr/bin/env node
/**
 * Smoke: JWT login, refresh, booking create + list.
 * Usage:
 *   node scripts/deploy/jetbay-be/smoke-auth-booking.mjs
 *   API_URL=https://api.minhtien.online node scripts/deploy/jetbay-be/smoke-auth-booking.mjs
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

const localEnv = loadEnvFile(resolve(repoRoot, 'apps/api/.env'));
const BASE = (process.env.API_URL || localEnv.API_URL || 'http://127.0.0.1:4000').replace(/\/$/, '');
const API_KEY = process.env.API_KEY || localEnv.API_KEY || '';

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
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

async function loginWithFallback() {
  const candidates = [
    ['demo@jetbay.local', 'Demo123!'],
    ['admin@jetbay.local', process.env.ADMIN_PASSWORD || 'Admin123!'],
    ['admin@j-ta.local', process.env.ADMIN_PASSWORD || 'Admin123!'],
  ];
  for (let attempt = 0; attempt < 3; attempt++) {
    for (const [email, password] of candidates) {
      const login = await req('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      if (login.status === 429) {
        await new Promise((r) => setTimeout(r, 15000 * (attempt + 1)));
        continue;
      }
      const access = login.json?.tokens?.accessToken;
      const refresh = login.json?.tokens?.refreshToken;
      if (access) {
        return {
          email,
          access,
          refresh,
          viaDemo: email.startsWith('demo@'),
        };
      }
    }
  }
  return null;
}

console.log(`API_URL=${BASE}`);
console.log(`API_KEY len=${API_KEY.length}`);

const session = await loginWithFallback();
ok(
  'demo login',
  !!session?.access,
  session
    ? session.viaDemo
      ? ''
      : `fallback ${session.email}`
    : 'no token (check throttle)',
);
let access = session?.access;
let refresh = session?.refresh;

const refreshed = await req('/auth/refresh', {
  method: 'POST',
  body: { refreshToken: refresh },
});
ok(
  'refresh token',
  (refreshed.status === 200 || refreshed.status === 201) &&
    !!refreshed.json?.accessToken,
  refreshed.status === 429 ? 'rate-limited' : '',
);
if (refreshed.json?.accessToken) access = refreshed.json.accessToken;

const booking = await req('/bookings', {
  method: 'POST',
  token: access,
  body: {
    bookingType: 'CHARTER',
    itinerary: {
      tripType: 'ONE_WAY',
      legs: [{ fromAirport: 'SGN', toAirport: 'HAN', departureAt: '2026-12-01T10:00:00Z' }],
    },
    passengers: [{ firstName: 'Smoke', lastName: 'Test', nationality: 'VN' }],
    contact: {
      firstName: 'Smoke',
      lastName: 'Test',
      email: 'smoke-booking@jetbay.local',
      phone: '+84900000099',
    },
  },
});
ok(
  'booking create',
  booking.status === 201 || booking.status === 200,
  `id=${booking.json?.id ?? JSON.stringify(booking.json?.message ?? booking.json).slice(0, 80)}`,
);

const myBookings = await req('/bookings/my', { token: access });
const count = myBookings.json?.bookings?.length ?? myBookings.json?.length ?? 0;
ok('bookings my', myBookings.status === 200 && count >= 1, `n=${count}`);

console.log(fail === 0 ? 'RESULT pass' : `RESULT fail=${fail}`);
process.exit(fail === 0 ? 0 : 1);
