#!/usr/bin/env node
/**
 * Install repo-local git hooks (no husky dependency).
 * Points core.hooksPath at scripts/git-hooks (repo-relative).
 */
import { execSync } from 'node:child_process';
import { chmodSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const hooksDir = 'scripts/git-hooks';
const absHooks = join(root, hooksDir);

if (!existsSync(join(absHooks, 'pre-commit'))) {
  console.error('Missing scripts/git-hooks/pre-commit');
  process.exit(1);
}

try {
  chmodSync(join(absHooks, 'pre-commit'), 0o755);
} catch {
  // Windows may ignore chmod
}

execSync(`git config core.hooksPath ${hooksDir}`, { cwd: root, stdio: 'inherit' });

// Ensure Windows callers have a node entry if bash missing — Git for Windows uses sh
const wrap = `#!/bin/sh
# auto — installed by scripts/security/install-git-hooks.mjs
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT" || exit 1
exec node scripts/security/scan-secrets.mjs --staged
`;
writeFileSync(join(absHooks, 'pre-commit'), wrap.replace(/\r\n/g, '\n'), 'utf8');
try {
  chmodSync(join(absHooks, 'pre-commit'), 0o755);
} catch {
  /* ignore */
}

console.log(`OK: git config core.hooksPath=${hooksDir}`);
console.log('Pre-commit will run: node scripts/security/scan-secrets.mjs --staged');
console.log('Verify: pnpm security:scan');
