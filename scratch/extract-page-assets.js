const fs = require('fs');
const path = require('path');

const pages = [
  'private-jet-charter',
  'jet-card',
  'empty-leg',
  'fixed-price-charter',
  'air-ambulance',
  'about-us',
  'travel-credit',
  'global-partnership-program',
  'booking-process',
  'corporate-air-charter',
  'group-air-charter',
  'event-air-charter',
  'pet-travel',
  'island-destinations',
  'video-centre',
  'news',
  'blogs',
];

const dir = path.join(__dirname, 'pages');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

for (const p of pages) {
  const fp = path.join(dir, `${p}.html`);
  if (fs.existsSync(fp) && fs.statSync(fp).size > 10000) continue;
  console.log('skip download (run curl separately):', p, fs.existsSync(fp) ? fs.statSync(fp).size : 0);
}

function extract(page) {
  const fp = path.join(dir, `${page}.html`);
  if (!fs.existsSync(fp)) return;
  const h = fs.readFileSync(fp, 'utf8');
  const urls = [...new Set([...h.matchAll(/https?:\/\/asserts\.jet-bay\.com[^"'\s<>\\?]+/g)].map((m) => m[0]))];
  const filtered = urls.filter((u) => !u.includes('google-bg') && !u.includes('batch/mdi') && !u.includes('batch/del') && !u.includes('batch/plus'));
  console.log(`\n## ${page} (${filtered.length} assets)`);
  filtered.slice(0, 25).forEach((u) => console.log(u));
}

for (const p of pages) extract(p);
