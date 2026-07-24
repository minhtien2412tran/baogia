#!/usr/bin/env node
/** W5-12 contact-style quote smoke (message prefix [Website Contact]). */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
function loadEnv() {
  const out = {};
  for (const p of [resolve(root, 'apps/api/.env'), resolve(root, 'apps/web/.env.local')]) {
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m) continue;
      out[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
    }
  }
  return out;
}

const env = loadEnv();
const API_KEY = env.API_KEY || env.NEXT_PUBLIC_API_KEY || '';
const to = process.env.SMOKE_MAIL_TO || env.SMTP_ENQUIRY_TO || env.SMTP_FROM;
const stamp = Date.now();
const res = await fetch('https://api.minhtien.online/quotes/request', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
  },
  body: JSON.stringify({
    email: to,
    phone: '+84901112233',
    firstName: 'Contact',
    lastName: `Smoke${stamp}`,
    isConsentAccepted: true,
    tripType: 'ONE_WAY',
    message: `[Website Contact] W5-12 contact smoke ${stamp}`,
    legs: [
      {
        fromAirport: 'SGN',
        toAirport: 'DAD',
        departureDate: new Date(Date.now() + 60 * 864e5).toISOString(),
        passengers: 1,
      },
    ],
  }),
  signal: AbortSignal.timeout(45_000),
});
const j = await res.json().catch(() => ({}));
console.log(JSON.stringify({ http: res.status, requestId: j.requestId, kind: 'contact' }));
process.exit(res.ok && j.requestId ? 0 : 1);
