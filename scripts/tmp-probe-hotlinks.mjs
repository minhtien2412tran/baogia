import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

mkdirSync('tmp', { recursive: true });
const url = process.argv[2] || 'https://www.minhtien.online/en-us';
const res = await fetch(url);
const html = await res.text();
writeFileSync(resolve('tmp/home-probe.html'), html);
const urls = [...html.matchAll(/https?:\/\/(?:www\.)?jetvina\.com[^"'\\\s)]+/gi)].map((m) => m[0]);
const unique = [...new Set(urls)];
console.log('page', url, 'status', res.status, 'jetvina_urls', unique.length);
console.log(unique.slice(0, 20).join('\n'));
const local = [...html.matchAll(/\/assets\/jetvina\/mirror\/[^"'\\\s)]+/gi)].map((m) => m[0]);
console.log('local_mirror_refs', new Set(local).size);
