#!/usr/bin/env node
/**
 * Push SMTP_* from local apps/api/.env → VPS /var/www/jetbay-be/.env
 * Never prints secret values.
 *
 * Usage: node scripts/push-smtp-env-to-vps.mjs
 */
import { readFileSync, existsSync, writeFileSync, unlinkSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const localEnv = resolve(root, 'apps/api/.env');
const remotePy = resolve(root, 'scripts/upsert-smtp-env-remote.py');
const VPS = process.env.JETBAY_VPS_HOST || '103.200.20.100';

const KEYS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'SMTP_FROM',
  'SMTP_FROM_NAME',
  'SMTP_ENQUIRY_TO',
  'SMTP_ALLOW_CATCHER',
];

function loadEnv(path) {
  const out = {};
  if (!existsSync(path)) throw new Error(`Missing ${path}`);
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
  return out;
}

const local = loadEnv(localEnv);
const payload = {};
for (const k of KEYS) {
  if (!(k in local) || local[k] === undefined || local[k] === '') {
    if (k === 'SMTP_ALLOW_CATCHER') {
      payload[k] = 'false';
      continue;
    }
    if (k === 'SMTP_FROM_NAME') {
      payload[k] = 'JetBay';
      continue;
    }
    console.error(`ABORT: ${k} missing/empty in apps/api/.env`);
    process.exit(1);
  }
  let v = local[k];
  if (k === 'SMTP_PASSWORD') v = v.replace(/\s+/g, '');
  if (k === 'SMTP_ALLOW_CATCHER') v = 'false';
  payload[k] = v;
}

const host = payload.SMTP_HOST.toLowerCase();
if (['localhost', '127.0.0.1', 'mailpit'].includes(host)) {
  console.error('ABORT: SMTP_HOST still loopback — set real provider first');
  process.exit(1);
}

console.log(
  '[push-smtp] local meta → VPS',
  JSON.stringify({
    SMTP_HOST: payload.SMTP_HOST,
    SMTP_PORT: payload.SMTP_PORT,
    SMTP_SECURE: payload.SMTP_SECURE,
    SMTP_USER: 'SET',
    SMTP_PASSWORD: 'SET',
    SMTP_FROM: 'SET',
    SMTP_FROM_NAME: payload.SMTP_FROM_NAME ? 'SET' : 'NOT_SET',
    SMTP_ENQUIRY_TO: 'SET',
    SMTP_ALLOW_CATCHER: payload.SMTP_ALLOW_CATCHER,
  }),
);

const scp = spawnSync(
  'scp',
  ['-o', 'BatchMode=yes', remotePy, `root@${VPS}:/tmp/upsert-smtp-env-remote.py`],
  { encoding: 'utf8' },
);
if (scp.status !== 0) {
  console.error('[push-smtp] scp failed', scp.stderr || scp.stdout);
  process.exit(scp.status || 1);
}

const tmpJson = join(tmpdir(), `jetbay-smtp-${Date.now()}.json`);
writeFileSync(tmpJson, JSON.stringify(payload), { encoding: 'utf8', mode: 0o600 });
try {
  const push = spawnSync(
    'ssh',
    [
      '-o',
      'BatchMode=yes',
      `root@${VPS}`,
      'python3 /tmp/upsert-smtp-env-remote.py && rm -f /tmp/upsert-smtp-env-remote.py',
    ],
    {
      input: readFileSync(tmpJson),
      encoding: 'utf8',
      maxBuffer: 2 * 1024 * 1024,
    },
  );
  if (push.status !== 0) {
    console.error('[push-smtp] upsert failed', push.stderr || push.stdout);
    process.exit(push.status || 1);
  }
  console.log(push.stdout.trim());
} finally {
  try {
    unlinkSync(tmpJson);
  } catch {
    /* ignore */
  }
}

const restart = spawnSync(
  'ssh',
  [
    '-o',
    'BatchMode=yes',
    `root@${VPS}`,
    "bash -lc 'set -a; source /var/www/jetbay-be/.env; set +a; cd /var/www/jetbay-be; pm2 restart jetbay-be --update-env; pm2 save >/dev/null; sleep 3; curl -sS http://127.0.0.1:3010/integrations/status'",
  ],
  { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 },
);
if (restart.status !== 0) {
  console.error('[push-smtp] restart failed', restart.stderr || restart.stdout);
  process.exit(restart.status || 1);
}

const lines = restart.stdout
  .trim()
  .split(/\r?\n/)
  .filter(Boolean);
const jsonLine = [...lines].reverse().find((l) => l.startsWith('{'));
console.log('[push-smtp] integrations/status');
console.log(jsonLine);

let status;
try {
  status = JSON.parse(jsonLine);
} catch {
  console.error('[push-smtp] FAIL: could not parse status JSON');
  process.exit(1);
}
const smtp = status?.integrations?.smtp;
const catcher = status?.integrations?.smtpCatcher;
if (!smtp || catcher) {
  console.error('[push-smtp] FAIL: expect smtp=true smtpCatcher=false', {
    smtp,
    catcher,
    reason: status?.integrations?.smtpBlockedReason,
  });
  process.exit(1);
}
console.log('[push-smtp] PASS W5-10 gate');
