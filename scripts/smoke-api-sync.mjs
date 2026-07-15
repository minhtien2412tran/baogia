#!/usr/bin/env node
/**
 * Compare OpenAPI path sets: local API vs prod (and docs).
 * Supports Swagger HTTP Basic (prod/docs may return 401 without it).
 *
 * Usage:
 *   SYNC_MODE=prod-docs SWAGGER_BASIC_USER=docs SWAGGER_BASIC_PASSWORD=*** pnpm smoke:api-sync
 *   # Or on VPS (reads /var/www/jetbay-be/.env, does not print secrets):
 *   bash scripts/deploy/jetbay-be/run-smoke-api-sync-remote.sh
 *
 * Exit 0 = compared surfaces match after successful OpenAPI fetch.
 * Exit 1 = mismatch / network / hard failure.
 * Exit 2 = BLOCKED_OWNER_CREDENTIAL (401 without usable Basic).
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

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

const fileEnv = {
  ...loadEnvFile(resolve(repoRoot, 'apps/api/.env')),
  ...loadEnvFile(resolve(repoRoot, 'apps/web/.env.local')),
};

const LOCAL = (process.env.LOCAL_API || 'http://127.0.0.1:4000').replace(/\/$/, '');
const PROD = (process.env.PROD_API || 'https://api.minhtien.online').replace(/\/$/, '');
const DOCS = (process.env.DOCS_API || 'https://docs.minhtien.online').replace(/\/$/, '');
const SYNC_MODE = (process.env.SYNC_MODE || 'auto').toLowerCase(); // auto | full | prod-docs
const BASIC_USER = process.env.SWAGGER_BASIC_USER || fileEnv.SWAGGER_BASIC_USER || '';
const BASIC_PASS = process.env.SWAGGER_BASIC_PASSWORD || fileEnv.SWAGGER_BASIC_PASSWORD || '';

function authHeaders() {
  const headers = { Accept: 'application/json' };
  if (BASIC_USER) {
    headers.Authorization = `Basic ${Buffer.from(`${BASIC_USER}:${BASIC_PASS}`).toString('base64')}`;
  }
  // Intentionally omit X-API-Key — OpenAPI is gated by Swagger Basic only.
  return headers;
}

async function fetchPaths(base) {
  const url = `${base}/openapi.json`;
  let res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (res.status === 401) {
    if (!BASIC_USER || !BASIC_PASS) {
      const err = new Error(
        `BLOCKED_OWNER_CREDENTIAL: ${url} → 401. Set SWAGGER_BASIC_USER + SWAGGER_BASIC_PASSWORD (VPS /var/www/jetbay-be/.env or env). Do not commit secrets. Or run: bash scripts/deploy/jetbay-be/run-smoke-api-sync-remote.sh`,
      );
      err.code = 'BLOCKED_OWNER_CREDENTIAL';
      throw err;
    }
    res = await fetch(url, { headers: authHeaders() });
    if (res.status === 401) {
      const err = new Error(
        `BLOCKED_OWNER_CREDENTIAL: ${url} → 401 with Basic user set (password mismatch or rotated). Update SWAGGER_BASIC_* on the machine running this script; never paste passwords into chat/git.`,
      );
      err.code = 'BLOCKED_OWNER_CREDENTIAL';
      throw err;
    }
  }
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

function printDiff(label, onlyA, onlyB, aName, bName) {
  console.error(`FAIL: ${label}`);
  onlyA.slice(0, 40).forEach((p) => console.error(`  +${aName} ${p}`));
  onlyB.slice(0, 40).forEach((p) => console.error(`  +${bName} ${p}`));
}

async function main() {
  console.log('smoke-api-sync');
  console.log(`  mode:  ${SYNC_MODE}`);
  console.log(`  local: ${LOCAL}`);
  console.log(`  prod:  ${PROD}`);
  console.log(`  docs:  ${DOCS}`);
  console.log(
    `  basic: ${BASIC_USER ? 'set' : 'none'} · pass: ${BASIC_PASS ? `len=${BASIC_PASS.length}` : 'none'}`,
  );

  let local = null;
  const wantLocal = SYNC_MODE === 'full' || SYNC_MODE === 'auto';
  if (wantLocal && SYNC_MODE !== 'prod-docs') {
    try {
      local = await fetchPaths(LOCAL);
    } catch (e) {
      if (SYNC_MODE === 'full') throw e;
      console.warn(`  local openapi skipped: ${e.message}`);
      console.warn('  continuing with prod ↔ docs (SYNC_MODE=auto)');
    }
  }

  const prod = await fetchPaths(PROD);
  let docs = null;
  try {
    docs = await fetchPaths(DOCS);
  } catch (e) {
    if (e.code === 'BLOCKED_OWNER_CREDENTIAL') throw e;
    console.warn(`  docs openapi skipped: ${e.message}`);
  }

  if (local) console.log(`  local paths=${local.paths.length} ver=${local.version}`);
  console.log(`  prod  paths=${prod.paths.length} ver=${prod.version}`);
  if (docs) console.log(`  docs  paths=${docs.paths.length} ver=${docs.version}`);

  let failed = false;

  if (local) {
    const { onlyA, onlyB } = diff(local.paths, prod.paths);
    if (onlyA.length || onlyB.length) {
      failed = true;
      printDiff('local ↔ prod path mismatch', onlyA, onlyB, 'local', 'prod');
    } else {
      console.log('OK: local ↔ prod paths identical');
    }
  } else if (SYNC_MODE === 'full') {
    failed = true;
    console.error('FAIL: local required (SYNC_MODE=full) but unreachable');
  } else {
    console.log('OK: local skipped (prod-docs / auto fallback)');
  }

  if (docs) {
    const d = diff(prod.paths, docs.paths);
    if (d.onlyA.length || d.onlyB.length) {
      failed = true;
      printDiff('prod ↔ docs path mismatch', d.onlyA, d.onlyB, 'prod', 'docs');
    } else {
      console.log('OK: prod ↔ docs paths identical');
    }
  } else if (!local) {
    failed = true;
    console.error('FAIL: neither local nor docs available for comparison');
  }

  if (failed) process.exit(1);
  console.log('PASS');
}

main().catch((err) => {
  console.error('ERROR:', err.message || err);
  if (err.code === 'BLOCKED_OWNER_CREDENTIAL') process.exit(2);
  process.exit(1);
});
