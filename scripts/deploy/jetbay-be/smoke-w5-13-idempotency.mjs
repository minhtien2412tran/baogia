#!/usr/bin/env node
/**
 * W5-13 — Booking notify idempotency (SENT skip).
 *
 * Flow:
 *  1) Create booking → wait created mails
 *  2) PATCH status confirmed → wait SENT for *:CONFIRMED:confirmed
 *  3) PATCH confirmed again → same campaign keys must NOT grow (idempotent_skip)
 *
 *   API_URL=https://api.minhtien.online node scripts/deploy/jetbay-be/smoke-w5-13-idempotency.mjs
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

function fingerprint(logs) {
  const hit = logs?.hit || [];
  const confirmed = hit.filter((h) =>
    String(h.key || '').includes('booking_confirmed'),
  );
  const ids = confirmed
    .map((h) => h.id)
    .sort((a, b) => a - b)
    .join(',');
  const sentAts = confirmed
    .map((h) => h.sentAt || '')
    .sort()
    .join(',');
  const allSent =
    confirmed.length > 0 && confirmed.every((h) => h.status === 'SENT');
  return {
    n: hit.length,
    confirmedN: confirmed.length,
    confirmedIds: ids,
    confirmedSentAts: sentAts,
    allSent,
    confirmedKeys: confirmed.map((h) => `${h.key}:${h.status}`).join('|'),
  };
}

async function waitConfirmedSent(bookingRef, { tries = 8, delayMs = 2500 } = {}) {
  let last = null;
  for (let i = 0; i < tries; i++) {
    await new Promise((r) => setTimeout(r, delayMs));
    last = queryCampaignLogs(bookingRef);
    const fp = fingerprint(last);
    if (fp.allSent) return { logs: last, fp };
    console.log(`… wait SENT try=${i + 1} keys=${fp.confirmedKeys || 'none'}`);
  }
  return { logs: last, fp: fingerprint(last) };
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
          departureAt: '2026-12-30T09:00:00Z',
        },
      ],
    },
    passengers: [{ firstName: 'Smoke', lastName: 'Idem', nationality: 'VN' }],
    contact: {
      firstName: 'Smoke',
      lastName: 'Idem',
      email: session?.email || 'admin@j-ta.local',
      phone: '+84900000113',
    },
  },
});
const bookingId = booking.json?.id;
const bookingRef =
  booking.json?.bookingCode ||
  (bookingId ? `BK-${String(bookingId).padStart(6, '0')}` : null);
ok(
  'booking create',
  (booking.status === 200 || booking.status === 201) && !!bookingId,
  `id=${bookingId} ref=${bookingRef}`,
);

await new Promise((r) => setTimeout(r, 2000));

const patch1 = await req(`/admin/bookings/${bookingId}/status`, {
  method: 'PATCH',
  token: session?.token,
  body: { status: 'confirmed' },
});
ok(
  'status → confirmed (1st)',
  patch1.status === 200 || patch1.status === 201,
  `http=${patch1.status}`,
);

const waited1 = await waitConfirmedSent(bookingRef);
const fp1 = waited1.fp;
ok(
  'confirmed campaign logs SENT after 1st notify',
  fp1.allSent && fp1.confirmedN > 0,
  fp1.confirmedKeys || 'none',
);

const patch2 = await req(`/admin/bookings/${bookingId}/status`, {
  method: 'PATCH',
  token: session?.token,
  body: { status: 'confirmed' },
});
ok(
  'status → confirmed (2nd / re-notify)',
  patch2.status === 200 || patch2.status === 201,
  `http=${patch2.status}`,
);
await new Promise((r) => setTimeout(r, 4000));

const after2 = queryCampaignLogs(bookingRef);
const fp2 = fingerprint(after2);
ok(
  'idempotent: confirmed log count unchanged',
  fp2.confirmedN === fp1.confirmedN && fp1.confirmedN > 0,
  `before=${fp1.confirmedN} after=${fp2.confirmedN}`,
);
ok(
  'idempotent: same EmailCampaignLog ids',
  fp2.confirmedIds === fp1.confirmedIds && !!fp1.confirmedIds,
  `ids=${fp2.confirmedIds}`,
);
ok(
  'idempotent: sentAt unchanged (no re-send)',
  fp2.confirmedSentAts === fp1.confirmedSentAts && !!fp1.confirmedSentAts,
  `sentAt=${fp2.confirmedSentAts}`,
);
ok(
  'still SENT after 2nd notify',
  fp2.allSent,
  fp2.confirmedKeys || 'none',
);

console.log(
  fail === 0
    ? 'RESULT W5-13 DEV_API PASS'
    : `RESULT fail=${fail}`,
);
process.exit(fail === 0 ? 0 : 1);
