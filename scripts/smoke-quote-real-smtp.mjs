#!/usr/bin/env node
/**
 * W5-11 smoke: create quote → expect customer ACK + sales alert via real SMTP.
 * Uses SMOKE_MAIL_TO or SMTP_ENQUIRY_TO from apps/api/.env (never prints full address domain secrets beyond local-part mask).
 *
 * Usage: node scripts/smoke-quote-real-smtp.mjs
 */
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

function maskEmail(email) {
  const [u, d] = String(email).split('@');
  if (!d) return 'INVALID';
  const mu = u.length <= 2 ? '*' : `${u.slice(0, 2)}***`;
  return `${mu}@${d}`;
}

const env = loadEnv();
const BASE = (process.env.API_URL || 'https://api.minhtien.online').replace(/\/$/, '');
const API_KEY = process.env.API_KEY || env.API_KEY || env.NEXT_PUBLIC_API_KEY || '';
const to =
  process.env.SMOKE_MAIL_TO ||
  env.SMOKE_MAIL_TO ||
  env.SMTP_ENQUIRY_TO ||
  env.SMTP_FROM ||
  '';

if (!to || !to.includes('@')) {
  console.error('ABORT: set SMOKE_MAIL_TO or SMTP_ENQUIRY_TO');
  process.exit(1);
}

const stamp = Date.now();
const dep = new Date(Date.now() + 45 * 864e5).toISOString();

const statusRes = await fetch(`${BASE}/integrations/status`);
const status = await statusRes.json();
const gate = {
  smtp: status?.integrations?.smtp,
  catcher: status?.integrations?.smtpCatcher,
  deliverable: status?.integrations?.smtpDeliverable,
};
console.log('[smoke-real-smtp] gate', JSON.stringify(gate));
if (!gate.smtp || gate.catcher) {
  console.error('ABORT: integrations.smtp must be true and smtpCatcher false');
  process.exit(1);
}

const res = await fetch(`${BASE}/quotes/request`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
  },
  body: JSON.stringify({
    email: to,
    phone: '+84901234567',
    firstName: 'SMTP',
    lastName: `Smoke${stamp}`,
    isConsentAccepted: true,
    tripType: 'ONE_WAY',
    message: `[W5-11] real SMTP smoke ${stamp}`,
    legs: [
      {
        fromAirport: 'SGN',
        toAirport: 'HAN',
        departureDate: dep,
        passengers: 2,
      },
    ],
  }),
  signal: AbortSignal.timeout(45_000),
});
const j = await res.json().catch(() => ({}));
console.log(
  JSON.stringify({
    http: res.status,
    requestId: j.requestId,
    to: maskEmail(to),
    message: j.message,
  }),
);
if (!res.ok || !j.requestId) process.exit(1);

console.log('OK: quote created — check inbox for customer ACK + sales alert (may take 1–2 min; also spam).');
process.exit(0);
