import fs from 'node:fs';
import path from 'node:path';

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(tsx|ts)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const root = path.resolve('apps/admin/src');
const files = walk(root);
let n = 0;

for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;
  if (!/useEffect\(\(\) => \{[\s\S]*?(load|loadJobs)\(\);/.test(s)) continue;

  const rel = path.relative(path.dirname(f), path.join(root, 'lib/browser')).replace(/\\/g, '/');
  const imp = (rel.startsWith('.') ? rel : `./${rel}`).replace(/\.ts$/, '');

  if (!s.includes("from '../lib/browser'") && !s.includes("from '../../lib/browser'") && !s.includes("from '../../../lib/browser'") && !s.includes("from '../../../../lib/browser'")) {
    if (s.includes("from 'react'")) {
      s = s.replace(/from 'react';/, (m) => `${m}\nimport { scheduleUi } from '${imp}';`);
    } else if (s.includes('from "react"')) {
      s = s.replace(/from "react";/, (m) => `${m}\nimport { scheduleUi } from '${imp}';`);
    }
  }

  s = s.replace(
    /useEffect\(\(\) => \{\s*\n(\s*)(load|loadJobs)\(\);\s*\n(\s*)\}, \[([^\]]*)\]\);/g,
    (_m, ind, fn, ind2, deps) =>
      `useEffect(() => {\n${ind}scheduleUi(() => {\n${ind}  void ${fn}();\n${ind}});\n${ind2}}, [${deps}]);`,
  );

  if (s !== before) {
    fs.writeFileSync(f, s);
    n++;
    console.log('patched', path.relative(process.cwd(), f));
  }
}
console.log('files', n);
