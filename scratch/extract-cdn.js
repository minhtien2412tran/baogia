const fs = require('fs');
const path = require('path');
const dir = __dirname;
for (const f of ['jetbay-en-us.html', 'jetbay-root.html', 'jetbay-home.html']) {
  const p = path.join(dir, f);
  if (!fs.existsSync(p)) continue;
  const h = fs.readFileSync(p, 'utf8');
  const re = /https?:\/\/asserts\.jet-bay\.com[^"'\s<>]+/g;
  const urls = [...new Set([...h.matchAll(re)].map((x) => x[0]))];
  console.log('\n===', f, 'size', h.length, 'urls', urls.length, '===');
  urls.slice(0, 50).forEach((u) => console.log(u));
}
