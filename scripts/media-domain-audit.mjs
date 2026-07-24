/**
 * Media domain audit for priority pages (Wave 4).
 * Usage: node scripts/media-domain-audit.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const pages = [
  'https://www.minhtien.online/en-us',
  'https://www.minhtien.online/en-us/fixed-price-charter',
  'https://www.minhtien.online/en-us/empty-leg',
  'https://www.minhtien.online/en-us/destination',
  'https://www.minhtien.online/en-us/news',
  'https://www.minhtien.online/en-us/jet-card',
  'https://www.minhtien.online/en-us/travel-credit',
  'https://www.minhtien.online/en-us/contact',
];

const domainCount = new Map();
const pageDomains = new Map();
const broken = [];
const sampleByDomain = new Map();

function classify(host) {
  if (!host) return 'unknown';
  if (host.includes('localhost') || host.startsWith('127.')) return 'localhost';
  if (host.includes('jetvina.com')) return 'jetvina-hotlink';
  if (host.includes('minhtien.online')) return 'jetbay-prod';
  if (host.includes('m-tien.com')) return 'collateral';
  return 'other';
}

for (const page of pages) {
  const r = await fetch(page);
  const html = await r.text();
  const urls = new Set();
  for (const m of html.matchAll(/(?:src|href)=["']([^"']+\.(?:png|jpe?g|webp|gif|svg)[^"']*)["']/gi)) {
    urls.add(m[1]);
  }
  for (const m of html.matchAll(/url\((['"]?)([^)'"]+\.(?:png|jpe?g|webp|gif|svg)[^)'"]*)\1\)/gi)) {
    urls.add(m[2]);
  }

  const hosts = new Set();
  for (const raw of urls) {
    let abs = raw;
    try {
      abs = new URL(raw, page).href;
    } catch {
      continue;
    }
    let host = '';
    try {
      host = new URL(abs).hostname;
    } catch {
      continue;
    }
    hosts.add(host);
    domainCount.set(host, (domainCount.get(host) || 0) + 1);
    if (!sampleByDomain.has(host)) sampleByDomain.set(host, abs);

    // spot-check up to 3 images per page for status
  }

  // check up to 8 image URLs per page
  let checked = 0;
  for (const raw of urls) {
    if (checked >= 8) break;
    let abs;
    try {
      abs = new URL(raw, page).href;
    } catch {
      continue;
    }
    if (!/\.(png|jpe?g|webp|gif|svg)/i.test(abs)) continue;
    checked++;
    try {
      const ir = await fetch(abs, { method: 'HEAD' });
      if (!ir.ok) {
        // some CDNs reject HEAD
        const gr = await fetch(abs, { method: 'GET' });
        if (!gr.ok) broken.push({ page, url: abs, status: gr.status });
      }
    } catch (e) {
      broken.push({ page, url: abs, status: String(e.message || e) });
    }
  }
  pageDomains.set(page, [...hosts]);
}

const when = new Date().toISOString();
const day = when.slice(0, 10).replace(/-/g, '');
const rows = [...domainCount.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(
    ([host, n]) =>
      `| ${host} | ${n} | ${classify(host)} | see pages below | ${classify(host) === 'jetvina-hotlink' ? 'O5 decide' : '—'} |`,
  );

const md = `# Media domain audit — ${when.slice(0, 10)}

> Wave 4 (W4-01 / W4-02) · \`scripts/media-domain-audit.mjs\` · HTML scrape of priority pages (not full crawl)

## Domain counts (img src / css url in HTML)

| Domain | Số lượng | Loại | Trang sử dụng | Quyết định Owner |
|--------|--------:|------|---------------|------------------|
${rows.join('\n')}

## Pages → hosts

${[...pageDomains.entries()].map(([p, h]) => `- \`${p}\` → ${h.join(', ') || '(none parsed)'}`).join('\n')}

## Broken / failed fetches (sample ≤8/page)

${
  broken.length
    ? ['| Page | URL | Status |', '| --- | --- | --- |', ...broken.map((b) => `| ${b.page} | ${b.url} | ${b.status} |`)].join('\n')
    : '_No failures in sampled HEAD/GET checks._'
}

## Owner decision (W4-04) — chọn đúng 1

1. Tiếp tục hotlink Jetvina với xác nhận quyền sử dụng.
2. Mirror về storage/CDN riêng sau khi xác nhận quyền.
3. Thay bằng media doanh nghiệp sở hữu.

→ Ghi vào [OWNER_ACTION_ITEMS.md](../OWNER_ACTION_ITEMS.md) O5.

## Fallback (W4-03)

Code: \`CdnImage\` + \`ResponsiveImage\` dùng \`/brand/jetvina/logo-fallback.svg\` khi \`onError\` (một lần, không retry loop).
`;

mkdirSync('docs/reviews', { recursive: true });
const out = resolve(`docs/reviews/MEDIA_AUDIT_${day}.md`);
writeFileSync(out, md);
console.log('Wrote', out);
console.log('domains', domainCount.size, 'broken', broken.length);
