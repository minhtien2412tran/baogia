/**
 * Gracefully restart @jetbay/web on :3000 without killing unrelated Node processes.
 *
 * Usage:
 *   node scripts/restart-web-dev.mjs
 *   node scripts/restart-web-dev.mjs --dry-run
 */
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pidFile = path.join(root, '.jetbay-web-dev.pid');
const PORT = 3000;
const dryRun = process.argv.includes('--dry-run');

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function health() {
  return new Promise((resolve) => {
    const req = http.get({ hostname: '127.0.0.1', port: PORT, path: '/en-us', timeout: 4000 }, (res) => {
      res.resume();
      resolve(res.statusCode === 200 || res.statusCode === 304);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

function listPortPids() {
  try {
    const out = execFileSync(
      'powershell.exe',
      [
        '-NoProfile',
        '-Command',
        `(Get-NetTCPConnection -LocalPort ${PORT} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique) -join ','`,
      ],
      { encoding: 'utf8' },
    ).trim();
    if (!out) return [];
    return out
      .split(',')
      .map((s) => Number(s.trim()))
      .filter(Boolean);
  } catch {
    return [];
  }
}

function commandLine(pid) {
  try {
    return execFileSync(
      'powershell.exe',
      ['-NoProfile', '-Command', `(Get-CimInstance Win32_Process -Filter "ProcessId=${pid}").CommandLine`],
      { encoding: 'utf8' },
    ).trim();
  } catch {
    return '';
  }
}

function cwdOf(pid) {
  try {
    return execFileSync(
      'powershell.exe',
      [
        '-NoProfile',
        '-Command',
        `(Get-Process -Id ${pid} -ErrorAction SilentlyContinue).Path`,
      ],
      { encoding: 'utf8' },
    ).trim();
  } catch {
    return '';
  }
}

function isJetbayWeb(cmd) {
  const c = cmd.toLowerCase();
  if (!c) return false;
  if (c.includes('@jetbay/web')) return true;
  const inRepo =
    c.includes('baogia') ||
    c.includes('apps\\web') ||
    c.includes('apps/web') ||
    c.includes('apps\\\\web');
  if (!inRepo) return false;
  return (
    c.includes('next') ||
    c.includes('start-server') ||
    c.includes('turbopack') ||
    c.includes('--filter')
  );
}

async function gracefulStop(pid) {
  const cmd = commandLine(pid);
  const exe = cwdOf(pid);
  console.log(`Candidate PID ${pid}\n  cmd: ${cmd || '(unknown)'}\n  path: ${exe || '(unknown)'}`);
  if (!isJetbayWeb(cmd)) {
    console.error(`Refusing to kill PID ${pid} — not recognized as @jetbay/web under this repo.`);
    return false;
  }
  if (dryRun) {
    console.log(`[dry-run] would graceful-stop PID ${pid}`);
    return true;
  }
  console.log(`Stopping @jetbay/web PID ${pid}`);
  try {
    process.kill(pid, 'SIGTERM');
  } catch {
    try {
      execFileSync('taskkill', ['/PID', String(pid)], { stdio: 'ignore' });
    } catch {
      /* ignore */
    }
  }
  for (let i = 0; i < 20; i++) {
    await sleep(250);
    try {
      process.kill(pid, 0);
    } catch {
      return true;
    }
  }
  console.warn(`Force kill PID ${pid} after timeout`);
  try {
    execFileSync('taskkill', ['/PID', String(pid), '/F'], { stdio: 'ignore' });
  } catch {
    /* ignore */
  }
  return true;
}

const healthy = await health();
console.log(`Current /en-us health: ${healthy ? 'OK' : 'DOWN'}`);
console.log(dryRun ? 'Mode: dry-run (no kill, no spawn)' : 'Mode: restart');

const pids = listPortPids();
const knownPid = fs.existsSync(pidFile) ? Number(fs.readFileSync(pidFile, 'utf8').trim()) : null;
if (knownPid && !Number.isFinite(knownPid)) {
  console.warn(`Ignoring corrupt PID file: ${pidFile}`);
}
const candidates = [...new Set([knownPid, ...pids].filter((p) => Number.isFinite(p) && p > 0))];

let refusedForeign = false;
for (const pid of candidates) {
  const ok = await gracefulStop(pid);
  if (!ok) refusedForeign = true;
}

if (refusedForeign && pids.length && !pids.every((p) => isJetbayWeb(commandLine(p)))) {
  console.error(`Port ${PORT} is occupied by a non-project process — aborting restart.`);
  process.exitCode = 1;
  process.exit();
}

if (dryRun) {
  console.log('[dry-run] would start: pnpm --filter @jetbay/web dev');
  console.log('[dry-run] PASS (no processes killed)');
  process.exit(0);
}

if (fs.existsSync(pidFile)) fs.unlinkSync(pidFile);
await sleep(500);

const child = spawn(
  process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
  ['--filter', '@jetbay/web', 'dev'],
  {
    cwd: root,
    detached: true,
    stdio: 'ignore',
    shell: process.platform === 'win32',
  },
);
child.unref();
fs.writeFileSync(pidFile, String(child.pid));
console.log(`Started web dev wrapper PID ${child.pid}`);

let ok = false;
for (let i = 0; i < 60; i++) {
  await sleep(1000);
  if (await health()) {
    ok = true;
    break;
  }
}

if (!ok) {
  console.error('Web server failed health check after restart');
  process.exitCode = 1;
} else {
  console.log('Health PASS http://127.0.0.1:3000/en-us → 200');
}
