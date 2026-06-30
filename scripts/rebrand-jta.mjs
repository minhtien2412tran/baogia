import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_SRC = path.join(__dirname, '../apps/web/src');

const REPLACEMENTS = [
  [/JETBAY/g, 'J-TA'],
  [/Jetbay/g, 'J-TA'],
];

const SKIP_FILES = ['jetbay-cdn.ts', 'jetbay-home.css', 'jetbay-polish.css'];

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory() && ent.name !== 'node_modules') walk(full, files);
    else if (/\.(tsx?|css)$/.test(ent.name)) files.push(full);
  }
  return files;
}

let changed = 0;
for (const file of walk(WEB_SRC)) {
  if (SKIP_FILES.some((s) => file.endsWith(s))) continue;
  const src = fs.readFileSync(file, 'utf8');
  let next = src;
  for (const [re, rep] of REPLACEMENTS) next = next.replace(re, rep);
  if (next !== src) {
    fs.writeFileSync(file, next);
    changed++;
  }
}
console.log('Rebranded', changed, 'files under apps/web/src');
