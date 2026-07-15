#!/usr/bin/env node
/**
 * Quote UI contract smoke (T-S2-03) — mirrors QuoteSearchWidget DTO:
 * search-aircraft → request with email + phone + consent + legs[].passengers
 *
 * Usage:
 *   node scripts/smoke-quote-ui.mjs
 *   API_URL=https://api.minhtien.online node scripts/smoke-quote-ui.mjs
 *
 * Exit 0 when search returns options and request returns requestId.
 * Admin proof: Quotes list should show the printed requestId (mail = optional / SMTP).
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

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

const env = {
  ...loadEnvFile(resolve(repoRoot, 'apps/api/.env')),
  ...loadEnvFile(resolve(repoRoot, 'apps/web/.env.local')),
};

const BASE = (process.env.API_URL || env.NEXT_PUBLIC_API_URL || 'https://api.minhtien.online').replace(
  /\/$/,
  '',
);
const API_KEY = process.env.API_KEY || env.API_KEY || env.NEXT_PUBLIC_API_KEY || '';

const DEPART = new Date();
DEPART.setUTCDate(DEPART.getUTCDate() + 45);
DEPART.setUTCHours(10, 0, 0, 0);
const departureDate = DEPART.toISOString();

const legs = [
  {
    fromAirport: 'SGN',
    toAirport: 'HAN',
    departureDate,
    passengers: 2,
  },
];

function headers() {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
  };
}

async function main() {
  console.log('smoke-quote-ui (T-S2-03)');
  console.log(`  BASE ${BASE}`);
  console.log(`  API_KEY len=${API_KEY.length}`);
  console.log(`  route SGN→HAN @ ${departureDate}`);

  const searchRes = await fetch(`${BASE}/quotes/search-aircraft`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      tripType: 'ONE_WAY',
      legs,
      locale: 'en',
      currency: 'USD',
    }),
  });
  const search = await searchRes.json().catch(() => ({}));
  const options = search.options ?? [];
  console.log(`  search status=${searchRes.status} options=${options.length} searchId=${search.searchId ?? '—'}`);
  if (!searchRes.ok || options.length === 0) {
    console.error('FAIL: search-aircraft');
    process.exit(1);
  }

  const selected = options[0];
  const quoteRes = await fetch(`${BASE}/quotes/request`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      firstName: 'Quote',
      lastName: 'UiProof',
      email: 'quote-ui-proof@jetbay.local',
      phone: '+84901234567',
      tripType: 'ONE_WAY',
      legs,
      isConsentAccepted: true,
      message: `Selected aircraft: ${selected.categoryLabel} (${selected.aircraftModel}) — UI contract smoke · searchId=${search.searchId}`,
    }),
  });
  const quote = await quoteRes.json().catch(() => ({}));
  const requestId = quote.requestId ?? quote.id;
  console.log(`  quote status=${quoteRes.status} requestId=${requestId} msg=${quote.message ?? ''}`);

  if (!(quoteRes.status === 200 || quoteRes.status === 201) || !requestId) {
    console.error('FAIL: quotes/request');
    process.exit(1);
  }

  console.log('PASS');
  console.log(`EVIDENCE: Admin → Quotes → #${requestId} (email quote-ui-proof@jetbay.local)`);
  console.log('UI: success banner shows quoteSuccessWithId with same requestId after deploy.');
}

main().catch((e) => {
  console.error('ERROR', e.message || e);
  process.exit(1);
});
