#!/usr/bin/env node
/**
 * Validate apps/web/public/brand/jetvina/jetvina-media-manifest.json
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'apps/web/public/brand/jetvina/jetvina-media-manifest.json');
const publicRoot = path.join(root, 'apps/web/public');

const ALLOWED_HOSTS = new Set(['jetvina.com', 'www.jetvina.com']);
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const ALLOWED_RIGHTS = new Set([
  'UNVERIFIED',
  'CLIENT_PROVIDED',
  'OWNED',
  'LICENSED',
  'PROHIBITED',
]);
const PUBLISHABLE = new Set(['CLIENT_PROVIDED', 'OWNED', 'LICENSED']);

const errors = [];
const warnings = [];

if (!fs.existsSync(manifestPath)) {
  console.error('validate-jetvina-media-manifest: missing manifest');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const records = manifest.records || [];
const ids = new Set();
const checksums = new Map();
const wpIds = new Map();

for (const r of records) {
  if (!r.id) errors.push('record missing id');
  else if (ids.has(r.id)) errors.push(`duplicate id ${r.id}`);
  else ids.add(r.id);

  if (!r.sourceUrl) errors.push(`${r.id}: missing sourceUrl`);
  else {
    try {
      const u = new URL(r.sourceUrl);
      if (u.protocol !== 'https:') errors.push(`${r.id}: sourceUrl must be https`);
      if (!ALLOWED_HOSTS.has(u.hostname)) errors.push(`${r.id}: host not allowlisted ${u.hostname}`);
      if (r.sourceUrl.toLowerCase().includes('jetbay')) errors.push(`${r.id}: JetBay in sourceUrl`);
    } catch {
      errors.push(`${r.id}: invalid sourceUrl`);
    }
  }

  if (!ALLOWED_MIME.has(r.mimeType)) errors.push(`${r.id}: invalid mime ${r.mimeType}`);
  if (!(r.width > 0 && r.height > 0)) errors.push(`${r.id}: width/height must be > 0`);
  if (!Array.isArray(r.usageContexts) || r.usageContexts.length === 0) {
    errors.push(`${r.id}: usageContexts empty`);
  }
  if (!ALLOWED_RIGHTS.has(r.rightsStatus)) errors.push(`${r.id}: invalid rightsStatus`);

  if (r.approvedForProduction) {
    if (!PUBLISHABLE.has(r.rightsStatus)) {
      errors.push(`${r.id}: approvedForProduction requires OWNED|LICENSED|CLIENT_PROVIDED`);
    }
    if (!r.checksum || !r.localPath) {
      errors.push(`${r.id}: approvedForProduction requires localPath + checksum`);
    }
  }

  if (r.localPath) {
    if (r.localPath.includes('jetbay')) errors.push(`${r.id}: JetBay in localPath`);
    const abs = path.join(publicRoot, r.localPath.replace(/^\//, ''));
    if (r.checksum) {
      if (!fs.existsSync(abs)) {
        errors.push(`${r.id}: localPath missing on disk ${r.localPath}`);
      } else {
        const buf = fs.readFileSync(abs);
        const sum = crypto.createHash('sha256').update(buf).digest('hex');
        if (sum !== r.checksum) errors.push(`${r.id}: checksum mismatch`);
      }
    } else {
      warnings.push(`${r.id}: localPath without checksum (remote-review / unsynced)`);
    }
  }

  if (r.checksum) {
    if (checksums.has(r.checksum) && checksums.get(r.checksum) !== r.id) {
      errors.push(`${r.id}: duplicate checksum with ${checksums.get(r.checksum)}`);
    } else checksums.set(r.checksum, r.id);
  }

  if (r.wordpressMediaId != null) {
    const k = String(r.wordpressMediaId);
    if (wpIds.has(k)) errors.push(`${r.id}: duplicate wordpressMediaId ${k}`);
    else wpIds.set(k, r.id);
  }
}

const mirrored = records.filter((r) => r.checksum).length;
const summary = {
  total: records.length,
  mirrored,
  remoteReviewOnly: records.length - mirrored,
  productionApproved: records.filter((r) => r.approvedForProduction).length,
  warnings: warnings.length,
  errors: errors.length,
};

if (errors.length) {
  console.error('validate-jetvina-media-manifest: FAIL');
  console.error(errors.slice(0, 40).join('\n'));
  console.error(JSON.stringify(summary));
  process.exit(1);
}

console.log('validate-jetvina-media-manifest: PASS');
console.log(JSON.stringify(summary, null, 2));
if (warnings.length) console.log('warnings:\n' + warnings.slice(0, 20).join('\n'));
