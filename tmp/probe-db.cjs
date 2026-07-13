const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const envPath = path.join(__dirname, '../apps/api/.env');
const text = fs.readFileSync(envPath, 'utf8');
for (const line of text.split(/\r?\n/)) {
  const m = line.match(/^DATABASE_URL=(.*)$/);
  if (!m) continue;
  let v = m[1].trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  process.env.DATABASE_URL = v;
}

const u = process.env.DATABASE_URL;
if (!u) {
  console.error('NO_DATABASE_URL');
  process.exit(1);
}
console.log('using', u.replace(/:\/\/[^@]+@/, '://***:***@'));

(async () => {
  const c = new Client({ connectionString: u });
  await c.connect();
  const r = await c.query(
    'SELECT current_database() as db, current_user as usr, (SELECT count(*)::int FROM information_schema.tables WHERE table_schema = $1) as tables',
    ['public'],
  );
  console.log(JSON.stringify(r.rows[0]));
  const dbs = await c.query(
    'SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY 1',
  );
  console.log('dbs', dbs.rows.map((x) => x.datname).join(','));
  await c.end();
})().catch((e) => {
  console.error('ERR', e.message);
  process.exit(1);
});
