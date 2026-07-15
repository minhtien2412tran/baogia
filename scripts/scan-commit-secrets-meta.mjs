#!/usr/bin/env node
/** Meta-only secret name scan on recent commits — never prints secret values. */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const files = execSync('git diff --name-only HEAD~12..HEAD', { encoding: 'utf8' })
  .trim()
  .split(/\r?\n/)
  .filter(Boolean);

const nameOnlySensitive = /\.env($|\.)/i;
const contentHints = [
  /SMTP_PASSWORD\s*=\s*[^\s"'#]+/i,
  /DATABASE_URL\s*=\s*(?!.*(localhost|CHANGE_ME|example))[^\s"'#]+/i,
  /BEGIN (RSA |OPENSSH )?PRIVATE KEY/,
  /TWILIO_AUTH_TOKEN\s*=\s*[^\s"'#]+/i,
  /STRIPE_SECRET_KEY\s*=\s*sk_/i,
];

const out = [];
for (const f of files) {
  if (!existsSync(f)) continue;
  if (/\.(png|jpe?g|gif|webp|pdf|lock)$/i.test(f)) continue;
  if (nameOnlySensitive.test(f) && !/\.(example|sample|template)/i.test(f)) {
    out.push({ file: f, status: 'SENSITIVE' });
    continue;
  }
  let txt = '';
  try {
    txt = readFileSync(f, 'utf8');
  } catch {
    continue;
  }
  let flagged = false;
  for (const p of contentHints) {
    if (!p.test(txt)) continue;
    // allow docs that only name keys
    if (/\b(NOT_SET|CHANGE_ME|example\.com|process\.env)\b/.test(txt)) continue;
    out.push({ file: f, status: 'REVIEW' });
    flagged = true;
    break;
  }
  if (!flagged && !out.find((x) => x.file === f)) {
    // silence
  }
}

console.log(JSON.stringify({ scanned: files.length, findings: out }, null, 2));
process.exit(out.some((x) => x.status === 'SENSITIVE') ? 2 : 0);
