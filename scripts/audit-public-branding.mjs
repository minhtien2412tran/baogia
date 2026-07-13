#!/usr/bin/env node
/**
 * Static public branding audit — fails on JetBay strings in public-facing sources.
 * Allowlists: @jetbay/* packages, CSS jb-* class names, historical paths under assets/jetbay
 * when referenced as asset roots, internal keys jetbay_token, docs/, baocaotiendo internal report.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SCAN_ROOTS = [
  'apps/web/src',
  'packages/i18n/src',
  'apps/api/src/services/customer-care',
  'apps/api/src/services/document.service.ts',
  'apps/api/src/content-sync/brand-public.ts',
];

const ALLOW_PATH_RE = [
  /node_modules/,
  /\.next/,
  /dist\//,
  /brand-assets\.test/,
  /media-policy\.test/,
  /public-branding-cleanup/,
  /jetbay-cleanup/,
  /CONTINUE_AT_HOME/,
  /baocaotiendo/,
  /progress-report/,
  /JetBayLogo\.tsx$/,
  /JetBayHeader\.tsx$/,
  /JetBayFooter\.tsx$/,
  /JetBayMotion\.tsx$/,
  /jetbay-cdn\.ts$/,
  /jetbay-home\.css$/,
  /jetbay-.*\.css$/,
  /brand\.ts$/,
  /brand-assets\.ts$/,
  /media-policy\.ts$/,
  /rebrand-public-copy/,
  /audit-public-branding/,
];

const VIOLATION_RE =
  /\bJetBay\b|\bJetBay Inc\.|\bJetBay SOS\b|demo@jetbay\.local|10,000\+\s*aircraft|Access to 10,000/i;

const ALLOW_LINE_RE = [
  /@jetbay\//,
  /from ['"]@jetbay/,
  /jetbay_token|jetbay_user_id|jetbay_refresh|jetbay-auth-changed/,
  /\/assets\/jetbay\//,
  /styles\/jetbay-/,
  /jetbayImg|jetbay-cdn|LOCAL_ASSET_ROOT/,
  /JetBayHeader|JetBayFooter|JetBayMotion|JetBayLogo/,
  /className=["'].*jb-/,
  /\/\*[\s\S]*JetBay|\/\/.*JetBay|Never.*JetBay|legacy JetBay|historical JetBay|Hide JetBay|strip.*JetBay|detects JetBay|no JetBay|not.*JetBay|JetBay i18n|JETBAY_PUBLIC_RE|assertNoJetBay/i,
  /phone\.jetbay\.local/,
  /SHOW_UNVERIFIED|BLOCK_JETBAY|rebrandText|assertNoJetBay/,
  /jetbay-private-jet-app/,
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  const st = fs.statSync(dir);
  if (st.isFile()) {
    out.push(dir);
    return out;
  }
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name === 'dist') continue;
    walk(path.join(dir, name), out);
  }
  return out;
}

const files = [];
for (const root of SCAN_ROOTS) {
  const abs = path.join(ROOT, root);
  walk(abs, files);
}

const hits = [];
for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (ALLOW_PATH_RE.some((re) => re.test(rel))) continue;
  if (!/\.(tsx?|jsx?|mjs|md|html)$/.test(rel)) continue;
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    if (!VIOLATION_RE.test(line)) return;
    if (ALLOW_LINE_RE.some((re) => re.test(line))) return;
    hits.push(`${rel}:${i + 1}: ${line.trim().slice(0, 160)}`);
  });
}

if (hits.length) {
  console.error('Public branding violations:\n' + hits.join('\n'));
  process.exit(1);
}

console.log(`audit-public-branding: PASS (${files.length} files scanned, 0 public violations)`);
