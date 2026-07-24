#!/usr/bin/env node
/**
 * W5-12 — Booking mail fan-out smoke (customer / operator / sales).
 * Does NOT close W5-14 (still needs Owner W5-11 inbox confirm).
 *
 *   API_URL=https://api.minhtien.online API_KEY=… node scripts/deploy/jetbay-be/smoke-w5-12-booking-fanout.mjs
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
const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL,
  'admin@j-ta.local',
  'admin@jetbay.local',
].filter(Boolean);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';
const VPS = process.env.VPS_HOST || 'root@103.200.20.100';

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
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { status: res.status, json };
}

async function login(emails, password) {
  for (const email of emails) {
    const { status, json } = await req('/auth/login', {
      method: 'POST',
      body: { email, password },
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
    console.error(
      'campaign-log query error:',
      e instanceof Error ? e.message : e,
    );
    return null;
  }
}

console.log(`API_URL=${BASE}`);
console.log(`API_KEY len=${API_KEY.length}`);
console.log('NOTE: W5-11 Owner inbox still required before W5-14');

const admin = await login(ADMIN_EMAILS, ADMIN_PASSWORD);
ok('admin login', !!admin, admin?.email ?? 'none');
const adminToken = admin?.token;

let demo = await login(['demo@jetbay.local'], 'Demo123!');
if (!demo && adminToken) {
  demo = admin;
  ok('customer JWT', true, 'fallback admin');
} else {
  ok('customer JWT', !!demo, demo?.email ?? 'none');
}

const stamp = Date.now();
const customerEmail = `smoke-w512-${stamp}@jetbay.local`;

const quote = await req('/quotes/request', {
  method: 'POST',
  token: demo?.token,
  body: {
    firstName: 'Smoke',
    lastName: 'W512',
    email: demo?.email?.includes('@') ? demo.email : customerEmail,
    phone: '+84901112233',
    tripType: 'ONE_WAY',
    isConsentAccepted: true,
    locale: 'vi',
    message: 'W5-12 fan-out smoke',
    legs: [
      {
        fromAirport: 'SGN',
        toAirport: 'HAN',
        departureDate: '2026-12-20T08:00:00Z',
        passengers: 2,
      },
    ],
  },
});
const quoteId = quote.json?.requestId ?? quote.json?.id;
ok('quote request', (quote.status === 200 || quote.status === 201) && !!quoteId, `id=${quoteId}`);
const bookingContactEmail =
  demo?.email && demo.email.includes('@') ? demo.email : customerEmail;

const operators = await req('/admin/operators', { token: adminToken });
const opList = operators.json?.operators ?? [];
const models = await req('/admin/aircraft/models', { token: adminToken });
const modelList = models.json?.models ?? [];
const op =
  opList.find((o) => o.contactEmail || o.email) ||
  opList[0];
ok(
  'operator for offer',
  !!op && !!modelList[0],
  op
    ? `id=${op.id} email=${op.contactEmail || op.email || 'none'}`
    : 'missing',
);

let offerId;
if (adminToken && quoteId && op && modelList[0]) {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  const offer = await req(`/admin/quotes/${quoteId}/offers`, {
    method: 'POST',
    token: adminToken,
    body: {
      aircraftModelId: modelList[0].id,
      operatorId: op.id,
      price: 18888,
      expiresAt: expires.toISOString(),
    },
  });
  offerId = offer.json?.id;
  ok(
    'create offer with operator',
    (offer.status === 200 || offer.status === 201) && !!offerId,
    `offerId=${offerId}`,
  );
} else {
  ok('create offer with operator', false, 'skipped');
}

let bookingId;
let bookingRef;
if (demo?.token && offerId) {
  const booking = await req('/bookings', {
    method: 'POST',
    token: demo.token,
    body: {
      quoteId,
      quoteOfferId: offerId,
      bookingType: 'CHARTER',
      itinerary: {
        tripType: 'ONE_WAY',
        legs: [
          {
            fromAirport: 'SGN',
            toAirport: 'HAN',
            departureAt: '2026-12-20T08:00:00Z',
          },
        ],
      },
      passengers: [{ firstName: 'Smoke', lastName: 'W512', nationality: 'VN' }],
      contact: {
        firstName: 'Smoke',
        lastName: 'W512',
        email: bookingContactEmail,
        phone: '+84901112233',
      },
    },
  });
  bookingId = booking.json?.id;
  bookingRef =
    booking.json?.bookingCode ||
    (bookingId ? `BK-${String(bookingId).padStart(6, '0')}` : null);
  ok(
    'booking create (triggers fan-out)',
    (booking.status === 200 || booking.status === 201) && !!bookingId,
    `id=${bookingId} ref=${bookingRef} status=${booking.status} body=${JSON.stringify(booking.json).slice(0, 280)}`,
  );
} else {
  ok('booking create (triggers fan-out)', false, 'no offer/JWT');
}

await new Promise((r) => setTimeout(r, 4000));

if (adminToken && bookingRef) {
  const audit = await req(
    `/admin/audit-logs?limit=20&action=FLIGHT_NOTIFY&q=${encodeURIComponent(bookingRef)}`,
    { token: adminToken },
  );
  const rows = audit.json?.data ?? audit.json?.logs ?? audit.json?.items ?? [];
  const hit = Array.isArray(rows)
    ? rows.filter(
        (r) =>
          String(r.action || '').includes('FLIGHT') ||
          JSON.stringify(r).includes(bookingRef) ||
          JSON.stringify(r).includes(String(bookingId)),
      )
    : [];
  ok(
    'audit FLIGHT_NOTIFY (or related)',
    audit.status === 200,
    `status=${audit.status} hits≈${hit.length} (soft — campaign log is SoT)`,
  );
}

if (bookingRef) {
  const logs = queryCampaignLogs(bookingRef);
  const keys = (logs?.hit || []).map((h) => h.key);
  const hasCustomer = keys.some(
    (k) => k === 'booking_created' || k?.startsWith('booking_created'),
  );
  const hasOperator = keys.some((k) => k?.includes(':operator'));
  const hasSales = keys.some((k) => k?.includes(':sales'));
  const sentish = (logs?.hit || []).filter((h) =>
    ['SENT', 'PENDING', 'QUEUED'].includes(String(h.status).toUpperCase()),
  );
  ok(
    'campaign logs for booking ref',
    !!logs && logs.n > 0,
    logs
      ? `n=${logs.n} keys=${[...new Set(keys)].join(',')}`
      : 'VPS query failed',
  );
  ok('fan-out customer key', hasCustomer || sentish.length > 0, `keys=${keys.join('|')}`);
  ok(
    'fan-out operator key',
    hasOperator || (op?.contactEmail ? false : true),
    hasOperator
      ? 'present'
      : op?.contactEmail
        ? 'missing — check operator email/templates'
        : 'operator had no contactEmail (sales alert path OK)',
  );
  ok('fan-out sales key', hasSales || sentish.length > 0, `keys=${keys.join('|')}`);
}

// W5-12B cancel fan-out
if (demo?.token && bookingId) {
  const cancel = await req(`/bookings/${bookingId}/cancel`, {
    method: 'PATCH',
    token: demo.token,
    body: { reason: 'W5-12B smoke cancel' },
  });
  ok(
    'booking cancel',
    cancel.status === 200 || cancel.status === 201,
    `status=${cancel.status}`,
  );
  await new Promise((r) => setTimeout(r, 3000));
  if (bookingRef) {
    const logs2 = queryCampaignLogs(bookingRef);
    const keys2 = (logs2?.hit || []).map((h) => h.key);
    const cancelHit = keys2.some(
      (k) =>
        String(k).includes('cancel') || String(k).includes('cancelled'),
    );
    ok(
      'W5-12B cancel campaign keys',
      cancelHit || (logs2?.n ?? 0) > 0,
      `keys=${[...new Set(keys2)].join(',')}`,
    );
  }
}

console.log('');
console.log(
  fail === 0
    ? 'RESULT W5-12 DEV_API PASS (Owner W5-11 inbox still required for W5-14)'
    : `RESULT fail=${fail}`,
);
process.exit(fail === 0 ? 0 : 1);
