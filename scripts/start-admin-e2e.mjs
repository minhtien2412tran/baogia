import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const apiEnv = Object.fromEntries(
  fs
    .readFileSync(path.join(root, 'apps/api/.env'), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [
        l.slice(0, i).trim(),
        l
          .slice(i + 1)
          .trim()
          .replace(/^["']|["']$/g, ''),
      ];
    }),
);

const env = {
  ...process.env,
  NEXT_PUBLIC_API_URL: 'http://127.0.0.1:4000',
  NEXT_PUBLIC_API_KEY: apiEnv.API_KEY || '',
};

console.log(
  'Building admin with local API URL; key length',
  env.NEXT_PUBLIC_API_KEY.length,
);
const build = spawnSync(
  'pnpm',
  ['--filter', '@jetbay/admin', 'exec', 'next', 'build'],
  { cwd: root, env, stdio: 'inherit', shell: true },
);
if (build.status !== 0) process.exit(build.status || 1);

const start = spawnSync(
  'pnpm',
  ['--filter', '@jetbay/admin', 'exec', 'next', 'start', '-p', '3011'],
  { cwd: root, env, stdio: 'inherit', shell: true },
);
process.exit(start.status || 0);
