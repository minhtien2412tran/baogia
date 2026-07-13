#!/usr/bin/env node
/**
 * Documentation consistency audit for media/content-sync.
 * Fails on broken relative links (in scoped docs), outdated counts, conflicting status.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const docsDir = path.join(root, 'docs');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const REQUIRED_SCRIPTS = [
  'test:media',
  'audit:asset-references',
  'validate:jetvina-media-manifest',
  'audit:branding',
  'audit:debug',
  'sync:jetvina-media',
  'restart:web',
  'test:e2e:media-staging',
  'test:e2e:media-production',
  'audit:docs',
];

const CURRENT_DOCS = [
  'media-content-sync-status.md',
  'media-gap-audit.md',
  'jetvina-media-pass-report.md',
  'content-rights-policy.md',
  'content-sync-workflow.md',
  'content-sync-runbook.md',
  'content-sync-rollback.md',
  'jetvina-content-mapping.md',
  'jetvina-media-jetbay-asset-audit.md',
  'documentation-coverage-matrix.md',
  'public-branding-cleanup-final.md',
  'CONTINUE_AT_HOME.md',
];

const errors = [];
const warnings = [];

for (const s of REQUIRED_SCRIPTS) {
  if (!pkg.scripts?.[s]) errors.push(`package.json missing script: ${s}`);
}

const statusPath = path.join(docsDir, 'media-content-sync-status.md');
if (!fs.existsSync(statusPath)) {
  errors.push('missing docs/media-content-sync-status.md (SOURCE OF TRUTH)');
} else {
  const status = fs.readFileSync(statusPath, 'utf8');
  if (!/SOURCE OF TRUTH/i.test(status)) {
    errors.push('media-content-sync-status.md must declare SOURCE OF TRUTH');
  }
  if (!/\*\*17\/17\*\*|17\/17/.test(status)) errors.push('status missing media tests 17/17');
  if (!/\*\*58\/58\*\*|58\/58/.test(status)) errors.push('status missing API Jest 58/58');
  if (!/\*\*42\*\*|42 records/.test(status)) errors.push('status missing manifest 42');
  if (!/PARTIAL/.test(status)) errors.push('status must remain PARTIAL while production rights blocked');
  if (/production publication remains blocked/i.test(status) === false && /BLOCKED/.test(status) === false) {
    warnings.push('status should mention production publication blocked');
  }
}

// Outdated counts in CURRENT docs (not historical sales docs)
const OUTDATED = [
  { re: /\b41\/41\b/, msg: 'outdated API test count 41/41 — use 58/58' },
  { re: /\b38\/38\b/, msg: 'outdated API test count 38/38' },
  { re: /\b28\/28\b/, msg: 'outdated count 28/28' },
  { re: /\b25\/25\b/, msg: 'outdated count 25/25' },
  { re: /BLOCKED:\s*PostgreSQL/i, msg: 'stale PostgreSQL BLOCKED claim' },
  { re: /migration blocked/i, msg: 'stale migration blocked claim' },
];

const continuePath = path.join(docsDir, 'CONTINUE_AT_HOME.md');
if (fs.existsSync(continuePath)) {
  const c = fs.readFileSync(continuePath, 'utf8');
  const mediaPassLines = c.split(/\r?\n/).filter((l) => /Media pass \(PARTIAL\)/i.test(l));
  if (mediaPassLines.length > 1) {
    errors.push(`CONTINUE_AT_HOME has ${mediaPassLines.length} duplicate Media pass (PARTIAL) lines`);
  }
}

for (const name of CURRENT_DOCS) {
  const fp = path.join(docsDir, name);
  if (!fs.existsSync(fp)) {
    if (name === 'CONTINUE_AT_HOME.md') {
      const alt = path.join(root, 'docs', 'CONTINUE_AT_HOME.md');
      if (!fs.existsSync(alt)) errors.push(`missing ${name}`);
      continue;
    }
    errors.push(`missing current doc ${name}`);
    continue;
  }
  const text = fs.readFileSync(fp, 'utf8');
  // Skip outdated-count checks for historical-labelled files
  const historical = /Historical result — superseded|HISTORICAL|Superseded/i.test(text);
  if (!historical) {
    for (const o of OUTDATED) {
      if (o.re.test(text) && name !== 'media-gap-audit.md') {
        // gap audit may mention what was fixed
        if (name.includes('gap')) continue;
        errors.push(`${name}: ${o.msg}`);
      }
    }
  }

  // Relative markdown links
  const linkRe = /\[([^\]]*)\]\(([^)]+)\)/g;
  let m;
  while ((m = linkRe.exec(text))) {
    const href = m[2].split('#')[0].split('?')[0];
    if (!href || href.startsWith('http') || href.startsWith('mailto:')) continue;
    const target = path.normalize(path.join(path.dirname(fp), href));
    if (!fs.existsSync(target)) {
      errors.push(`${name}: broken link → ${m[2]}`);
    }
  }
}

// Conflicting claims: CURRENT docs saying public /assets/jetbay still referenced as active root
const jetbayActive = path.join(docsDir, 'content-source-audit.md');
if (fs.existsSync(jetbayActive)) {
  const t = fs.readFileSync(jetbayActive, 'utf8');
  if (/FE static `\/assets\/jetbay`/.test(t) && !/superseded|Historical|CURRENT:/i.test(t)) {
    warnings.push(
      'content-source-audit.md still describes FE static /assets/jetbay as current — add superseded note',
    );
  }
}

if (warnings.length) {
  console.warn('audit:docs warnings:\n' + warnings.map((w) => `  - ${w}`).join('\n'));
}
if (errors.length) {
  console.error('audit:docs FAIL:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('audit:docs PASS');
