const fs = require('fs');
function loadEnv(p) {
  if (!fs.existsSync(p)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(p, 'utf8')
      .split(/\r?\n/)
      .filter((l) => l && !l.startsWith('#') && l.includes('='))
      .map((l) => {
        const i = l.indexOf('=');
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
      }),
  );
}
const apiEnv = loadEnv('apps/api/.env');
const adminEnv = loadEnv('apps/admin/.env.local');
console.log('keys match', apiEnv.API_KEY === adminEnv.NEXT_PUBLIC_API_KEY);
fetch('http://127.0.0.1:4000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': adminEnv.NEXT_PUBLIC_API_KEY || apiEnv.API_KEY,
  },
  body: JSON.stringify({
    email: 'admin@jetbay.local',
    password: 'Admin123!',
  }),
})
  .then(async (r) => {
    const j = await r.json().catch(() => ({}));
    console.log('status', r.status);
    console.log('hasToken', Boolean(j.tokens?.accessToken));
    console.log('role', j.user?.role);
    console.log('message', j.message || j.error || '');
  })
  .catch((e) => console.error(String(e)));
