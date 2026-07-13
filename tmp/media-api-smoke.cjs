/**
 * Local smoke: login as admin, exercise media approve/deny against real API+DB.
 * Does not print secrets. Requires API on PORT from apps/api/.env (default 4000).
 */
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '../apps/api/.env');
  const out = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

async function main() {
  const env = loadEnv();
  const base = (env.API_PUBLIC_URL || `http://127.0.0.1:${env.PORT || 4000}`).replace(/\/$/, '');
  const apiKey = env.API_KEY || '';
  const headers = {
    'Content-Type': 'application/json',
    ...(apiKey ? { 'X-API-Key': apiKey } : {}),
  };

  const login = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: 'admin@jetbay.local', password: 'Admin123!' }),
  });
  if (!login.ok) throw new Error(`login ${login.status}`);
  const loginJson = await login.json();
  const token = loginJson.tokens?.accessToken;
  if (!token) throw new Error('no accessToken');
  const auth = { ...headers, Authorization: `Bearer ${token}` };

  const list = await fetch(`${base}/admin/media-assets?rightsStatus=UNVERIFIED`, { headers: auth });
  if (list.status === 401 || list.status === 403) throw new Error(`list ${list.status}`);
  if (!list.ok) throw new Error(`list ${list.status} ${await list.text()}`);
  const { assets } = await list.json();
  const unverified = assets.find((a) => a.rightsStatus === 'UNVERIFIED');
  if (!unverified) throw new Error('missing UNVERIFIED fixture');

  const deny = await fetch(`${base}/admin/media-assets/${unverified.id}/approve-production`, {
    method: 'POST',
    headers: auth,
    body: '{}',
  });
  if (deny.status !== 403 && deny.status !== 400) {
    throw new Error(`expected reject production for UNVERIFIED, got ${deny.status}`);
  }

  const listCp = await fetch(`${base}/admin/media-assets?rightsStatus=CLIENT_PROVIDED`, {
    headers: auth,
  });
  const { assets: cps } = await listCp.json();
  const cp = cps[0];
  if (!cp) throw new Error('missing CLIENT_PROVIDED fixture');

  const stage = await fetch(`${base}/admin/media-assets/${cp.id}/approve-staging`, {
    method: 'POST',
    headers: auth,
    body: '{}',
  });
  if (!stage.ok) throw new Error(`staging ${stage.status}`);

  const prod = await fetch(`${base}/admin/media-assets/${cp.id}/approve-production`, {
    method: 'POST',
    headers: auth,
    body: '{}',
  });
  if (!prod.ok) throw new Error(`production ${prod.status}`);

  // reset production flag
  const { Client } = require('pg');
  const c = new Client({ connectionString: env.DATABASE_URL });
  await c.connect();
  await c.query(
    'UPDATE "MediaAsset" SET "approvedForPublish" = false WHERE id = $1',
    [cp.id],
  );
  await c.end();

  const noAuth = await fetch(`${base}/admin/media-assets`, { headers });
  if (noAuth.status !== 401) throw new Error(`expected 401 without JWT, got ${noAuth.status}`);

  const pub = await fetch(`${base}/content/media-assets`, { headers });
  if (!pub.ok) throw new Error(`public media ${pub.status}`);

  console.log('media-api-smoke: PASS');
}

main().catch((e) => {
  console.error('media-api-smoke: FAIL', e.message);
  process.exit(1);
});
