import fs from 'node:fs';
import path from 'node:path';

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (p.endsWith('.tsx')) acc.push(p);
  }
  return acc;
}

for (const f of walk('apps/admin/src/app/dashboard')) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;
  // load useCallback missing remove/review — add dep when function exists later in file
  if (/async function remove\(/.test(s) && /const load = useCallback\(/.test(s)) {
    s = s.replace(
      /(const load = useCallback\([\s\S]*?)\}, \[\]\);/,
      (m, body) => {
        if (!body.includes('remove(') && !body.includes('remove)')) return m;
        return `${body}}, [remove]);`;
      },
    );
  }
  if (/async function review\(/.test(s) && /const load = useCallback\(/.test(s)) {
    s = s.replace(
      /(const load = useCallback\([\s\S]*?)\}, \[\]\);/,
      (m, body) => {
        if (!body.includes('review(')) return m;
        return `${body}}, [review]);`;
      },
    );
  }
  if (s !== before) {
    fs.writeFileSync(f, s);
    console.log('deps', f);
  }
}
