#!/usr/bin/env node
/**
 * Probe HTML/text pages without findstr (Windows FINDSTR fails on minified one-liners).
 *
 * Usage:
 *   node scripts/smoke-html-probe.mjs https://www.minhtien.online/baocaotiendo 3.1 14/07
 * Exit 0 if ALL needles found; 1 otherwise.
 */
const url = process.argv[2];
const needles = process.argv.slice(3);
if (!url || needles.length === 0) {
  console.error('Usage: node scripts/smoke-html-probe.mjs <url> <needle> [needle...]');
  process.exit(2);
}

const res = await fetch(url, {
  headers: { Accept: 'text/html' },
  signal: AbortSignal.timeout(30_000),
});
const text = await res.text();
console.log(`status=${res.status} bytes=${text.length} url=${url}`);
if (!res.ok) {
  console.error(`FAIL http=${res.status}`);
  process.exit(1);
}
let fail = 0;
for (const n of needles) {
  const ok = text.includes(n);
  console.log(`${ok ? 'OK' : 'MISS'} needle=${JSON.stringify(n)}`);
  if (!ok) fail++;
}
process.exit(fail === 0 ? 0 : 1);
