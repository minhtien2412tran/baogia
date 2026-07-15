#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
function loadKey() {
  for (const p of [resolve(root, 'apps/web/.env.local'), resolve(root, 'apps/api/.env')]) {
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^(?:NEXT_PUBLIC_)?API_KEY=(.*)$/);
      if (m) return m[1].replace(/^["']|["']$/g, '');
    }
  }
  return process.env.API_KEY || '';
}

const key = loadKey();
const res = await fetch('https://api.minhtien.online/newsletter/subscribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(key ? { 'X-API-Key': key } : {}),
  },
  body: JSON.stringify({ email: 'smtp-check@jetbay.local', locale: 'en' }),
  signal: AbortSignal.timeout(30_000),
});
const j = await res.json().catch(() => ({}));
console.log(
  JSON.stringify({
    http: res.status,
    status: j.status,
    emailDeliverable: j.emailDeliverable,
    message: j.message,
  }),
);
const hasFlag = Object.prototype.hasOwnProperty.call(j, 'emailDeliverable');
process.exit(res.ok && hasFlag ? 0 : 1);
