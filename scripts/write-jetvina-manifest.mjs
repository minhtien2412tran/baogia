/**
 * Write UNVERIFIED staging manifest from curated catalog (no download).
 * Production publish stays blocked (approvedForProduction=false).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogPath = path.join(root, 'apps/web/src/lib/jetvina-media-catalog.ts');
const out = path.join(root, 'apps/web/public/brand/jetvina/jetvina-media-manifest.json');

const src = fs.readFileSync(catalogPath, 'utf8');
const urls = [...src.matchAll(/'(https:\/\/jetvina\.com\/wp-content\/uploads\/[^']+)'/g)].map((m) => m[1]);

function contexts(url) {
  const u = url.toLowerCase();
  if (/interior|cabin/.test(u)) return ['AIRCRAFT_CABIN'];
  if (/phu-quoc|samui|beach|thuong|yllas|hyatt/.test(u)) return ['DESTINATION'];
  if (/hero|banner/.test(u)) return ['HERO'];
  if (/wajer|wimbledon|maxres|hq720/.test(u)) return ['NEWS'];
  if (/cargo|fast-track|khai-thac/.test(u)) return ['SERVICE', 'CARGO'];
  if (/\/1\.png$/.test(u)) return ['MEMBERSHIP'];
  if (/sanh-di|san-bay|airport|mount-airy/.test(u)) return ['MAP', 'CONTACT'];
  return ['AIRCRAFT_EXTERIOR', 'EMPTY_LEG', 'HERO'];
}

const records = [...new Set(urls)].map((sourceUrl, i) => {
  const file = decodeURIComponent(sourceUrl.split('/').pop() || 'asset').replace(/[^\w.\-]+/g, '_');
  return {
    id: `jv-cat-${i + 1}`,
    sourceUrl,
    localPath: `/assets/jetvina/mirror/${file}`,
    mimeType: sourceUrl.endsWith('.png')
      ? 'image/png'
      : sourceUrl.endsWith('.webp')
        ? 'image/webp'
        : 'image/jpeg',
    width: 1600,
    height: 900,
    fileSize: 0,
    checksum: '',
    altText: 'JetVina media (UNVERIFIED staging review)',
    usageContexts: contexts(sourceUrl),
    rightsStatus: 'UNVERIFIED',
    approvedForStaging: true,
    approvedForProduction: false,
    syncedAt: new Date().toISOString(),
  };
});

const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  rightsNote:
    'UNVERIFIED — staging/dev review only. Not production-publishable until OWNED|LICENSED|CLIENT_PROVIDED + approvedForProduction.',
  records,
};

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(manifest, null, 2));
console.log(`Wrote ${records.length} records → ${out}`);
