import * as fs from 'fs';
import * as path from 'path';

const root = path.resolve(__dirname, '../../..');

const FORBIDDEN = [
  /\bJetBay\b/,
  /JetBay Inc\./i,
  /JetBay SOS/i,
  /Travel Credits/i,
  /jetbay\.com/i,
  /instagram\.com\/jetbay/i,
  /facebook\.com\/jetbay/i,
];

const ALLOW_LINES = [
  /console\.log\('Seeding Travel Credits/,
  /JetBay Asia Ops/,
  /JetBay Asia Operations/,
  /@jetbay\.local/,
  /jetbay_db/,
];

describe('public CMS seed / defaults branding', () => {
  it('constants about-us / booking-process have no JetBay public copy', () => {
    for (const rel of [
      'apps/api/src/constants/about-us-cms.ts',
      'apps/api/src/constants/booking-process-cms.ts',
    ]) {
      const text = fs.readFileSync(path.join(root, rel), 'utf8');
      for (const re of FORBIDDEN) {
        expect(re.test(text)).toBe(false);
      }
    }
  });

  it('seed.ts public CMS strings have no JetBay (ops fixture names allowlisted)', () => {
    const text = fs.readFileSync(path.join(root, 'apps/api/prisma/seed.ts'), 'utf8');
    const lines = text.split(/\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      if (ALLOW_LINES.some((r) => r.test(line))) continue;
      for (const re of FORBIDDEN) {
        expect(re.test(line)).toBe(false);
      }
    }
  });
});
