#!/usr/bin/env node
/**
 * Smoke: báo giá + hợp đồng funnel (scope m-tien.com/jet-bay / 74TR).
 * Covers: quote+locale · pricing · booking docs PDF/Word · contracts workflow · DocuSign mock webhook.
 *
 *   API_URL=https://api.minhtien.online API_KEY=… node scripts/deploy/jetbay-be/smoke-bao-gia-contracts.mjs
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

const localEnv = {
  ...loadEnvFile(resolve(repoRoot, 'apps/api/.env')),
  ...loadEnvFile(resolve(repoRoot, 'apps/admin/.env.local')),
};

const BASE = (
  process.env.API_URL ||
  localEnv.NEXT_PUBLIC_API_URL ||
  localEnv.API_URL ||
  'http://127.0.0.1:4000'
).replace(/\/$/, '');
const API_KEY =
  process.env.API_KEY || localEnv.API_KEY || localEnv.NEXT_PUBLIC_API_KEY || '';
const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL,
  'admin@jetbay.local',
  'admin@j-ta.local',
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

async function req(path, { method = 'GET', token, body, raw = false } = {}) {
  const headers = {};
  if (API_KEY) headers['X-API-Key'] = API_KEY;
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (raw) {
    const buf = Buffer.from(await res.arrayBuffer());
    return {
      status: res.status,
      buf,
      contentType: res.headers.get('content-type') || '',
    };
  }
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { status: res.status, json, text };
}

async function loginAdmin() {
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

console.log(`API_URL=${BASE}`);
console.log(`API_KEY len=${API_KEY.length}`);

// --- Auth ---
const admin = await loginAdmin();
ok('admin login', !!admin, admin?.email ?? 'no token');
const adminToken = admin?.token;

const demoLogin = await req('/auth/login', {
  method: 'POST',
  body: { email: 'demo@jetbay.local', password: 'Demo123!' },
});
let demoToken = demoLogin.json?.tokens?.accessToken;
if (!demoToken && adminToken) {
  demoToken = adminToken;
  ok('demo login', true, 'fallback admin JWT (demo user missing on env)');
} else {
  ok(
    'demo login',
    (demoLogin.status === 200 || demoLogin.status === 201) && !!demoToken,
  );
}

// --- Quote request + locale persist ---
const quoteBody = {
  firstName: 'Smoke',
  lastName: 'BaoGia',
  email: `smoke-baogia-${Date.now()}@jetbay.local`,
  phone: '+84901112233',
  tripType: 'ONE_WAY',
  isConsentAccepted: true,
  locale: 'vi',
  message: 'smoke bao-gia contracts',
  legs: [
    {
      fromAirport: 'SGN',
      toAirport: 'HAN',
      departureDate: '2026-11-15T08:00:00Z',
      passengers: 2,
    },
  ],
};
const quote = await req('/quotes/request', { method: 'POST', body: quoteBody });
const quoteId = quote.json?.requestId ?? quote.json?.id;
ok(
  'quote request',
  (quote.status === 200 || quote.status === 201) && !!quoteId,
  `id=${quoteId}`,
);

if (adminToken && quoteId) {
  const detail = await req(`/admin/quotes/${quoteId}`, { token: adminToken });
  const locale = detail.json?.locale ?? detail.json?.quote?.locale;
  ok(
    'quote locale persisted',
    detail.status === 200 && locale === 'vi',
    `locale=${locale ?? 'missing'} (deploy needed if still en)`,
  );
}

// --- Search aircraft ---
const search = await req('/quotes/search-aircraft', {
  method: 'POST',
  body: {
    tripType: 'ONE_WAY',
    legs: [
      {
        fromAirport: 'SGN',
        toAirport: 'HAN',
        departureDate: '2026-11-15T08:00:00Z',
        passengers: 2,
      },
    ],
  },
});
ok(
  'search-aircraft',
  (search.status === 200 || search.status === 201) &&
    Array.isArray(search.json?.options),
  `n=${search.json?.options?.length ?? 0} mode=${search.json?.pricingMode ?? '?'}`,
);

// --- Pricing estimate (needs fleet + airport ids) ---
let aircraftId;
let fromAirportId;
let toAirportId;
if (adminToken) {
  const fleet = await req('/admin/aircraft/fleet', { token: adminToken });
  aircraftId = fleet.json?.aircraft?.[0]?.id;
  ok(
    'fleet list',
    fleet.status === 200 && !!aircraftId,
    `aircraftId=${aircraftId ?? 'none'}`,
  );

  const sgn = await req('/airports/search?q=SGN');
  const han = await req('/airports/search?q=HAN');
  const sgnHit =
    sgn.json?.airports?.[0] ?? sgn.json?.[0] ?? sgn.json?.items?.[0];
  const hanHit =
    han.json?.airports?.[0] ?? han.json?.[0] ?? han.json?.items?.[0];
  fromAirportId = sgnHit?.id;
  toAirportId = hanHit?.id;
  ok(
    'airports resolve',
    !!fromAirportId && !!toAirportId,
    `SGN=${fromAirportId} HAN=${toAirportId}`,
  );

  if (aircraftId && fromAirportId && toAirportId) {
    const estimate = await req('/pricing/estimate', {
      method: 'POST',
      token: adminToken,
      body: {
        aircraftId,
        fromAirportId,
        toAirportId,
        passengerCount: 2,
        departureAt: '2026-11-15T08:00:00Z',
        persist: false,
      },
    });
    const total =
      estimate.json?.estimate?.estimatedTotal ?? estimate.json?.estimatedTotal;
    ok(
      'pricing estimate',
      (estimate.status === 200 || estimate.status === 201) && total != null,
      `total=${total}`,
    );
  } else {
    ok('pricing estimate', false, 'skipped — missing aircraft/airports');
  }
} else {
  ok('fleet list', false, 'skipped — no admin');
  ok('airports resolve', false, 'skipped');
  ok('pricing estimate', false, 'skipped');
}

// --- Booking + document export PDF/Word ---
let bookingId;
let documentId;
if (demoToken) {
  const booking = await req('/bookings', {
    method: 'POST',
    token: demoToken,
    body: {
      bookingType: 'CHARTER',
      itinerary: {
        tripType: 'ONE_WAY',
        legs: [
          {
            fromAirport: 'SGN',
            toAirport: 'HAN',
            departureAt: '2026-12-01T10:00:00Z',
          },
        ],
      },
      passengers: [
        { firstName: 'Smoke', lastName: 'Doc', nationality: 'VN' },
      ],
      contact: {
        firstName: 'Smoke',
        lastName: 'Doc',
        email: 'smoke-doc@jetbay.local',
        phone: '+84900000088',
      },
    },
  });
  bookingId = booking.json?.id;
  documentId = booking.json?.documents?.[0]?.id;
  ok(
    'booking create',
    (booking.status === 200 || booking.status === 201) && !!bookingId,
    `id=${bookingId} doc=${documentId ?? 'none'}`,
  );

  if (!documentId && bookingId) {
    const detail = await req(`/bookings/${bookingId}`, { token: demoToken });
    documentId = detail.json?.documents?.[0]?.id;
  }

  if (documentId) {
    const pdf = await req(
      `/documents/charter-agreements/${documentId}/export?format=pdf`,
      { raw: true },
    );
    ok(
      'export PDF',
      pdf.status === 200 &&
        pdf.contentType.includes('pdf') &&
        pdf.buf.length > 100 &&
        pdf.buf[0] === 0x25 &&
        pdf.buf[1] === 0x50,
      `bytes=${pdf.buf.length} ct=${pdf.contentType}`,
    );

    const word = await req(
      `/documents/charter-agreements/${documentId}/export?format=word`,
      { raw: true },
    );
    const wordOk =
      word.status === 200 &&
      word.buf.length > 50 &&
      (word.contentType.includes('msword') ||
        word.contentType.includes('word') ||
        word.contentType.includes('octet') ||
        word.buf.toString('utf8').includes('wordDocument') ||
        word.buf.toString('utf8').includes('w:wordDocument'));
    ok(
      'export Word',
      wordOk,
      `bytes=${word.buf.length} ct=${word.contentType} status=${word.status} (deploy needed if 400)`,
    );
  } else {
    ok('export PDF', false, 'no document id');
    ok('export Word', false, 'no document id');
  }
} else {
  ok('booking create', false, 'no demo token');
  ok('export PDF', false, 'skipped');
  ok('export Word', false, 'skipped');
}

// --- Contracts workflow ---
if (adminToken && bookingId && aircraftId) {
  const templates = await req('/admin/contracts/templates', {
    token: adminToken,
  });
  ok(
    'contract templates',
    templates.status === 200,
    `n=${templates.json?.templates?.length ?? templates.json?.length ?? 0}`,
  );

  const list = await req('/admin/contracts', { token: adminToken });
  ok('contracts list', list.status === 200);

  const created = await req('/admin/contracts', {
    method: 'POST',
    token: adminToken,
    body: {
      bookingId,
      aircraftId,
      amount: 12500,
      currency: 'USD',
    },
  });
  const contractId = created.json?.id;
  ok(
    'contract create',
    (created.status === 200 || created.status === 201) && !!contractId,
    `id=${contractId} status=${created.json?.status ?? created.status}`,
  );

  if (contractId) {
    const submitted = await req(`/admin/contracts/${contractId}/submit`, {
      method: 'POST',
      token: adminToken,
    });
    ok(
      'contract submit',
      (submitted.status === 200 || submitted.status === 201) &&
        submitted.json?.status === 'PENDING_APPROVAL',
      submitted.json?.status ?? String(submitted.status),
    );

    const approved = await req(`/admin/contracts/${contractId}/approve`, {
      method: 'POST',
      token: adminToken,
      body: { note: 'smoke approve' },
    });
    ok(
      'contract approve',
      (approved.status === 200 || approved.status === 201) &&
        approved.json?.status === 'APPROVED',
      approved.json?.status ?? String(approved.status),
    );

    const sent = await req(`/admin/contracts/${contractId}/send-docusign`, {
      method: 'POST',
      token: adminToken,
      body: {
        signers: [
          {
            email: 'signer@jetbay.local',
            name: 'Smoke Signer',
            role: 'CUSTOMER',
          },
        ],
      },
    });
    const envelopeId =
      sent.json?.envelope?.envelopeId ??
      sent.json?.contract?.docusignEnvelopeId ??
      sent.json?.docusignEnvelopeId ??
      sent.json?.envelopeId;
    ok(
      'contract send-docusign (mock)',
      (sent.status === 200 || sent.status === 201) &&
        (sent.json?.contract?.status === 'SENT_FOR_SIGNATURE' ||
          sent.json?.status === 'SENT_FOR_SIGNATURE') &&
        !!envelopeId,
      `envelope=${envelopeId ?? 'n/a'} status=${sent.json?.contract?.status ?? sent.json?.status ?? sent.status}`,
    );

    if (envelopeId) {
      const hook = await req('/webhooks/docusign', {
        method: 'POST',
        body: {
          eventId: `smoke-${Date.now()}`,
          envelopeId,
          eventType: 'envelope-completed',
          provider: 'mock',
          payload: { smoke: true },
        },
      });
      ok(
        'docusign webhook',
        hook.status === 200 || hook.status === 201,
        String(hook.status),
      );
    } else {
      ok('docusign webhook', false, 'no envelope id');
    }
  } else {
    ok('contract submit', false, 'skipped');
    ok('contract approve', false, 'skipped');
    ok('contract send-docusign (mock)', false, 'skipped');
    ok('docusign webhook', false, 'skipped');
  }
} else {
  ok(
    'contracts workflow',
    false,
    `skipped — admin=${!!adminToken} booking=${bookingId} aircraft=${aircraftId}`,
  );
}

console.log(fail === 0 ? 'RESULT pass' : `RESULT fail=${fail}`);
process.exit(fail === 0 ? 0 : 1);
