/**
 * Download all JETBAY CDN assets referenced in jetbay-cdn.ts to local public folder.
 * Run: node scripts/download-jetbay-assets.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CONFIG = path.join(ROOT, 'apps/web/src/config/jetbay-cdn.ts');
const OUT = path.join(ROOT, 'apps/web/public/assets/jetbay');
const CDN = 'https://asserts.jet-bay.com';

function collectPaths() {
  const src = fs.readFileSync(CONFIG, 'utf8');
  const paths = new Set();

  for (const m of src.matchAll(/L\('([^']+)'\)/g)) {
    paths.add(m[1]);
  }
  for (const m of src.matchAll(/L\("([^"]+)"\)/g)) {
    paths.add(m[1]);
  }

  return [...paths].sort();
}

async function download(relPath) {
  const url = `${CDN}${relPath.startsWith('/') ? relPath : `/${relPath}`}`;
  const dest = path.join(OUT, relPath.replace(/^\//, '').split('/').join(path.sep));
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    return { relPath, status: 'skip' };
  }

  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    return { relPath, status: 'fail', code: res.status };
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return { relPath, status: 'ok', bytes: buf.length };
}

async function main() {
  const paths = collectPaths();
  console.log(`Found ${paths.length} unique asset paths`);

  let ok = 0;
  let skip = 0;
  let fail = 0;
  const failed = [];

  for (const relPath of paths) {
    try {
      const r = await download(relPath);
      if (r.status === 'ok') {
        ok++;
        console.log(`  OK  ${relPath} (${r.bytes} bytes)`);
      } else if (r.status === 'skip') {
        skip++;
      } else {
        fail++;
        failed.push(`${relPath} (${r.code})`);
        console.warn(`  FAIL ${relPath} HTTP ${r.code}`);
      }
    } catch (e) {
      fail++;
      failed.push(`${relPath} (${e.message})`);
      console.warn(`  ERR  ${relPath}: ${e.message}`);
    }
  }

  console.log(`\nDone: ${ok} downloaded, ${skip} skipped, ${fail} failed`);
  if (failed.length) {
    fs.writeFileSync(path.join(OUT, '_failed.json'), JSON.stringify(failed, null, 2));
    console.log('Failed list written to public/assets/jetbay/_failed.json');
  }
}

main();
