#!/usr/bin/env node
/**
 * Import JetVina media manifest into API MediaAsset via authenticated endpoint.
 * Does NOT open Prisma with production credentials from the frontend tree.
 *
 * Usage:
 *   pnpm import:jetvina-media --dry-run
 *   pnpm import:jetvina-media --limit=5
 *
 * Env:
 *   API_BASE_URL (default http://127.0.0.1:4000)
 *   API_KEY
 *   ADMIN_EMAIL / ADMIN_PASSWORD (default local admin fixture)
 *   EXTERNAL_MEDIA_IMPORT_ENABLED must be true on API
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(
  root,
  'apps/web/public/brand/jetvina/jetvina-media-manifest.json',
);

function parseArgs(argv) {
  const opts = { dryRun: false, limit: Infinity, report: '' };
  for (const a of argv) {
    if (a === '--dry-run') opts.dryRun = true;
    else if (a.startsWith('--limit=')) opts.limit = Number(a.slice(8)) || 0;
    else if (a.startsWith('--report=')) opts.report = a.slice(9);
  }
  return opts;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const apiBase = (process.env.API_BASE_URL || 'http://127.0.0.1:4000').replace(
    /\/$/,
    '',
  );
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error('API_KEY required (same as apps/api)');
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const records = (raw.records || [])
    .filter((r) => r.localPath && r.checksum)
    .slice(0, opts.limit === Infinity ? undefined : opts.limit)
    .map((r) => ({
      storageKey: String(r.localPath).replace(/^\//, ''),
      checksum: r.checksum,
      mimeType: r.mimeType,
      width: r.width,
      height: r.height,
      fileSize: r.fileSize,
      sourceUrl: r.sourceUrl,
      altText: r.altText,
      usageContexts: r.usageContexts,
    }));

  if (!records.length) {
    console.error('No mirrored records with checksum in manifest');
    process.exit(1);
  }

  const email = process.env.ADMIN_EMAIL || 'admin@jetbay.local';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';

  const loginRes = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({ email, password }),
  });
  if (!loginRes.ok) {
    console.error('Login failed', loginRes.status, await loginRes.text());
    process.exit(1);
  }
  const login = await loginRes.json();
  const token = login.tokens?.accessToken;
  if (!token) {
    console.error('No accessToken');
    process.exit(1);
  }

  const importRes = await fetch(`${apiBase}/admin/media-assets/import-manifest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ dryRun: opts.dryRun, records }),
  });
  const body = await importRes.json().catch(() => ({}));
  if (!importRes.ok) {
    console.error('Import failed', importRes.status, body);
    process.exit(1);
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun: opts.dryRun,
        recordCount: records.length,
        result: body,
      },
      null,
      2,
    ),
  );
  if (opts.report) {
    fs.mkdirSync(path.dirname(path.resolve(opts.report)), { recursive: true });
    fs.writeFileSync(opts.report, JSON.stringify(body, null, 2));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
