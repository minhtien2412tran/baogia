#!/usr/bin/env node
/**
 * JetBay / JetVina — i18n coverage audit
 *
 * Checks:
 *  1) Message catalog key parity (shell t()) across DB locales
 *  2) Nav catalog key parity (tn())
 *  3) Service page overlay coverage (getPageOverlay)
 *  4) Optional live HTML probe: SAMPLE_STRINGS must NOT appear English-only
 *     when locale expects localization (and EN pages must stay English)
 *
 * Usage:
 *   node scripts/audit-i18n-coverage.mjs
 *   node scripts/audit-i18n-coverage.mjs --live https://www.minhtien.online
 *   node scripts/audit-i18n-coverage.mjs --strict
 *
 * Exit 0 = PASS (or WARN-only). Exit 1 = FAIL when --strict or critical failures.
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const require = createRequire(path.join(root, 'packages/i18n/package.json'));

const args = process.argv.slice(2);
const liveBase = (() => {
  const i = args.indexOf('--live');
  if (i >= 0) return (args[i + 1] || 'https://www.minhtien.online').replace(/\/$/, '');
  return null;
})();
const strict = args.includes('--strict');

/** @type {{ level: 'FAIL'|'WARN'|'PASS'|'INFO'; code: string; detail: string }[]} */
const findings = [];

function note(level, code, detail) {
  findings.push({ level, code, detail });
}

async function loadI18n() {
  try {
    return require(path.join(root, 'packages/i18n/dist/index.js'));
  } catch {
    note('FAIL', 'I18N_DIST', 'packages/i18n/dist missing — run: pnpm --filter @jetbay/i18n build');
    return null;
  }
}

function catalogKeys(catalog) {
  return Object.keys(catalog).sort();
}

function diffKeys(baseKeys, otherKeys) {
  const b = new Set(baseKeys);
  const o = new Set(otherKeys);
  return {
    missing: baseKeys.filter((k) => !o.has(k)),
    extra: otherKeys.filter((k) => !b.has(k)),
  };
}

/** Probe English marketing strings that must localize OR be gated */
const SERVICE_PAGES = [
  'private-jet-charter',
  'corporate-air-charter',
  'group-air-charter',
  'event-air-charter',
  'pet-travel',
  'air-ambulance',
  'booking-process',
  'global-partnership-program',
  'jetbay-private-jet-app',
  'world-cup-2026-private-jet-booking',
  'world-cup-final-2026-private-jet-charter',
];

const LIVE_PATHS = [
  { path: '/private-jet-charter', mustHaveEn: ['Private Jets for Every Need', 'Search Available Aircraft'] },
  { path: '/', mustHaveEn: ['Search Available Aircraft'] },
];

/** Strings that indicate Chrome-mangled or wrong-locale leakage */
const BAD_VI_MARKERS = ['Hiến chương', 'Tiếng Anh (Mỹ)'];

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en-US,en;q=0.8', 'User-Agent': 'jetbay-i18n-audit/1.0' },
    redirect: 'follow',
  });
  const text = await res.text();
  return { status: res.status, text };
}

async function main() {
  const i18n = await loadI18n();
  if (!i18n) {
    printReport();
    process.exit(1);
  }

  const {
    WEB_LOCALES,
    DB_LOCALES,
    toDbLocale,
    t,
    tn,
    getPageOverlay,
    PRODUCT_UI_BY_LANG,
  } = i18n;

  note('INFO', 'LOCALES', `web=${WEB_LOCALES.length} db=${DB_LOCALES.length}`);

  // --- Shell message key parity via probing known keys from en ---
  const probeShell = [
    'login',
    'register',
    'contactUs',
    'searchAircraft',
    'oneWay',
    'roundTrip',
    'multiCity',
    'from',
    'to',
    'departure',
    'passengers',
    'heroTitle',
  ];
  const probeNav = [
    'navCharter',
    'navDeals',
    'navMembership',
    'navDestinations',
    'more',
    'privateJetCharter',
    'home',
    'selectLanguage',
    'cookieConsent',
    'acceptCookies',
    'managePreferences',
  ];

  for (const loc of WEB_LOCALES) {
    const db = toDbLocale(loc);
    let shellLocal = 0;
    let shellEn = 0;
    for (const k of probeShell) {
      const v = t(loc, k);
      const en = t('en-us', k);
      if (!v || v === k) note('FAIL', 'SHELL_MISSING', `${loc}/${k}`);
      else if (db !== 'en' && v === en) shellEn += 1;
      else if (db !== 'en') shellLocal += 1;
    }
    let navLocal = 0;
    let navEn = 0;
    for (const k of probeNav) {
      const v = tn(loc, k);
      const en = tn('en-us', k);
      if (!v || v === k) note('FAIL', 'NAV_MISSING', `${loc}/${k}`);
      else if (db !== 'en' && v === en) navEn += 1;
      else if (db !== 'en') navLocal += 1;
    }
    if (db !== 'en') {
      if (shellEn > 0)
        note('WARN', 'SHELL_PARTIAL_EN', `${loc}: ${shellEn}/${probeShell.length} probe keys still English`);
      if (navEn > 0)
        note('WARN', 'NAV_PARTIAL_EN', `${loc}: ${navEn}/${probeNav.length} nav keys still English`);
      if (shellLocal === probeShell.length && navLocal === probeNav.length)
        note('PASS', 'SHELL_NAV_OK', `${loc} shell+nav localized (probe)`);
    } else {
      note('PASS', 'EN_BASE', `${loc} is English base`);
    }

    // Page overlays
    let overlayHit = 0;
    for (const page of SERVICE_PAGES) {
      if (getPageOverlay(page, loc)) overlayHit += 1;
    }
    if (db === 'en') {
      if (overlayHit !== 0) note('WARN', 'EN_HAS_OVERLAY', `${loc} unexpected overlays=${overlayHit}`);
      else note('PASS', 'EN_NO_OVERLAY', `${loc} uses English PAGE_CONTENT base`);
    } else if (overlayHit === 0) {
      note('WARN', 'PAGE_OVERLAY_NONE', `${loc}: 0/${SERVICE_PAGES.length} service pages have text overlays → hero/title stay English`);
    } else if (overlayHit < SERVICE_PAGES.length) {
      note(
        'WARN',
        'PAGE_OVERLAY_PARTIAL',
        `${loc}: ${overlayHit}/${SERVICE_PAGES.length} service pages overlaid (missing: ${SERVICE_PAGES.filter((p) => !getPageOverlay(p, loc)).join(', ')})`,
      );
    } else {
      note('PASS', 'PAGE_OVERLAY_FULL', `${loc}: all ${SERVICE_PAGES.length} service page overlays present`);
    }

    // Product UI tourism pack
    if (PRODUCT_UI_BY_LANG && db !== 'en' && db !== 'vi' && db !== 'zh-cn' && db !== 'zh-hk' && db !== 'zh-tw') {
      const pack = PRODUCT_UI_BY_LANG[db];
      if (!pack) note('WARN', 'PRODUCT_UI_MISSING', `${loc} (db=${db}) no PRODUCT_UI_BY_LANG pack`);
      else note('PASS', 'PRODUCT_UI_OK', `${loc} product UI pack keys=${Object.keys(pack).length}`);
    }
  }

  // Hardcoded English surfaces (static knowledge from audit — fail if file still contains markers)
  const fs = await import('node:fs');
  const hardcodedFiles = [
    {
      file: 'apps/web/src/components/layout/ServicePage.tsx',
      needles: ['Global Private Air Charter Service, Simplified.', 'Private Jet Promotion'],
    },
    {
      file: 'apps/web/src/components/home/WhySections.tsx',
      needles: ['Why Charter with JetVina?', 'Learn More About JetVina'],
    },
    {
      file: 'apps/web/src/components/home/StatsSection.tsx',
      needles: ['A leading global private jet charter platform'],
    },
  ];
  for (const h of hardcodedFiles) {
    const abs = path.join(root, h.file);
    if (!fs.existsSync(abs)) {
      note('WARN', 'HARDCODE_FILE_MISSING', h.file);
      continue;
    }
    const body = fs.readFileSync(abs, 'utf8');
    const hits = h.needles.filter((n) => body.includes(n));
    if (hits.length)
      note('FAIL', 'HARDCODED_EN_UI', `${h.file}: still has EN literals → ${hits.join(' | ')}`);
    else note('PASS', 'HARDCODED_CLEARED', h.file);
  }

  // Live probes
  if (liveBase) {
    note('INFO', 'LIVE', `probing ${liveBase}`);
    for (const loc of ['en-us', 'vi', 'zh-cn', 'ja']) {
      for (const route of LIVE_PATHS) {
        const url = `${liveBase}/${loc}${route.path}`;
        try {
          const { status, text } = await fetchText(url);
          if (status !== 200) {
            note('FAIL', 'LIVE_HTTP', `${url} → ${status}`);
            continue;
          }
          for (const bad of BAD_VI_MARKERS) {
            if (text.includes(bad))
              note('FAIL', 'LIVE_BAD_MARKER', `${url} contains auto-translate marker "${bad}"`);
          }
          if (loc === 'en-us') {
            for (const must of route.mustHaveEn) {
              if (!text.includes(must))
                note('FAIL', 'LIVE_EN_MISSING', `${url} missing "${must}"`);
              else note('PASS', 'LIVE_EN_OK', `${url} has "${must}"`);
            }
            if (!/translate="no"/.test(text) && !/notranslate/.test(text))
              note('WARN', 'LIVE_TRANSLATE_ATTR', `${url} missing translate=no / notranslate`);
            else note('PASS', 'LIVE_TRANSLATE_ATTR', `${url} has anti-auto-translate attrs`);
            if (!/lang="en-US"/.test(text) && !/lang="en"/.test(text))
              note('WARN', 'LIVE_LANG_ATTR', `${url} unexpected html lang`);
          }
          if (loc === 'vi') {
            // Prefer Vietnamese shell strings
            if (text.includes('Tìm máy bay') || text.includes('Một chiều') || text.includes('Thuê chuyến'))
              note('PASS', 'LIVE_VI_SHELL', `${url} Vietnamese shell strings present`);
            else
              note('WARN', 'LIVE_VI_SHELL', `${url} expected VI shell strings not found (SSR/client split?)`);
            // Hardcoded EN sections may still appear on service pages
            if (route.path.includes('private-jet-charter') && text.includes('Global Private Air Charter Service, Simplified.'))
              note('FAIL', 'LIVE_VI_HARDCODE_EN', `${url} still shows hardcoded EN section title`);
          }
        } catch (e) {
          note('FAIL', 'LIVE_FETCH', `${url}: ${e instanceof Error ? e.message : e}`);
        }
      }
    }
  } else {
    note('INFO', 'LIVE_SKIP', 'Pass --live https://www.minhtien.online to probe production HTML');
  }

  printReport();
  const fails = findings.filter((f) => f.level === 'FAIL');
  const warns = findings.filter((f) => f.level === 'WARN');
  if (fails.length) process.exit(1);
  if (strict && warns.length) process.exit(1);
  process.exit(0);
}

function printReport() {
  const by = { FAIL: 0, WARN: 0, PASS: 0, INFO: 0 };
  for (const f of findings) {
    by[f.level] += 1;
    const tag = f.level.padEnd(4);
    console.log(`${tag}  ${f.code.padEnd(22)}  ${f.detail}`);
  }
  console.log('---');
  console.log(
    JSON.stringify(
      {
        fail: by.FAIL,
        warn: by.WARN,
        pass: by.PASS,
        info: by.INFO,
        strict,
        live: Boolean(liveBase),
        ok: by.FAIL === 0 && (!strict || by.WARN === 0),
        verdict:
          by.FAIL > 0
            ? 'NOT_100_PERCENT — critical gaps'
            : by.WARN > 0
              ? 'PARTIAL — shell ok, content/hardcode gaps remain'
              : 'PASS',
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
