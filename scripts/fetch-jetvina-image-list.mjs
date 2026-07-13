import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outHtml = path.join(root, 'tmp-jetvina-home.html');

const res = await fetch('https://jetvina.com/', {
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JetBayStaging/1.0)' },
  redirect: 'follow',
});
const html = await res.text();
fs.writeFileSync(outHtml, html);
console.log('status', res.status, 'len', html.length);

const urls = [
  ...html.matchAll(/https?:\/\/[^"'\\\s>]+\.(?:jpg|jpeg|png|webp|gif)/gi),
].map((m) => m[0].replace(/&amp;/g, '&'));
const uploads = [
  ...html.matchAll(/\/wp-content\/uploads\/[^"'\\\s>]+\.(?:jpg|jpeg|png|webp|gif)/gi),
].map((m) => `https://jetvina.com${m[0].replace(/&amp;/g, '&')}`);

const all = [...new Set([...urls, ...uploads])].filter((u) =>
  /jetvina\.com|wp-content\/uploads/i.test(u),
);
console.log('unique jetvina imgs', all.length);
for (const u of all) console.log(u);
