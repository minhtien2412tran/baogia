/**
 * Gracefully restart @jetbay/web on :3000 without killing unrelated Node processes.
 *
 * Usage: node scripts/restart-web-dev.mjs
 */
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pidFile = path.join(root, '.jetbay-web-dev.pid');
const PORT = 3000;

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
    const out = execFileSync('powershell.exe', [
      '-NoProfile',
      '-Command',
      `(Get-NetTCPConnection -LocalPort ${PORT} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique) -join ','`,
    ], { encoding: 'utf8' }).trim();
    if (!out) return [];
    return out.split(',').map((s) => Number(s.trim())).filter(Boolean);
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

function isJetbayWeb(cmd) {
  const c = cmd.toLowerCase();
  if (!c) return false;
  if (c.includes('@jetbay/web')) return true;
  const inRepo =
    c.includes('baogia') || c.includes('apps\\web') || c.includes('apps/web') || c.includes('apps\\\\web');
  if (!inRepo) return false;
  // next dev may show as next CLI or as dist/server/lib/start-server.js
  return (
    c.includes('next') ||
    c.includes('start-server') ||
    c.includes('turbopack') ||
    c.includes('--filter')
  );
}

async function gracefulStop(pid) {
  const cmd = commandLine(pid);
  if (!isJetbayWeb(cmd) && !fs.existsSync(pidFile)) {
    console.error(`Refusing to kill PID ${pid} — command line not recognized as @jetbay/web:\n${cmd}`);
    return false;
  }
  console.log(`Stopping JetBay web PID ${pid}`);
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

const pids = listPortPids();
const knownPid = fs.existsSync(pidFile) ? Number(fs.readFileSync(pidFile, 'utf8').trim()) : null;
const candidates = [...new Set([knownPid, ...pids].filter(Boolean))];

for (const pid of candidates) {
  await gracefulStop(pid);
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
console.log(`Started web dev PID ${child.pid}`);

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
