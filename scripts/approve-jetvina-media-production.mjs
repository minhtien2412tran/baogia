/**
 * W4-05 — Approve mirrored JetVina media for production after Owner option 2.
 * Sets rightsStatus=CLIENT_PROVIDED + approvedForProduction for records with localPath+checksum.
 *
 * Usage: node scripts/approve-jetvina-media-production.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'apps/web/public/brand/jetvina/jetvina-media-manifest.json');
const rightsPath = path.join(root, 'apps/web/public/assets/jetvina/RIGHTS.md');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const now = new Date().toISOString();
let approved = 0;
let skipped = 0;

for (const r of manifest.records) {
  if (r.localPath && r.checksum) {
    r.rightsStatus = 'CLIENT_PROVIDED';
    r.approvedForStaging = true;
    r.approvedForProduction = true;
    r.altText = r.altText?.includes('UNVERIFIED')
      ? 'JetVina media (CLIENT_PROVIDED mirror)'
      : r.altText || 'JetVina media';
    approved++;
  } else {
    skipped++;
  }
}

manifest.generatedAt = now;
manifest.rightsNote =
  'CLIENT_PROVIDED — Owner W4-04 option 2 (24/07/2026): mirror to JetBay storage with usage rights confirmed. Prefer localPath; disable hotlink in production (NEXT_PUBLIC_ALLOW_JETVINA_REMOTE=false).';

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
fs.writeFileSync(
  rightsPath,
  `# JetVina site media — rights

| Field | Value |
|-------|--------|
| Source | jetvina.com WP uploads (mirrored) |
| Mirror | \`/assets/jetvina/mirror/\` |
| Manifest | \`/brand/jetvina/jetvina-media-manifest.json\` |
| rightsStatus | **CLIENT_PROVIDED** |
| Owner decision | W4-04 **option 2** — 24/07/2026 |
| Staging remote review | optional |
| Production hotlink | **Forbidden** (use local mirror) |
| Production local publish | **Allowed** (approvedForProduction) |

Synced/approved: ${now}
Records approved: ${approved}
Skipped (missing local/checksum): ${skipped}
`,
);

console.log('approved', approved, 'skipped', skipped, '→', manifestPath);
