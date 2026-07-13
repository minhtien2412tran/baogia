/**
 * Fail CI on debugger / public console.log / secret logging patterns.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const SCAN_DIRS = ['apps/web/src', 'apps/admin/src', 'apps/api/src', 'packages'];
const EXT = /\.(ts|tsx|js|jsx|mjs)$/;

const ALLOW_PATH = [/node_modules/, /\.next/, /dist/, /\.test\./, /\.spec\./];

const CONSOLE_ALLOW = [/apps[\\/]api[\\/]src[\\/]main\.ts$/];

const SECRET_RE =
  /console\.(log|debug|info|warn|error)\([^)]*(password|token|api[_-]?key|secret|cookie|authorization|bearer)/i;
const DEBUGGER_RE = /\bdebugger\b/;
const CONSOLE_LOG_RE = /\bconsole\.log\s*\(/;

const findings = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.next' || e.name === 'dist') continue;
      walk(p);
    } else if (EXT.test(e.name)) {
      scan(p);
    }
  }
}

function scan(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (ALLOW_PATH.some((r) => r.test(rel))) return;
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    const n = i + 1;
    if (DEBUGGER_RE.test(line) && !line.trim().startsWith('//')) {
      findings.push({ rel, n, kind: 'debugger', line: line.trim() });
    }
    if (SECRET_RE.test(line)) {
      findings.push({ rel, n, kind: 'secret-log', line: line.trim() });
    }
    if (CONSOLE_LOG_RE.test(line) && !line.trim().startsWith('//')) {
      if (!CONSOLE_ALLOW.some((r) => r.test(rel))) {
        findings.push({ rel, n, kind: 'console.log', line: line.trim() });
      }
    }
  });
}

for (const d of SCAN_DIRS) walk(path.join(ROOT, d));

if (findings.length) {
  console.error('audit:debug FAILED');
  for (const f of findings) {
    console.error(`  [${f.kind}] ${f.rel}:${f.n}  ${f.line}`);
  }
  process.exit(1);
}

console.log('audit:debug PASS (no debugger / public console.log / secret logs)');
