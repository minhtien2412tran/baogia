import fs from 'fs';

const files = [
  'apps/web/src/app/[locale]/account/quotes/page.tsx',
  'apps/web/src/app/[locale]/account/documents/page.tsx',
  'apps/web/src/app/[locale]/account/payments/page.tsx',
  'apps/web/src/app/[locale]/account/jet-card/page.tsx',
  'apps/web/src/app/[locale]/account/travel-credits/page.tsx',
];

for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;
  if (!s.includes("from 'react'")) {
    s = s.replace("'use client';\n\n", "'use client';\n\nimport { use } from 'react';\n");
  } else if (!/\buse\b/.test(s.match(/import \{([^}]+)\} from 'react'/)?.[1] ?? '')) {
    s = s.replace(/import \{([^}]+)\} from 'react'/, (_m, g) => `import { use, ${g.trim()} } from 'react'`);
  }
  s = s.replace(/params: \{ locale: string \}/g, 'params: Promise<{ locale: string }>');
  s = s.replace(
    /const locale = params\?\.locale \?\? 'en-us';/g,
    "const { locale: loc } = use(params);\n  const locale = loc ?? 'en-us';",
  );
  if (f.includes('quotes') && s.includes("import Link") && !s.includes('<Link')) {
    s = s.replace(/import Link from 'next\/link';\n/, '');
  }
  if (s !== before) {
    fs.writeFileSync(f, s);
    console.log('fixed', f);
  } else {
    console.log('skip', f);
  }
}
