#!/usr/bin/env node
/**
 * Smoke CR Wave 1–2: empty-leg continent filter + pricing estimate (positioning)
 * Usage: API_URL=http://127.0.0.1:4000 node scripts/deploy/jetbay-be/smoke-cr-wave1.mjs
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const API_URL = process.env.API_URL || 'http://127.0.0.1:4000';
const envFile = process.env.ENV_FILE || resolve(root, 'apps/api/.env');
const API_KEY =
  process.env.API_KEY ||
  readFileSync(envFile, 'utf8')
    .split(/\r?\n/)
    .find((l) => l.startsWith('API_KEY='))
    ?.split('=', 2)[1]
    ?.replace(/^["']|["']$/g, '')
    ?.trim();

if (!API_KEY) {
  console.error('API_KEY missing');
  process.exit(1);
}

let pass = 0;
let fail = 0;

async function check(name, fn) {
  try {
    await fn();
    console.log('OK ', name);
    pass++;
  } catch (e) {
    console.log('FAIL', name, e.message || e);
    fail++;
  }
}

async function req(path, opts = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers: {
      'X-API-Key': API_KEY,
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
      ...opts.headers,
    },
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  return { status: res.status, json };
}

console.log('=== CR wave1 smoke', API_URL, '===');

await check('empty-legs fromContinent=AS → 200', async () => {
  const { status, json } = await req('/empty-legs?fromContinent=AS');
  if (status !== 200) throw new Error(`status ${status}`);
  if (!Array.isArray(json.emptyLegs)) throw new Error('missing emptyLegs');
});

await check('airports/:id/fees → 200', async () => {
  const list = await req('/airports?limit=5');
  const id = list.json?.data?.[0]?.id;
  if (!id) throw new Error('no airport id');
  const { status } = await req(`/airports/${id}/fees`);
  if (status !== 200) throw new Error(`status ${status}`);
});

await check('pricing/estimate with positioning (aircraft at CAN)', async () => {
  // Prefer fleet parked away from pickup (seed VN-JB01 at CAN)
  const fleetProbe = await req('/airports?limit=100');
  const can = (fleetProbe.json?.data || []).find((a) => a.iata === 'CAN');
  let aircraftId;
  if (can?.id) {
    const avail = await req(`/airports/${can.id}/available-aircraft`);
    aircraftId = avail.json?.aircraft?.[0]?.id;
  }
  const { status, json } = await req('/pricing/estimate', {
    method: 'POST',
    body: JSON.stringify({
      pickupAirport: 'HAN',
      dropoffAirport: 'SGN',
      departureAt: '2026-09-01T08:00:00Z',
      passengers: 2,
      ...(aircraftId ? { aircraftId } : {}),
    }),
  });
  if (status !== 200 && status !== 201) {
    throw new Error(`status ${status} ${JSON.stringify(json)}`);
  }
  if (!json.disclaimer?.toLowerCase().includes('estimate')) {
    throw new Error('missing estimate disclaimer');
  }
  if (!aircraftId) {
    // Fallback: still require passenger leg + price
    if (!(json.estimatedPrice > 0)) throw new Error('estimatedPrice missing');
    return;
  }
  if (!json.positioningRequired) {
    throw new Error('expected positioningRequired=true for aircraft at CAN');
  }
  const pos = (json.legs || []).filter((l) => l.legType === 'POSITIONING');
  const pax = (json.legs || []).filter((l) => l.legType === 'PASSENGER');
  if (pos.length < 1 || pax.length < 1) {
    throw new Error(`legs=${JSON.stringify((json.legs || []).map((l) => l.legType))}`);
  }
  if (!(json.estimatedPrice > 0)) throw new Error('estimatedPrice missing');
});

await check('admin/fleet list (needs JWT skipped — public key only probe health)', async () => {
  const { status } = await req('/health');
  if (status !== 200) throw new Error(`health ${status}`);
});

console.log(`=== RESULT pass=${pass} fail=${fail} ===`);
process.exit(fail === 0 ? 0 : 1);
