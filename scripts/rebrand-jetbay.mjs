/**
 * One-shot rebrand J-TA → JetBay / @jetbay.local (safe strings only).
 * Usage: node scripts/rebrand-jetbay.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const roots = ['apps', 'packages', 'scripts', 'docs', 'tests', '.github'];
const exts = new Set(['.ts', '.tsx', '.js', '.mjs', '.md', '.yml', '.yaml', '.sh', '.json', '.html', '.mdc']);
const skipDir = new Set(['node_modules', '.next', 'dist', 'coverage']);

function walk(dir, out = []) {
  let names;
  try {
    names = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of names) {
    if (skipDir.has(name)) continue;
    const p = join(dir, name);
    let st;
    try {
      st = statSync(p);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(p, out);
    else {
      const i = name.lastIndexOf('.');
      const ext = i >= 0 ? name.slice(i) : '';
      if (exts.has(ext)) out.push(p);
    }
  }
  return out;
}

const pairs = [
  [/admin@j-ta\.local/g, 'admin@jetbay.local'],
  [/demo@j-ta\.local/g, 'demo@jetbay.local'],
  [/noreply@j-ta\.local/g, 'noreply@jetbay.local'],
  [/jta_admin_token/g, 'jetbay_admin_token'],
  [/jta_refresh_token/g, 'jetbay_refresh_token'],
  [/jta_user_id/g, 'jetbay_user_id'],
  [/jta_token/g, 'jetbay_token'],
  [/postgresql:\/\/jta_user:jta_password@[^"'\s]+jta_db/g, 'postgresql://jetbay_user:jetbay_password@127.0.0.1:5432/jetbay_db'],
  [/CREATE USER jta_user WITH PASSWORD 'jta_password'/g, "CREATE USER jetbay_user WITH PASSWORD 'jetbay_password'"],
  [/CREATE DATABASE jta_db OWNER jta_user/g, 'CREATE DATABASE jetbay_db OWNER jetbay_user'],
  [/dev-jta-secret-change-in-production/g, 'dev-jetbay-secret-change-in-production'],
  [/J-TA API Gateway/g, 'JetBay API Gateway'],
  [/J-TA Admin/g, 'JetBay Admin'],
  [/J-TA API/g, 'JetBay API'],
  [/J-TA Platform/g, 'JetBay Platform'],
  [/J-TA Private Jet Charter/g, 'JetBay Private Jet Charter'],
  [/J-TA Private Jet/g, 'JetBay Private Jet'],
  [/J-TA verification/g, 'JetBay verification'],
  [/J-TA SOS/g, 'JetBay SOS'],
  [/J-TA Jet Card/g, 'JetBay Jet Card'],
  [/The J-TA Jet Card/g, 'The JetBay Jet Card'],
  [/J-TA Jet Card/g, 'JetBay Jet Card'],
  [/with J-TA/g, 'with JetBay'],
  [/About J-TA/g, 'About JetBay'],
  [/Charter with J-TA/g, 'Charter with JetBay'],
  [/Choose J-TA/g, 'Choose JetBay'],
  [/Fly Anywhere with J-TA/g, 'Fly Anywhere with JetBay'],
  [/Learn More About J-TA/g, 'Learn More About JetBay'],
  [/J-TA Booking Process/g, 'JetBay Booking Process'],
  [/J-TA cancellation/g, 'JetBay cancellation'],
  [/J-TA concierge/g, 'JetBay concierge'],
  [/J-TA Inc\./g, 'JetBay Inc.'],
  [/J-TA-style/g, 'JetBay-style'],
  [/J-TA CDN/g, 'JetBay CDN'],
  [/alt="J-TA"/g, 'alt="JetBay"'],
  [/alt="J-TA /g, 'alt="JetBay '],
  [/\?\? 'J-TA'/g, "?? 'JetBay'"],
  [/J - TA/g, 'JETBAY'],
  [/\bJ-TA\b/g, 'JetBay'],
];

let files = [];
for (const r of roots) walk(r, files);

let changed = 0;
for (const f of files) {
  if (f.includes('rebrand-jetbay.mjs') || f.includes('brand.ts')) continue;
  let t = readFileSync(f, 'utf8');
  const orig = t;
  for (const [re, to] of pairs) t = t.replace(re, to);
  if (t !== orig) {
    writeFileSync(f, t);
    changed++;
    console.log(f);
  }
}
console.log('files_changed', changed);
