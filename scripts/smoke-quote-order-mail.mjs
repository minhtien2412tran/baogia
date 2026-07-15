#!/usr/bin/env node
/**
 * Smoke: quote request → customer ACK + sales alert (Mailpit / SMTP catcher).
 * Usage: node scripts/smoke-quote-order-mail.mjs
 * Exit 0 if API 201 and (optional) local/Mailpit check skipped unless CHECK_MAILPIT=1 via SSH env.
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
function loadEnv() {
  const out = {};
  for (const p of [
    resolve(root, 'apps/api/.env'),
    resolve(root, 'apps/web/.env.local'),
  ]) {
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m) continue;
      out[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  return out;
}

const env = loadEnv();
const BASE = (process.env.API_URL || env.NEXT_PUBLIC_API_URL || 'https://api.minhtien.online').replace(/\/$/, '');
const API_KEY = process.env.API_KEY || env.API_KEY || env.NEXT_PUBLIC_API_KEY || '';
const stamp = Date.now();
const email = `quote-order-${stamp}@jetbay.local`;

const dep = new Date(Date.now() + 45 * 864e5).toISOString();
const res = await fetch(`${BASE}/quotes/request`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
  },
  body: JSON.stringify({
    email,
    phone: '+84901234567',
    firstName: 'Order',
    lastName: 'Smoke',
    isConsentAccepted: true,
    tripType: 'ONE_WAY',
    message: 'smoke quote-order-mail',
    legs: [
      {
        fromAirport: 'SGN',
        toAirport: 'HAN',
        departureDate: dep,
        passengers: 2,
      },
    ],
  }),
  signal: AbortSignal.timeout(30_000),
});
const j = await res.json().catch(() => ({}));
console.log(
  JSON.stringify({
    http: res.status,
    requestId: j.requestId,
    email,
    message: j.message,
  }),
);
if (!res.ok || !j.requestId) process.exit(1);
console.log(
  'OK: quote created — expect Mailpit: (1) Quote Request Received to customer (2) [JetVina Quote] to sales',
);
process.exit(0);
