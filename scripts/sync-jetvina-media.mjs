/**
 * Sync curated JetVina media → local mirror + manifest.
 *
 * Default: does NOT mark production-approved (rights remain UNVERIFIED).
 *
 * Usage:
 *   node scripts/sync-jetvina-media.mjs
 *   node scripts/sync-jetvina-media.mjs --dry-run --limit=5
 *   node scripts/sync-jetvina-media.mjs --force --report=tmp/media-sync-report.json
 */
import crypto from 'node:crypto';
import dns from 'node:dns/promises';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  assertAllowedUrlShape,
  assertResolvedIpsSafe,
  sniffMime,
  validateDownloadedImage,
} from './lib/jetvina-media-safety.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogPath = path.join(root, 'apps/web/src/lib/jetvina-media-catalog.ts');
const mirrorDir = path.join(root, 'apps/web/public/assets/jetvina/mirror');
const manifestPublic = path.join(root, 'apps/web/public/brand/jetvina/jetvina-media-manifest.json');
const rightsPath = path.join(root, 'apps/web/public/assets/jetvina/RIGHTS.md');

const CONCURRENCY = 2;
const TIMEOUT_MS = 25000;
const MAX_RETRIES = 3;

function parseArgs(argv) {
  const opts = { dryRun: false, limit: Infinity, force: false, report: '', category: '' };
  for (const a of argv) {
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--force') opts.force = true;
    else if (a.startsWith('--limit=')) opts.limit = Number(a.slice(8)) || 0;
    else if (a.startsWith('--report=')) opts.report = a.slice(9);
    else if (a.startsWith('--category=')) opts.category = a.slice(11);
  }
  return opts;
}

async function assertSafeUrl(urlString) {
  const u = assertAllowedUrlShape(urlString);
  const ips = await dns.lookup(u.hostname, { all: true });
  assertResolvedIpsSafe(ips.map((x) => x.address));
  return u;
}

function fileNameFromUrl(url) {
  return decodeURIComponent(url.split('/').pop() || 'asset').replace(/[^\w.\-]+/g, '_');
}

async function fetchWithRetry(url, attempt = 1) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'JetBayMediaSync/1.0 (+staging; UNVERIFIED rights)',
        Accept: 'image/jpeg,image/png,image/webp,image/avif',
      },
    });
    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const loc = res.headers.get('location');
      if (!loc) throw new Error('redirect without location');
      const next = new URL(loc, url);
      await assertSafeUrl(next.toString());
      if (attempt >= MAX_RETRIES) throw new Error('too many redirects');
      return fetchWithRetry(next.toString(), attempt + 1);
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    return { buf, contentType: (res.headers.get('content-type') || '').split(';')[0].trim() };
  } catch (e) {
    if (attempt >= MAX_RETRIES) throw e;
    const delay = 400 * 2 ** (attempt - 1);
    await new Promise((r) => setTimeout(r, delay));
    return fetchWithRetry(url, attempt + 1);
  } finally {
    clearTimeout(t);
  }
}

function readCatalogUrls(category) {
  const src = fs.readFileSync(catalogPath, 'utf8');
  const urls = [...src.matchAll(/'(https:\/\/jetvina\.com\/wp-content\/uploads\/[^']+)'/g)].map((m) => m[1]);
  let list = [...new Set(urls)];
  if (category) {
    const kindMap = {
      aircraft: /aircraft|global|phenom|legacy|challenger|gulfstream|bombardier|citation|praetor|boeing/i,
      cabin: /interior|cabin/i,
      destination: /phu-quoc|samui|thuong|dai-bac|yllas|hyatt|sunset/i,
      hero: /hero|banner|global6000|7500/i,
      news: /wajer|wimbledon|maxres|hq720/i,
      service: /aircargo|fast-track|khai-thac/i,
    };
    const re = kindMap[category];
    if (re) list = list.filter((u) => re.test(u));
  }
  return list;
}

function guessContexts(url) {
  const u = url.toLowerCase();
  if (/interior|cabin/.test(u)) return ['AIRCRAFT_CABIN'];
  if (/phu-quoc|samui|beach|thuong|yllas|hyatt|destination/.test(u)) return ['DESTINATION'];
  if (/hero|banner/.test(u)) return ['HERO'];
  if (/news|wajer|wimbledon|maxres/.test(u)) return ['NEWS'];
  if (/cargo|fast-track|airport/.test(u)) return ['SERVICE', 'CARGO'];
  if (/logo|1\.png$/.test(u)) return ['MEMBERSHIP'];
  return ['AIRCRAFT_EXTERIOR', 'EMPTY_LEG'];
}

async function mapPool(items, concurrency, fn) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return results;
}

const opts = parseArgs(process.argv.slice(2));
fs.mkdirSync(mirrorDir, { recursive: true });
fs.mkdirSync(path.dirname(manifestPublic), { recursive: true });

const urls = readCatalogUrls(opts.category).slice(0, opts.limit);
const report = {
  downloaded: 0,
  updated: 0,
  unchanged: 0,
  duplicate: 0,
  blocked: 0,
  failed: 0,
  dryRun: opts.dryRun,
  items: [],
};

const checksumIndex = new Map();
/** sourceUrl → synced record patch */
const syncedByUrl = new Map();

function loadBaseManifest() {
  const allUrls = readCatalogUrls('');
  const skeleton = allUrls.map((sourceUrl, i) => {
    const name = fileNameFromUrl(sourceUrl);
    return {
      id: `jv-cat-${i + 1}`,
      sourceUrl,
      localPath: `/assets/jetvina/mirror/${name}`,
      mimeType: 'image/jpeg',
      width: 1600,
      height: 900,
      fileSize: 0,
      checksum: '',
      altText: 'JetVina media (UNVERIFIED staging review)',
      usageContexts: guessContexts(sourceUrl),
      rightsStatus: 'UNVERIFIED',
      approvedForStaging: true,
      approvedForProduction: false,
      syncedAt: new Date().toISOString(),
    };
  });
  const byUrl = new Map(skeleton.map((r) => [r.sourceUrl, r]));
  if (fs.existsSync(manifestPublic)) {
    try {
      const prev = JSON.parse(fs.readFileSync(manifestPublic, 'utf8'));
      for (const r of prev.records || []) {
        if (!r?.sourceUrl) continue;
        const cur = byUrl.get(r.sourceUrl) || {};
        byUrl.set(r.sourceUrl, {
          ...cur,
          ...r,
          rightsStatus: 'UNVERIFIED',
          approvedForProduction: false,
        });
      }
    } catch {
      /* ignore corrupt manifest */
    }
  }
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    rightsNote:
      'UNVERIFIED — CLIENT_DIRECTED staging review only. Not OWNED/LICENSED/CLIENT_PROVIDED. approvedForProduction=false.',
    records: [...byUrl.values()],
  };
}

console.log(`sync:jetvina-media urls=${urls.length} dryRun=${opts.dryRun} force=${opts.force}`);

await mapPool(urls, CONCURRENCY, async (url) => {
  const item = { url, status: 'pending' };
  try {
    await assertSafeUrl(url);
    const name = fileNameFromUrl(url);
    const dest = path.join(mirrorDir, name);
    const localPath = `/assets/jetvina/mirror/${name}`;

    const lockPath = `${dest}.editor-lock`;
    if (fs.existsSync(lockPath) && !opts.force) {
      report.unchanged++;
      item.status = 'editor-locked';
      report.items.push(item);
      if (fs.existsSync(dest)) {
        const existing = fs.readFileSync(dest);
        const checksum = crypto.createHash('sha256').update(existing).digest('hex');
        checksumIndex.set(checksum, localPath);
        syncedByUrl.set(url, {
          id: `jv-${checksum.slice(0, 12)}`,
          sourceUrl: url,
          localPath,
          mimeType: sniffMime(existing) || 'image/jpeg',
          width: 1600,
          height: 900,
          fileSize: existing.length,
          checksum,
          altText: 'JetVina media (editor-locked, UNVERIFIED)',
          usageContexts: guessContexts(url),
          rightsStatus: 'UNVERIFIED',
          approvedForStaging: true,
          approvedForProduction: false,
          syncedAt: new Date().toISOString(),
        });
      }
      return;
    }

    if (!opts.force && fs.existsSync(dest) && !opts.dryRun) {
      const existing = fs.readFileSync(dest);
      const checksum = crypto.createHash('sha256').update(existing).digest('hex');
      if (checksumIndex.has(checksum)) {
        report.duplicate++;
        item.status = 'duplicate';
      } else {
        checksumIndex.set(checksum, localPath);
        report.unchanged++;
        item.status = 'unchanged';
        syncedByUrl.set(url, {
          id: `jv-${checksum.slice(0, 12)}`,
          sourceUrl: url,
          localPath,
          mimeType: sniffMime(existing) || 'image/jpeg',
          width: 1600,
          height: 900,
          fileSize: existing.length,
          checksum,
          altText: 'JetVina media (UNVERIFIED)',
          usageContexts: guessContexts(url),
          rightsStatus: 'UNVERIFIED',
          approvedForStaging: true,
          approvedForProduction: false,
          syncedAt: new Date().toISOString(),
        });
      }
      report.items.push(item);
      return;
    }

    if (opts.dryRun) {
      item.status = 'dry-run';
      report.downloaded++;
      report.items.push(item);
      return;
    }

    const { buf, contentType } = await fetchWithRetry(url);
    const sniffed = validateDownloadedImage(buf, contentType);

    const checksum = crypto.createHash('sha256').update(buf).digest('hex');
    if (checksumIndex.has(checksum)) {
      report.duplicate++;
      item.status = 'duplicate';
      report.items.push(item);
      return;
    }
    checksumIndex.set(checksum, localPath);

    const existed = fs.existsSync(dest);
    // Keep old file if write fails mid-way: write to temp then rename
    const tmp = `${dest}.tmp`;
    fs.writeFileSync(tmp, buf);
    fs.renameSync(tmp, dest);
    if (existed) report.updated++;
    else report.downloaded++;
    item.status = existed ? 'updated' : 'downloaded';
    item.bytes = buf.length;

    syncedByUrl.set(url, {
      id: `jv-${checksum.slice(0, 12)}`,
      sourceUrl: url,
      localPath,
      mimeType: sniffed,
      width: 1600,
      height: 900,
      fileSize: buf.length,
      checksum,
      altText: 'JetVina media (UNVERIFIED staging)',
      usageContexts: guessContexts(url),
      rightsStatus: 'UNVERIFIED',
      approvedForStaging: true,
      approvedForProduction: false,
      syncedAt: new Date().toISOString(),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/allowlist|SSRF|MIME|https|path must|SVG/.test(msg)) report.blocked++;
    else report.failed++;
    item.status = 'failed';
    item.error = msg;
  }
  report.items.push(item);
  console.log(item.status, url.slice(0, 80), item.error || item.bytes || '');
});

const base = loadBaseManifest();
const byUrl = new Map(base.records.map((r) => [r.sourceUrl, r]));
for (const [url, patch] of syncedByUrl) {
  const prev = byUrl.get(url) || {};
  byUrl.set(url, {
    ...prev,
    ...patch,
    // Never escalate rights via sync
    rightsStatus: 'UNVERIFIED',
    approvedForProduction: false,
    approvedForStaging: true,
  });
}

const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  rightsNote:
    'UNVERIFIED — CLIENT_DIRECTED staging review only. Not OWNED/LICENSED/CLIENT_PROVIDED. approvedForProduction=false.',
  records: [...byUrl.values()],
};

if (!opts.dryRun) {
  fs.writeFileSync(manifestPublic, JSON.stringify(manifest, null, 2));
  fs.writeFileSync(
    rightsPath,
    `# JetVina site media — rights\n\n| Field | Value |\n|-------|--------|\n| Source | jetvina.com WP uploads |\n| Mirror | \`/assets/jetvina/mirror/\` |\n| Manifest | \`/brand/jetvina/jetvina-media-manifest.json\` |\n| rightsStatus | **UNVERIFIED** |\n| Staging remote review | allowed when flags on |\n| Production hotlink | **Forbidden** |\n| Production local publish | **Blocked** until OWNED\\|LICENSED\\|CLIENT_PROVIDED + approvedForProduction |\n\nSynced: ${manifest.generatedAt}\nRecords: ${manifest.records.length}\nMirrored this run: ${syncedByUrl.size}\n`,
  );
}

if (opts.report) {
  fs.mkdirSync(path.dirname(path.resolve(opts.report)), { recursive: true });
  fs.writeFileSync(opts.report, JSON.stringify(report, null, 2));
}

console.log(
  `Done downloaded=${report.downloaded} updated=${report.updated} unchanged=${report.unchanged} duplicate=${report.duplicate} blocked=${report.blocked} failed=${report.failed} manifestRecords=${manifest.records.length}`,
);
if (report.failed && !report.downloaded && !report.unchanged) process.exitCode = 1;
