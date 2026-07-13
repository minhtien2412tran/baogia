import fs from 'fs';
import path from 'path';

const files = [
  'packages/i18n/src/messages.ts',
  'packages/i18n/src/nav-catalog.ts',
  'packages/i18n/src/pages-i18n.ts',
  'apps/web/src/lib/page-content.ts',
  'apps/web/src/lib/about-us-default.ts',
  'apps/web/src/lib/booking-process-default.ts',
  'apps/web/src/lib/service-page.ts',
  'apps/web/src/config/navigation.ts',
  'apps/web/src/config/jetbay-cdn.ts',
  'apps/web/src/components/layout/ServicePage.tsx',
  'apps/web/src/components/layout/JetCardComparison.tsx',
  'apps/web/src/components/partner/PartnerProgramsSection.tsx',
  'apps/web/src/components/home/JetCardHomeSection.tsx',
  'apps/web/src/components/home/WhySections.tsx',
  'apps/web/src/components/home/SosSection.tsx',
  'apps/web/src/components/home/PartnerSection.tsx',
  'apps/web/src/components/home/AppDownloadSection.tsx',
  'apps/web/src/app/[locale]/jet-card/page.tsx',
  'apps/web/src/app/[locale]/booking-process/page.tsx',
  'apps/web/src/app/[locale]/video-centre/page.tsx',
  'apps/web/src/app/[locale]/about-us/page.tsx',
];

function transform(s) {
  return s
    .replace(/JetBay Inc\./gi, 'JetVina')
    .replace(/JetBay SOS/gi, 'Air Ambulance')
    .replace(/The JetBay Jet Card/gi, 'Private Jet Membership')
    .replace(/JetBay Jet Card/gi, 'Private Jet Membership')
    .replace(/JetBay Private Jet App/gi, 'Private Jet App')
    .replace(/Ứng dụng JetBay Private Jet/g, 'Ứng dụng Private Jet')
    .replace(/About JetBay/gi, 'About JetVina')
    .replace(/Về JetBay/g, 'Về JetVina')
    .replace(/关于JetBay/g, '关于JetVina')
    .replace(/關於JetBay/g, '關於JetVina')
    .replace(/with JetBay/gi, 'with JetVina')
    .replace(/from JetBay/gi, 'from JetVina')
    .replace(/by JetBay/gi, 'by JetVina')
    .replace(/choose JetBay/gi, 'choose JetVina')
    .replace(/Charter with JetBay/gi, 'Charter with JetVina')
    .replace(/Fly Anywhere with JetBay/gi, 'Fly Anywhere with JetVina')
    .replace(/Explore the World with JetBay/gi, 'Explore the World with JetVina')
    .replace(/Khám phá thế giới cùng JetBay/g, 'Khám phá thế giới cùng JetVina')
    .replace(/与 JetBay 探索世界/g, '与 JetVina 探索世界')
    .replace(/與 JetBay 探索世界/g, '與 JetVina 探索世界')
    .replace(/JetBay/g, 'JetVina')
    .replace(/Access to 10,000\+ Aircraft/gi, 'Global Private Aviation Access')
    .replace(/接入10,000\+飞机/g, '全球私人航空服务')
    .replace(/接入10,000\+飛機/g, '全球私人航空服務')
    .replace(/10,000\+ aircraft/gi, 'a global aircraft network')
    .replace(/10,000\+架飞机/g, '全球机队网络')
    .replace(/10,000\+架飛機/g, '全球機隊網絡')
    .replace(/10,000\+ Jets/gi, 'Global fleet access')
    .replace(/10,000\+/g, '');
}

for (const f of files) {
  const p = path.join(process.cwd(), f);
  if (!fs.existsSync(p)) {
    console.log('skip missing', f);
    continue;
  }
  const before = fs.readFileSync(p, 'utf8');
  let after = transform(before);
  // Never rewrite package names or asset roots
  after = after.replace(/@jetvina\//g, '@jetbay/');
  after = after.replace(/jetvina-cdn/g, 'jetbay-cdn');
  after = after.replace(/jetvinaImg/g, 'jetbayImg');
  after = after.replace(/\/assets\/jetvina\//g, '/assets/jetbay/');
  after = after.replace(/jetvina-private-jet-app/g, 'jetbay-private-jet-app');
  if (after !== before) {
    fs.writeFileSync(p, after);
    console.log('updated', f);
  } else {
    console.log('unchanged', f);
  }
}
