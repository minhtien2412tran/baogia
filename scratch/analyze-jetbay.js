const fs = require('fs');
const path = require('path');
const h = fs.readFileSync(path.join(__dirname, 'jetbay-en-us.html'), 'utf8');

// unique base paths without query
const urls = [...new Set([...h.matchAll(/https?:\/\/asserts\.jet-bay\.com[^"'\s<>\\]+/g)].map((x) => x[0].split('?')[0]))];

const groups = {
  logo: urls.filter((u) => /logo/i.test(u)),
  home: urls.filter((u) => /home|banner|homeBg/i.test(u)),
  footer: urls.filter((u) => /footer|payment|visa|master|amex|union|discover|social/i.test(u)),
  media: urls.filter((u) => /media|trust|globalTrust|featured/i.test(u)),
  membership: urls.filter((u) => /wyvern|nbaa|ebaa|asbaa|bbga|aca|member/i.test(u)),
  emptyLeg: urls.filter((u) => /empty|emptyleg/i.test(u)),
  fixedPrice: urls.filter((u) => /fixed.?price|fixedprice/i.test(u)),
  destination: urls.filter((u) => /destination|island/i.test(u)),
  jetcard: urls.filter((u) => /jetcard|jet-card/i.test(u)),
  app: urls.filter((u) => /app|qr|store/i.test(u)),
  partner: urls.filter((u) => /partner/i.test(u)),
  sos: urls.filter((u) => /ambulance|sos|medevac/i.test(u)),
  icons: urls.filter((u) => /batch\/|default\/call|Shield|Star|Icon/i.test(u)),
};

for (const [k, v] of Object.entries(groups)) {
  if (v.length) {
    console.log('\n##', k, v.length);
    v.slice(0, 15).forEach((u) => console.log(u));
  }
}

// menu labels from HTML
const menuMatches = [...h.matchAll(/"label":"([^"]+)"/g)].map((m) => m[1]);
console.log('\n## menu labels sample', [...new Set(menuMatches)].slice(0, 40));
