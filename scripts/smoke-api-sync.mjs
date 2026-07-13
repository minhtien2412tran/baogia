#!/usr/bin/env node
/**
 * Compare OpenAPI path sets: local API vs prod (and optionally docs).
 * Exit 0 if in sync; exit 1 if paths differ or unreachable.
 *
 * Usage:
 *   node scripts/smoke-api-sync.mjs
 *   LOCAL_API=http://127.0.0.1:4000 PROD_API=https://api.minhtien.online node scripts/smoke-api-sync.mjs
 */
const LOCAL = (process.env.LOCAL_API || 'http://127.0.0.1:4000').replace(/\/$/, '');
const PROD = (process.env.PROD_API || 'https://api.minhtien.online').replace(/\/$/, '');
const DOCS = (process.env.DOCS_API || 'https://docs.minhtien.online').replace(/\/$/, '');

async function fetchPaths(base) {
  const url = `${base}/openapi.json`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  const doc = await res.json();
  const paths = Object.keys(doc.paths || {}).sort();
  return { version: doc.info?.version ?? '?', paths, bytes: JSON.stringify(doc).length };
}

function diff(a, b) {
  const sa = new Set(a);
  const sb = new Set(b);
  return {
    onlyA: a.filter((p) => !sb.has(p)),
    onlyB: b.filter((p) => !sa.has(p)),
  };
}

async function main() {
  console.log('smoke-api-sync');
  console.log(`  local: ${LOCAL}`);
  console.log(`  prod:  ${PROD}`);
  console.log(`  docs:  ${DOCS}`);

  const local = await fetchPaths(LOCAL);
  const prod = await fetchPaths(PROD);
  let docs = null;
  try {
    docs = await fetchPaths(DOCS);
  } catch (e) {
    console.warn(`  docs openapi skipped: ${e.message}`);
  }

  console.log(`  local paths=${local.paths.length} ver=${local.version}`);
  console.log(`  prod  paths=${prod.paths.length} ver=${prod.version}`);
  if (docs) console.log(`  docs  paths=${docs.paths.length} ver=${docs.version}`);

  const { onlyA, onlyB } = diff(local.paths, prod.paths);
  let failed = false;

  if (onlyA.length || onlyB.length) {
    failed = true;
    console.error('FAIL: local ↔ prod path mismatch');
    onlyA.slice(0, 40).forEach((p) => console.error(`  +local ${p}`));
    onlyB.slice(0, 40).forEach((p) => console.error(`  +prod  ${p}`));
  } else {
    console.log('OK: local ↔ prod paths identical');
  }

  if (docs) {
    const d = diff(prod.paths, docs.paths);
    if (d.onlyA.length || d.onlyB.length) {
      failed = true;
      console.error('FAIL: prod ↔ docs path mismatch');
      d.onlyA.slice(0, 20).forEach((p) => console.error(`  +prod ${p}`));
      d.onlyB.slice(0, 20).forEach((p) => console.error(`  +docs ${p}`));
    } else {
      console.log('OK: prod ↔ docs paths identical');
    }
  }

  if (failed) process.exit(1);
  console.log('PASS');
}

main().catch((err) => {
  console.error('ERROR:', err.message || err);
  process.exit(1);
});
