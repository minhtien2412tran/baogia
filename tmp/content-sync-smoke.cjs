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
  const headers = {
    'Content-Type': 'application/json',
    ...(env.API_KEY ? { 'X-API-Key': env.API_KEY } : {}),
  };
  const login = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: 'admin@jetbay.local', password: 'Admin123!' }),
  });
  if (!login.ok) throw new Error(`login ${login.status}`);
  const { tokens } = await login.json();
  const auth = { ...headers, Authorization: `Bearer ${tokens.accessToken}` };

  const seed = await fetch(`${base}/admin/content-sources/seed-jetvina-reference`, {
    method: 'POST',
    headers: auth,
    body: '{}',
  });
  console.log('seedSource', seed.status);

  const sourcesRes = await fetch(`${base}/admin/content-sources`, { headers: auth });
  const sourcesJson = await sourcesRes.json();
  const id = sourcesJson.sources?.[0]?.id;
  if (!id) throw new Error('no content source');

  const test = await fetch(`${base}/admin/content-sources/${id}/test-connection`, {
    method: 'POST',
    headers: auth,
    body: '{}',
  });
  const testJson = await test.json().catch(() => ({}));
  console.log('testConnection', test.status, testJson.ok ?? testJson.message ?? '');

  const disc = await fetch(`${base}/admin/content-sync/discover`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ sourceId: id, dryRun: true }),
  });
  const discJson = await disc.json().catch(() => ({}));
  console.log('discover', disc.status, discJson.job?.id ?? discJson.id ?? '');

  console.log('content-sync-smoke: PASS');
}

main().catch((e) => {
  console.error('content-sync-smoke: FAIL', e.message);
  process.exit(1);
});
