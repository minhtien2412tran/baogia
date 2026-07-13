#!/usr/bin/env node
/**
 * Fail if public runtime source still references /assets/jetbay (except allowlisted tests/docs).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SCAN = ['apps/web/src', 'apps/admin/src', 'packages/i18n/src', 'apps/api/src'];

const ALLOW_PATH = [
  /media-policy\.test/,
  /resolve-media-asset\.test/,
  /resolve-media-asset\.ts$/,
  /media-asset\.integration\.spec/,
  /content-sync\.service\.ts$/,
  /jetbay-cdn\.ts$/, // LOCAL_ASSET_ROOT remaps; must not export /assets/jetbay string
  /audit-asset-references/,
  /jetvina-media-jetbay-asset-audit/,
  /jetvina-media-pass-report/,
  /public-branding-cleanup/,
  /CONTINUE_AT_HOME/,
  /baocaotiendo\/progress-report/, // historical project name in report body
];

const FORBIDDEN = /\/assets\/jetbay|['"`]assets\/jetbay/i;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name === 'dist') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?|mjs|css|scss|json)$/.test(name)) out.push(p);
  }
  return out;
}

const hits = [];
for (const root of SCAN) {
  for (const file of walk(path.join(ROOT, root))) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    if (ALLOW_PATH.some((re) => re.test(rel))) {
      // jetbay-cdn must not contain the forbidden public root string
      if (/jetbay-cdn\.ts$/.test(rel)) {
        const text = fs.readFileSync(file, 'utf8');
        if (/LOCAL_ASSET_ROOT\s*=\s*['"`]\/assets\/jetbay['"`]/.test(text)) {
          hits.push(`${rel}: LOCAL_ASSET_ROOT still points at /assets/jetbay`);
        }
        if (/`\$\{LOCAL_ASSET_ROOT\}/.test(text) === false && /\/assets\/jetbay\//.test(text)) {
          // only flag if literal /assets/jetbay/ appears outside sanitize remap comments/calls
          const lines = text.split(/\r?\n/);
          lines.forEach((line, i) => {
            if (!/\/assets\/jetbay/.test(line)) return;
            if (/sanitizePublicMediaSrc|remap|Legacy|comment|\/\//i.test(line)) return;
            hits.push(`${rel}:${i + 1}: ${line.trim().slice(0, 120)}`);
          });
        }
      }
      continue;
    }
    const text = fs.readFileSync(file, 'utf8');
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      if (!FORBIDDEN.test(line)) return;
      hits.push(`${rel}:${i + 1}: ${line.trim().slice(0, 160)}`);
    });
  }
}

if (hits.length) {
  console.error('audit-asset-references: FAIL\n' + hits.join('\n'));
  process.exit(1);
}
console.log('audit-asset-references: PASS (no public /assets/jetbay references)');
