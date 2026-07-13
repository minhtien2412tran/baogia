import fs from 'fs';
import crypto from 'crypto';

function keyFrom(file, re) {
  try {
    const t = fs.readFileSync(file, 'utf8');
    const m = t.match(re);
    return m ? m[1].replace(/["']/g, '').trim() : '';
  } catch {
    return '';
  }
}

function fp(s) {
  return s ? crypto.createHash('sha256').update(s).digest('hex').slice(0, 12) : '(missing)';
}

const web = keyFrom('apps/web/.env.local', /NEXT_PUBLIC_API_KEY=(.+)/);
const adm = keyFrom('apps/admin/.env.local', /NEXT_PUBLIC_API_KEY=(.+)/);
const api = keyFrom('apps/api/.env', /^API_KEY=(.+)/m);

console.log('web key fp', fp(web), 'len', web.length);
console.log('admin key fp', fp(adm), 'len', adm.length);
console.log('local api key fp', fp(api), 'len', api.length);
console.log('web==admin', web === adm);
console.log('web==localApi', web === api);

async function check(name, url, headers = {}) {
  try {
    const res = await fetch(url, { headers, redirect: 'follow' });
    console.log(name, res.status);
  } catch (e) {
    console.log(name, 'FAIL', e.message);
  }
}

await check('health', 'https://api.minhtien.online/health');
await check('brand', 'https://api.minhtien.online/content/brand', { 'X-API-Key': web });
await check('airports', 'https://api.minhtien.online/airports/continents', { 'X-API-Key': web });
await check('admin', 'https://admin.minhtien.online/login');
await check('web_prod', 'https://www.minhtien.online/en-us');
await check('swagger', 'https://docs.minhtien.online/swagger');
