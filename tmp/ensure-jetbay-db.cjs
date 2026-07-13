const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

function loadDatabaseUrl() {
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
    return v;
  }
  return null;
}

function withDb(url, dbName) {
  const u = new URL(url);
  u.pathname = `/${dbName}`;
  return u.toString();
}

(async () => {
  const base = loadDatabaseUrl();
  if (!base) throw new Error('NO_DATABASE_URL');
  const admin = new Client({ connectionString: withDb(base, 'postgres') });
  await admin.connect();
  const exists = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [
    'jetbay_db',
  ]);
  if (!exists.rowCount) {
    await admin.query('CREATE DATABASE jetbay_db');
    console.log('created jetbay_db');
  } else {
    console.log('jetbay_db already exists');
  }
  await admin.end();

  const envPath = path.join(__dirname, '../apps/api/.env');
  let text = fs.readFileSync(envPath, 'utf8');
  const next = text.replace(
    /^(DATABASE_URL=.*)$/m,
    (line) => {
      const m = line.match(/^DATABASE_URL=(.*)$/);
      let v = m[1].trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      const nu = withDb(v, 'jetbay_db');
      const quoted = m[1].trim().startsWith('"') ? `"${nu}"` : nu;
      return `DATABASE_URL=${quoted}`;
    },
  );
  if (next !== text) {
    const bak = `${envPath}.bak.jetbay-switch.${Date.now()}`;
    fs.copyFileSync(envPath, bak);
    fs.writeFileSync(envPath, next);
    console.log('switched DATABASE_URL to jetbay_db (backup created, path not printed)');
  } else {
    console.log('DATABASE_URL already jetbay_db');
  }

  const c = new Client({ connectionString: withDb(base, 'jetbay_db') });
  await c.connect();
  const r = await c.query(
    'SELECT current_database() as db, current_user as usr, (SELECT count(*)::int FROM information_schema.tables WHERE table_schema = $1) as tables',
    ['public'],
  );
  console.log(JSON.stringify(r.rows[0]));
  await c.end();
})().catch((e) => {
  console.error('ERR', e.message);
  process.exit(1);
});
