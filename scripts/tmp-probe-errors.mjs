const urls = [
  'https://www.minhtien.online/en-us',
  'https://www.minhtien.online/en-us/contact',
  'https://www.minhtien.online/en-us/travel-credits',
  'https://www.minhtien.online/en-us/travel-credit',
  'https://www.minhtien.online/en-us/account/travel-credits',
  'https://www.minhtien.online/en-us/destinations',
  'https://www.minhtien.online/en-us/destination',
  'https://www.minhtien.online/en-us/empty-leg-flights',
  'https://www.minhtien.online/en-us/empty-leg',
  'https://www.minhtien.online/en-us/customer-care',
  'https://api.minhtien.online/health',
  'https://api.minhtien.online/integrations/status',
];

for (const u of urls) {
  const r = await fetch(u, { redirect: 'manual' });
  console.log(r.status, r.headers.get('location') || '', u);
}

const h = await (await fetch('https://www.minhtien.online/en-us')).text();
const mirrors = [
  ...new Set([...h.matchAll(/\/assets\/jetvina\/mirror\/[^"'\\s>]+/g)].map((m) => m[0])),
].slice(0, 10);
console.log('--- mirrors sample', mirrors.length);
let ok = 0;
let bad = 0;
for (const m of mirrors) {
  const r = await fetch('https://www.minhtien.online' + m, { method: 'HEAD' });
  console.log(r.status, m);
  if (r.ok) ok++;
  else bad++;
}
console.log({ ok, bad });

// internal hrefs that look like known-bad aliases
const hrefs = [...h.matchAll(/href="(\/[^"]+)"/g)].map((m) => m[1]);
const badPatterns = ['/travel-credits', '/destinations', '/empty-leg-flights', '/customer-care'];
const hits = hrefs.filter((href) => badPatterns.some((p) => href.includes(p)));
console.log('--- home href hits', [...new Set(hits)]);
