#!/usr/bin/env node
/**
 * Smoke CR Wave 3–5: RBAC, airport scope, operator contract, mock DocuSign
 * Usage: API_URL=http://127.0.0.1:4000 node scripts/deploy/jetbay-be/smoke-cr-wave3.mjs
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
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  return { status: res.status, json, text };
}

async function login(email, password) {
  const { status, json } = await req('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (status !== 200 && status !== 201) {
    throw new Error(`login ${email} → ${status} ${JSON.stringify(json)}`);
  }
  const token =
    json?.accessToken ||
    json?.access_token ||
    json?.tokens?.accessToken ||
    json?.data?.accessToken;
  if (!token) throw new Error(`no token for ${email}: ${JSON.stringify(json)}`);
  return token;
}

async function main() {
  await check('health', async () => {
    const { status } = await req('/health');
    if (status !== 200) throw new Error(`status ${status}`);
  });

  const adminToken = await login('admin@jetbay.local', 'Admin123!');
  const staffToken = await login('staff-asia@jetbay.local', 'Staff123!');

  let staffUserId;
  await check('admin list users finds staff', async () => {
    const { status, json } = await req('/admin/users?limit=50', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (status !== 200) throw new Error(`status ${status}`);
    const rows = json?.data || json?.users || json || [];
    const list = Array.isArray(rows) ? rows : rows.data || [];
    const staff = list.find((u) => u.email === 'staff-asia@jetbay.local');
    if (!staff) throw new Error('staff-asia not found');
    staffUserId = staff.id;
  });

  await check('airport scope CONTINENT=AS on staff', async () => {
    const { status, json } = await req(`/admin/users/${staffUserId}/airport-scope`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (status !== 200) throw new Error(`status ${status}`);
    if (json.scopeType !== 'CONTINENT' || !json.continentCodes?.includes('AS')) {
      throw new Error(`unexpected scope ${JSON.stringify(json)}`);
    }
  });

  await check('CANCEL_BOOKING DENY → 403', async () => {
    const demoToken = await login('demo@jetbay.local', 'Demo123!');
    const users = await req('/admin/users?limit=50', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const demo = (users.json?.data || []).find((u) => u.email === 'demo@jetbay.local');
    if (!demo?.id) throw new Error('demo user missing');

    await req(`/admin/users/${demo.id}/permissions`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        items: [{ permissionKey: 'CANCEL_BOOKING', effect: 'DENY' }],
      }),
    });

    const created = await req('/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${demoToken}` },
      body: JSON.stringify({
        bookingType: 'CHARTER',
        itinerary: {
          tripType: 'ONE_WAY',
          legs: [
            { fromAirport: 'SGN', toAirport: 'HAN', departureAt: '2026-12-15T10:00:00Z' },
          ],
        },
        passengers: [{ firstName: 'Deny', lastName: 'Test', nationality: 'VN' }],
        contact: {
          firstName: 'Deny',
          lastName: 'Test',
          email: 'deny-cancel@jetbay.local',
          phone: '+84900000111',
        },
      }),
    });
    if (created.status !== 200 && created.status !== 201) {
      throw new Error(`booking create ${created.status} ${JSON.stringify(created.json)}`);
    }
    const bookingId = created.json.id;
    const cancel = await req(`/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${demoToken}` },
      body: '{}',
    });
    if (cancel.status !== 403) {
      throw new Error(`expected 403 got ${cancel.status} ${JSON.stringify(cancel.json)}`);
    }

    // restore default
    await req(`/admin/users/${demo.id}/permissions`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        items: [{ permissionKey: 'CANCEL_BOOKING', effect: 'INHERIT' }],
      }),
    });
  });

  await check('empty-leg anonymous has rows', async () => {
    const { status, json } = await req('/empty-legs');
    if (status !== 200) throw new Error(`status ${status}`);
    const n = (json.emptyLegs || json || []).length;
    if (n < 1) throw new Error('expected some empty legs anonymously');
  });

  await check('empty-leg staff JWT scoped to AS', async () => {
    const { status, json } = await req('/empty-legs', {
      headers: { Authorization: `Bearer ${staffToken}` },
    });
    if (status !== 200) throw new Error(`status ${status}`);
    const legs = json.emptyLegs || [];
    for (const leg of legs) {
      const fc = leg.fromAirport?.continentCode;
      const tc = leg.toAirport?.continentCode;
      if (fc && fc !== 'AS') throw new Error(`from continent ${fc}`);
      if (tc && tc !== 'AS') throw new Error(`to continent ${tc}`);
    }
  });

  let aircraftId;
  await check('list fleet for contract', async () => {
    const { status, json } = await req('/admin/fleet', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (status !== 200) throw new Error(`status ${status}`);
    const rows = json?.aircraft || json?.data || json || [];
    const list = Array.isArray(rows) ? rows : [];
    const ac = list.find((a) => a.registration === 'VN-JB01') || list[0];
    if (!ac?.id) throw new Error(`no aircraft ${JSON.stringify(json)}`);
    aircraftId = ac.id;
  });

  // Clean any open contract on this aircraft (void)
  await check('void prior open contracts if any', async () => {
    const { json } = await req(`/admin/operator-contracts?aircraftId=${aircraftId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const rows = json?.data || [];
    for (const c of rows) {
      if (['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SENT'].includes(c.status)) {
        await req(`/admin/operator-contracts/${c.id}/void`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
          body: '{}',
        });
      }
    }
  });

  let contractId;
  await check('create → submit → approve contract', async () => {
    const created = await req('/admin/operator-contracts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ aircraftId, templateCode: 'OPS_STANDARD_V1' }),
    });
    if (created.status !== 201 && created.status !== 200) {
      throw new Error(`create ${created.status} ${JSON.stringify(created.json)}`);
    }
    contractId = created.json.id;
    const sub = await req(`/admin/operator-contracts/${contractId}/submit`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: '{}',
    });
    if (sub.status !== 201 && sub.status !== 200) throw new Error(`submit ${sub.status}`);
    const ap = await req(`/admin/operator-contracts/${contractId}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: '{}',
    });
    if (ap.status !== 201 && ap.status !== 200) {
      throw new Error(`approve ${ap.status} ${JSON.stringify(ap.json)}`);
    }
    if (ap.json.status !== 'APPROVED') throw new Error(`status ${ap.json.status}`);
  });

  let envelopeId;
  await check('DocuSign send mock', async () => {
    const { status, json } = await req(`/admin/operator-contracts/${contractId}/docusign/send`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        recipients: [{ email: 'ops@example.com', name: 'Ops' }],
      }),
    });
    if (status !== 201 && status !== 200) {
      throw new Error(`send ${status} ${JSON.stringify(json)}`);
    }
    envelopeId = json.envelope?.externalEnvelopeId;
    if (!envelopeId) throw new Error(`no envelope ${JSON.stringify(json)}`);
  });

  await check('DocuSign webhook COMPLETED idempotent', async () => {
    const eventId = `smoke-${Date.now()}`;
    const body = JSON.stringify({
      eventId,
      envelopeId,
      event: 'envelope-completed',
      status: 'COMPLETED',
    });
    const r1 = await req('/webhooks/docusign', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    });
    if (r1.status !== 200) throw new Error(`webhook1 ${r1.status} ${r1.text}`);
    const r2 = await req('/webhooks/docusign', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    });
    if (r2.status !== 200 || !r2.json?.duplicate) {
      throw new Error(`expected duplicate ${JSON.stringify(r2.json)}`);
    }
    const st = await req(`/admin/operator-contracts/${contractId}/docusign`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const env = st.json?.envelopes?.[0];
    if (env?.status !== 'COMPLETED') throw new Error(`envelope ${JSON.stringify(env)}`);
    if (!env.certificateUrl) throw new Error('missing CoC url');
  });

  console.log(`\npass=${pass} fail=${fail}`);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
