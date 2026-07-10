#!/usr/bin/env node
/**
 * Normalize ContentTranslation.locale values to DB canonical codes.
 * Usage: DATABASE_URL=... node scripts/i18n/normalize-db-locales.mjs
 */
import pg from 'pg';

const MAP = {
  'en-us': 'en',
  'en-gb': 'en',
  en: 'en',
  'zh-hans': 'zh-cn',
  'zh-hant': 'zh-tw',
  'zh-hant-hk': 'zh-hk',
  'zh-hant-tw': 'zh-tw',
  zh: 'zh-cn',
  'vi-vn': 'vi',
};

function normalize(raw) {
  const k = String(raw ?? '').trim().toLowerCase();
  return MAP[k] ?? k;
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('Set DATABASE_URL');
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });
await client.connect();

const { rows } = await client.query(
  `SELECT id, "entityType", "entityId", locale FROM "ContentTranslation" ORDER BY id`,
);

let updated = 0;
let skipped = 0;

for (const row of rows) {
  const next = normalize(row.locale);
  if (next === row.locale) {
    skipped++;
    continue;
  }
  const conflict = await client.query(
    `SELECT id FROM "ContentTranslation" WHERE "entityType"=$1 AND "entityId"=$2 AND locale=$3 AND id<>$4`,
    [row.entityType, row.entityId, next, row.id],
  );
  if (conflict.rows.length > 0) {
    console.warn(`Skip id=${row.id}: target locale ${next} already exists for ${row.entityType}#${row.entityId}`);
    continue;
  }
  await client.query(`UPDATE "ContentTranslation" SET locale=$1 WHERE id=$2`, [next, row.id]);
  console.log(`id=${row.id}: ${row.locale} → ${next}`);
  updated++;
}

console.log(`Done. updated=${updated} skipped=${skipped} total=${rows.length}`);
await client.end();
