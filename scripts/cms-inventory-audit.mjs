/**
 * CMS inventory + placeholder/locale audit (Wave 2).
 * Usage: node scripts/cms-inventory-audit.mjs
 * Writes: docs/reviews/CMS_INVENTORY_YYYYMMDD.md
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnv(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

const env = { ...loadEnv('apps/api/.env'), ...loadEnv('apps/web/.env.local') };
const KEY = process.env.API_KEY || env.API_KEY || env.NEXT_PUBLIC_API_KEY || '';
const BASE = (process.env.API_URL || 'https://api.minhtien.online').replace(/\/$/, '');
const when = new Date().toISOString();
const day = when.slice(0, 10).replace(/-/g, '');

async function get(path) {
  const r = await fetch(`${BASE}${path}`, {
    headers: { 'X-API-Key': KEY, Accept: 'application/json' },
  });
  const j = await r.json().catch(() => ({}));
  return { status: r.status, j };
}

const PLACEHOLDER_RE = /\b(lorem ipsum|placeholder|demo text|sample text|test content|TODO_COPY)\b/i;
const SAMPLE_RE = /\b(sample|demo|test)\b/i;

function textOf(obj, keys) {
  return keys.map((k) => String(obj?.[k] ?? '')).join(' ');
}

function issuesFor(kind, item, idKeys, titleKeys, bodyKeys) {
  const rows = [];
  const id = idKeys.map((k) => item[k]).find((v) => v != null) ?? '?';
  const slug = item.slug ?? item.code ?? item.iata ?? id;
  const locale = item.locale ?? item.lang ?? 'n/a';
  const title = textOf(item, titleKeys);
  const body = textOf(item, bodyKeys);
  const img = item.thumbnail || item.imageUrl || item.image || item.heroImage || item.coverUrl || '';

  if (!title.trim()) {
    rows.push({ kind, slug, locale, issue: 'Title/name empty', severity: 'P1', fix: 'Fill from CMS/Owner', unlock: 'OWNER' });
  }
  if (PLACEHOLDER_RE.test(title + ' ' + body)) {
    rows.push({ kind, slug, locale, issue: 'lorem/placeholder text', severity: 'P1', fix: 'Replace copy', unlock: 'OWNER' });
  } else if (SAMPLE_RE.test(title) && !/labelled|SAMPLE/i.test(title)) {
    rows.push({
      kind,
      slug,
      locale,
      issue: 'demo/sample/test wording',
      severity: 'P2',
      fix: 'Label SAMPLE or replace',
      unlock: 'DEV',
    });
  }
  if (!String(img).trim()) {
    rows.push({ kind, slug, locale, issue: 'Image empty', severity: 'P2', fix: 'Add thumbnail', unlock: 'OWNER' });
  }
  const seoTitle = item.seoTitle || item.metaTitle || '';
  const seoDesc = item.seoDescription || item.metaDescription || item.description || '';
  if (kind === 'News' && (!seoTitle || !seoDesc)) {
    rows.push({ kind, slug, locale, issue: 'SEO title/description thin', severity: 'P2', fix: 'Fill SEO fields', unlock: 'DEV' });
  }
  return rows;
}

const { status: stEn, j: newsEn } = await get('/content/news?locale=en');
const { status: stVi, j: newsVi } = await get('/content/news?locale=vi');
const { j: fp } = await get('/fixed-price/routes');
const { j: dest } = await get('/content/destinations?limit=100');
const { j: jc } = await get('/jet-card/plans');
const { j: tc } = await get('/travel-credits/packages');
const { j: el } = await get('/empty-legs');

const newsEnList = newsEn.news ?? [];
const newsViList = newsVi.news ?? [];
const fpList = fp.routes ?? [];
const destList = dest.destinations ?? [];
const jcList = jc.plans ?? [];
const tcList = tc.packages ?? [];
const elList = el.emptyLegs ?? [];

const enSlugs = new Set(newsEnList.map((n) => n.slug));
const viSlugs = new Set(newsViList.map((n) => n.slug));
const missingVi = [...enSlugs].filter((s) => !viSlugs.has(s));
const missingEn = [...viSlugs].filter((s) => !enSlugs.has(s));

const issueRows = [];
for (const n of newsEnList) issueRows.push(...issuesFor('News', n, ['id'], ['title'], ['excerpt', 'body', 'content']));
for (const n of newsViList) issueRows.push(...issuesFor('News', { ...n, locale: 'vi' }, ['id'], ['title'], ['excerpt', 'body']));
for (const r of fpList) {
  issueRows.push(
    ...issuesFor('Fixed Price', r, ['id'], ['title', 'name', 'from', 'to'], ['description', 'terms', 'summary']),
  );
}
for (const d of destList) {
  issueRows.push(...issuesFor('Destination', d, ['id'], ['title', 'city'], ['description', 'excerpt', 'body']));
}
for (const p of jcList) {
  issueRows.push(...issuesFor('Jet Card', p, ['id'], ['name', 'title'], ['description', 'subtitle']));
}
for (const p of tcList) {
  issueRows.push(...issuesFor('Travel Credit', p, ['id'], ['name', 'title'], ['description']));
}

for (const s of missingVi) {
  issueRows.push({
    kind: 'News',
    slug: s,
    locale: 'vi',
    issue: 'Missing VI translation (EN-only slug)',
    severity: 'P1',
    fix: 'Owner provide VI or accept EN fallback',
    unlock: 'OWNER',
  });
}
for (const s of missingEn) {
  issueRows.push({
    kind: 'News',
    slug: s,
    locale: 'en',
    issue: 'Missing EN translation (VI-only slug)',
    severity: 'P1',
    fix: 'Add EN',
    unlock: 'OWNER',
  });
}

const inventory = `| Loại | EN | VI | Tổng | Published* | Draft* | Thiếu locale |
|------|---:|---:|-----:|-----------:|-------:|-------------:|
| News | ${newsEnList.length} | ${newsViList.length} | ${new Set([...enSlugs, ...viSlugs]).size} | ${newsEnList.length} (public API) | n/a (public) | VI thiếu: ${missingVi.length} |
| Fixed Price | ${fpList.length} | n/a (API seed) | ${fpList.length} | ${fpList.length} | — | — |
| Destination | ${destList.length} | (same list / locale param) | ${destList.length} | ${destList.length} | — | audit body |
| Jet Card | ${jcList.length} | n/a | ${jcList.length} | ${jcList.length} | — | — |
| Travel Credit | ${tcList.length} | n/a | ${tcList.length} | ${tcList.length} | — | — |
| Empty Leg (ref) | ${elList.length} | — | ${elList.length} | ${elList.length} | — | — |

\\* Public catalog endpoints do not expose draft counts; Admin draft requires JWT (see W2-09).`;

const issueTable = [
  '| Loại | Slug/ID | Locale | Vấn đề | Severity | Cách xử lý | Unlock |',
  '| --- | --- | --- | --- | --- | --- | --- |',
  ...issueRows.map(
    (r) =>
      `| ${r.kind} | ${r.slug} | ${r.locale} | ${r.issue} | ${r.severity} | ${r.fix} | ${r.unlock} |`,
  ),
].join('\n');

const md = `# CMS Inventory & Locale Audit — ${when.slice(0, 10)}

> Wave 2 (W2-01 / W2-02) · Generated by \`scripts/cms-inventory-audit.mjs\`  
> **Source:** \`GET\` public API \`${BASE}\` · X-API-Key · checked ${when}  
> Endpoints: \`/content/news?locale=\`, \`/fixed-price/routes\`, \`/content/destinations\`, \`/jet-card/plans\`, \`/travel-credits/packages\`, \`/empty-legs\`

## Inventory

${inventory}

### HTTP probe
- news EN: ${stEn} · news VI: ${stVi}

## Locale / placeholder checklist

${issueTable || '_No automated issues._'}

## Residual Owner content (W2-04/05)

| Item | Status |
|------|--------|
| News ≥3–5 real articles | **PENDING OWNER** — current EN public n=${newsEnList.length} |
| Do not invent commercial copy | Active rule |
| Template | [CMS_NEWS_TEMPLATE.md](../CMS_NEWS_TEMPLATE.md) |
| Publish workflow | Admin → Content/Articles → draft → publish → verify web |

## Notes

- Fixed Price / Jet Card / Travel Credit are primarily **seed/API catalog** — EN labels; VI may be FE i18n overlay, not separate DB rows.
- Destination list count=${destList.length}; per-locale bodies need Admin review for VI.
`;

mkdirSync('docs/reviews', { recursive: true });
const out = resolve(`docs/reviews/CMS_INVENTORY_${day}.md`);
writeFileSync(out, md);
console.log('Wrote', out);
console.log('News EN', newsEnList.length, 'VI', newsViList.length, 'FP', fpList.length, 'Dest', destList.length, 'JC', jcList.length, 'TC', tcList.length);
console.log('Issues', issueRows.length);
