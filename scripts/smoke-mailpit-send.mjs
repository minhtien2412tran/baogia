#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
function loadKey() {
  for (const p of [
    resolve(root, 'apps/web/.env.local'),
    resolve(root, 'apps/api/.env'),
  ]) {
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^(?:NEXT_PUBLIC_)?API_KEY=(.*)$/);
      if (m) return m[1].replace(/^["']|["']$/g, '');
    }
  }
  return process.env.API_KEY || '';
}

const email = `mailpit-${Date.now()}@jetbay.local`;
const res = await fetch('https://api.minhtien.online/newsletter/subscribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(loadKey() ? { 'X-API-Key': loadKey() } : {}),
  },
  body: JSON.stringify({ email, locale: 'en' }),
  signal: AbortSignal.timeout(20_000),
});
const j = await res.json().catch(() => ({}));
console.log(JSON.stringify({ http: res.status, email, ...j }));
process.exit(res.ok ? 0 : 1);
