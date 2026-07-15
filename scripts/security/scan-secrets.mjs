#!/usr/bin/env node
/**
 * Secret / credential scan for Git + CI.
 * Never prints secret values — only path, rule id, and status.
 *
 * Usage:
 *   node scripts/security/scan-secrets.mjs              # staged files (pre-commit)
 *   node scripts/security/scan-secrets.mjs --staged
 *   node scripts/security/scan-secrets.mjs --diff HEAD~1
 *   node scripts/security/scan-secrets.mjs --all         # tracked text-ish files (CI)
 *   node scripts/security/scan-secrets.mjs --files a b
 *
 * Exit: 0 clean · 1 findings · 2 usage/tool error
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolveRepoRoot();
const args = process.argv.slice(2);

const SKIP_DIR = new Set([
  'node_modules',
  '.git',
  'dist',
  '.next',
  'coverage',
  'playwright-report',
  'test-results',
  'vendor',
]);

const SKIP_EXT =
  /\.(png|jpe?g|gif|webp|ico|svg|woff2?|ttf|eot|mp4|webm|pdf|zip|gz|tgz|7z|lock|map)$/i;

/** Docs / templates that legitimately name env keys */
const PATH_ALLOW = [
  /(^|[/\\])\.env\.example$/i,
  /(^|[/\\])env\.production\.template$/i,
  /(^|[/\\])docs[/\\].*\.md$/i,
  /(^|[/\\])AGENTS\.md$/i,
  /(^|[/\\])SECURITY_SECRETS\.md$/i,
  /(^|[/\\])GIT_AND_CODE_SECURITY\.md$/i,
  /(^|[/\\])scripts[/\\]security[/\\]/i,
  /(^|[/\\])scripts[/\\]scan-commit-secrets-meta\.mjs$/i,
  /(^|[/\\])\.specify[/\\]/i,
  /(^|[/\\])\.cursor[/\\]skills[/\\]/i,
];

const FILENAME_BLOCK = [
  { id: 'env-file', re: /(^|[/\\])\.env($|\.|rc)/i, allowExample: true },
  { id: 'pem-key', re: /\.(pem|p12|pfx|key)$/i },
  { id: 'credentials-json', re: /(^|[/\\])credentials\.json$/i },
  { id: 'service-account', re: /service[_-]?account.*\.json$/i },
  { id: 'id-rsa', re: /(^|[/\\])id_rsa($|\.)/i },
  { id: 'kubeconfig', re: /(^|[/\\])kubeconfig$/i },
];

const CONTENT_RULES = [
  {
    id: 'private-key',
    re: /-----BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----/,
  },
  {
    id: 'aws-access-key',
    re: /AKIA[0-9A-Z]{16}/,
  },
  {
    id: 'github-pat',
    re: /ghp_[A-Za-z0-9]{20,}/,
  },
  {
    id: 'stripe-live-secret',
    re: /sk_live_[A-Za-z0-9]{20,}/,
  },
  {
    id: 'stripe-test-secret-hardcoded',
    // allow sk_test_ in docs via PATH_ALLOW; block in app source
    re: /sk_test_[A-Za-z0-9]{20,}/,
    onlyUnder: [/apps[/\\]/, /packages[/\\]/, /scripts[/\\](?!security)/],
  },
  {
    id: 'jwt-like-assignment',
    // Static quoted secrets only (skip shell "$(grep…)" / openssl generators)
    re: /\b(JWT_SECRET|REFRESH_TOKEN_SECRET|PAYMENT_SECRET|API_KEY)\s*=\s*['"][A-Za-z0-9\/+=_\-]{24,}['"]/,
  },
  {
    id: 'smtp-password-assignment',
    re: /\bSMTP_PASSWORD\s*=\s*['"][^'"$\n]{4,}['"]/,
  },
  {
    id: 'database-url-with-password',
    re: /\bDATABASE_URL\s*=\s*['"]?postgres(?:ql)?:\/\/[^:\s"']+:[^@\s"'${}]{4,}@/i,
    // local generator seed password is intentional placeholder
    skipIf: [/jetbay_password@127\.0\.0\.1/, /CHANGE_ME/, /localhost/],
  },
  {
    id: 'bearer-inline',
    re: /\bBearer\s+[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+/,
  },
  {
    id: 'twilio-auth-assignment',
    re: /\bTWILIO_AUTH_TOKEN\s*=\s*['"][^'"]+['"]/,
  },
  {
    id: 'generic-password-assignment',
    re: /\b(password|passwd|secret_key)\s*[:=]\s*['"][^'"]{8,}['"]/i,
    onlyUnder: [/apps[/\\]/, /packages[/\\]/],
    skipIf: [/CHANGE_ME|example|placeholder|your[_-]?password|Admin123!|Demo123!/i],
  },
];

function resolveRepoRoot() {
  const here = dirname(fileURLToPath(import.meta.url));
  return join(here, '..', '..');
}

function git(cmd) {
  return execSync(`git ${cmd}`, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function isPathAllowed(rel) {
  return PATH_ALLOW.some((re) => re.test(rel));
}

function collectFiles() {
  if (args.includes('--files')) {
    const i = args.indexOf('--files');
    return args.slice(i + 1).filter((a) => !a.startsWith('--'));
  }
  if (args.includes('--all')) {
    return walkTrackedLike();
  }
  if (args.includes('--diff')) {
    const i = args.indexOf('--diff');
    const rev = args[i + 1] || 'HEAD~1';
    const out = git(`diff --name-only ${rev}`);
    return out ? out.split(/\r?\n/).filter(Boolean) : [];
  }
  // default: staged
  const out = git('diff --cached --name-only --diff-filter=ACMR');
  return out ? out.split(/\r?\n/).filter(Boolean) : [];
}

/** Tracked files only (CI). Local gitignored .env must not fail tree scan. */
function walkTrackedLike() {
  const out = git('ls-files');
  return out
    ? out
        .split(/\r?\n/)
        .filter(Boolean)
        .filter((rel) => !SKIP_EXT.test(rel))
        .filter((rel) => !rel.split('/').some((p) => SKIP_DIR.has(p)))
    : [];
}

function scanFile(rel) {
  const findings = [];
  const abs = join(root, rel);
  if (!existsSync(abs)) return findings;

  for (const rule of FILENAME_BLOCK) {
    if (!rule.re.test(rel)) continue;
    if (rule.allowExample && /\.(example|sample|template)$/i.test(rel)) continue;
    if (isPathAllowed(rel) && rule.allowExample) continue;
    if (/\.example$/i.test(rel)) continue;
    findings.push({ file: rel, rule: rule.id, status: 'BLOCK' });
  }

  if (SKIP_EXT.test(rel)) return findings;
  if (isPathAllowed(rel)) return findings;

  let txt = '';
  try {
    const st = statSync(abs);
    if (st.size > 1_500_000) return findings;
    txt = readFileSync(abs, 'utf8');
  } catch {
    return findings;
  }
  // skip obvious binary
  if (txt.includes('\u0000')) return findings;

  for (const rule of CONTENT_RULES) {
    if (rule.onlyUnder && !rule.onlyUnder.some((re) => re.test(rel))) continue;
    if (!rule.re.test(txt)) continue;
    if (rule.skipIf && rule.skipIf.some((re) => re.test(txt))) continue;
    // placeholders
    if (/\b(CHANGE_ME|changeme|your-secret|example\.com|process\.env)\b/i.test(txt) &&
        !/-----BEGIN/.test(txt) &&
        !/AKIA[0-9A-Z]{16}/.test(txt) &&
        !/ghp_/.test(txt) &&
        !/sk_live_/.test(txt)) {
      // still allow high-signal token patterns through
      if (!/sk_live_|ghp_|AKIA|PRIVATE KEY/.test(rule.id) && !rule.id.includes('private')) {
        continue;
      }
    }
    findings.push({ file: rel, rule: rule.id, status: 'BLOCK' });
  }
  return findings;
}

function main() {
  let files;
  try {
    files = collectFiles();
  } catch (e) {
    console.error('scan-secrets: git error —', e instanceof Error ? e.message : e);
    process.exit(2);
  }

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: node scripts/security/scan-secrets.mjs [--staged|--all|--diff REV|--files ...]`);
    process.exit(0);
  }

  // empty staged = OK
  if (files.length === 0) {
    console.log(JSON.stringify({ scanned: 0, findings: [], ok: true }));
    process.exit(0);
  }

  const findings = [];
  for (const f of files) {
    findings.push(...scanFile(f));
  }

  const unique = [];
  const seen = new Set();
  for (const x of findings) {
    const k = `${x.file}|${x.rule}`;
    if (seen.has(k)) continue;
    seen.add(k);
    unique.push(x);
  }

  const ok = unique.length === 0;
  console.log(
    JSON.stringify(
      {
        scanned: files.length,
        findings: unique,
        ok,
        note: 'Values never printed — fix or unstage blocked files',
      },
      null,
      2,
    ),
  );
  process.exit(ok ? 0 : 1);
}

main();
