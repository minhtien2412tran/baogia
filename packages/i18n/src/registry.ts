/**
 * JetBay i18n — single source of truth for locale codes.
 *
 * Canonical DB locale: `en` (English master content).
 * Web routes use richer codes (`en-us`, `zh-cn`, `ja`, …) mapped via toDbLocale().
 */

/** Language stored in ContentTranslation.locale and business records */
export const CANONICAL_LOCALE = 'en' as const;

/**
 * Normalized locales allowed in DB/API.
 * Tourism markets: ja/ko/th/id + EU (fr/de/es/it/ru) + ar (Gulf/MENA).
 */
export const DB_LOCALES = [
  'en',
  'zh-cn',
  'zh-hk',
  'zh-tw',
  'vi',
  'ja',
  'ko',
  'th',
  'id',
  'fr',
  'de',
  'es',
  'it',
  'ru',
  'ar',
] as const;
export type DbLocale = (typeof DB_LOCALES)[number];

/** Next.js [locale] segment codes */
export const WEB_LOCALES = [
  'en-us',
  'en',
  'zh-cn',
  'zh-hk',
  'zh-tw',
  'vi',
  'ja',
  'ko',
  'th',
  'id',
  'fr',
  'de',
  'es',
  'it',
  'ru',
  'ar',
] as const;
export type WebLocale = (typeof WEB_LOCALES)[number];

export type WebLocaleConfig = {
  code: WebLocale;
  label: string;
  htmlLang: string;
  currency: string;
  dbLocale: DbLocale;
};

export const WEB_LOCALE_CONFIG: WebLocaleConfig[] = [
  { code: 'en-us', label: 'English (US)', htmlLang: 'en-US', currency: 'USD', dbLocale: 'en' },
  { code: 'en', label: 'English', htmlLang: 'en', currency: 'USD', dbLocale: 'en' },
  { code: 'zh-cn', label: '简体中文', htmlLang: 'zh-CN', currency: 'CNY', dbLocale: 'zh-cn' },
  { code: 'zh-hk', label: '繁體中文 (HK)', htmlLang: 'zh-HK', currency: 'HKD', dbLocale: 'zh-hk' },
  { code: 'zh-tw', label: '繁體中文 (TW)', htmlLang: 'zh-TW', currency: 'TWD', dbLocale: 'zh-tw' },
  { code: 'vi', label: 'Tiếng Việt', htmlLang: 'vi', currency: 'USD', dbLocale: 'vi' },
  { code: 'ja', label: '日本語', htmlLang: 'ja', currency: 'JPY', dbLocale: 'ja' },
  { code: 'ko', label: '한국어', htmlLang: 'ko', currency: 'KRW', dbLocale: 'ko' },
  { code: 'th', label: 'ไทย', htmlLang: 'th', currency: 'THB', dbLocale: 'th' },
  { code: 'id', label: 'Bahasa Indonesia', htmlLang: 'id', currency: 'IDR', dbLocale: 'id' },
  { code: 'fr', label: 'Français', htmlLang: 'fr', currency: 'EUR', dbLocale: 'fr' },
  { code: 'de', label: 'Deutsch', htmlLang: 'de', currency: 'EUR', dbLocale: 'de' },
  { code: 'es', label: 'Español', htmlLang: 'es', currency: 'EUR', dbLocale: 'es' },
  { code: 'it', label: 'Italiano', htmlLang: 'it', currency: 'EUR', dbLocale: 'it' },
  { code: 'ru', label: 'Русский', htmlLang: 'ru', currency: 'EUR', dbLocale: 'ru' },
  { code: 'ar', label: 'العربية', htmlLang: 'ar', currency: 'AED', dbLocale: 'ar' },
];

export const DEFAULT_WEB_LOCALE: WebLocale = 'en-us';

const WEB_SET = new Set<string>(WEB_LOCALES);
const DB_SET = new Set<string>(DB_LOCALES);

/** Web → DB (forward). `en-us` / `en` → `en` */
export function toDbLocale(input?: string | null): DbLocale {
  const raw = (input ?? '').trim().toLowerCase();
  if (!raw) return CANONICAL_LOCALE;

  if (raw === 'en-us' || raw === 'en-gb' || raw === 'en') return 'en';
  if (raw === 'zh-cn' || raw === 'zh-hans') return 'zh-cn';
  if (raw === 'zh-hk' || raw === 'zh-hant-hk') return 'zh-hk';
  if (raw === 'zh-tw' || raw === 'zh-hant' || raw === 'zh-hant-tw') return 'zh-tw';
  if (raw === 'vi' || raw === 'vi-vn') return 'vi';
  if (raw === 'ja' || raw === 'ja-jp') return 'ja';
  if (raw === 'ko' || raw === 'ko-kr') return 'ko';
  if (raw === 'th' || raw === 'th-th') return 'th';
  if (raw === 'id' || raw === 'id-id' || raw === 'in') return 'id';
  if (raw === 'fr' || raw.startsWith('fr-')) return 'fr';
  if (raw === 'de' || raw.startsWith('de-')) return 'de';
  if (raw === 'es' || raw.startsWith('es-')) return 'es';
  if (raw === 'it' || raw.startsWith('it-')) return 'it';
  if (raw === 'ru' || raw.startsWith('ru-')) return 'ru';
  if (raw === 'ar' || raw.startsWith('ar-')) return 'ar';

  // Legacy: bare `zh` → simplified
  if (raw === 'zh') return 'zh-cn';

  if (DB_SET.has(raw)) return raw as DbLocale;
  const base = raw.split('-')[0];
  if (base && DB_SET.has(base)) return base as DbLocale;
  if (base === 'en') return 'en';
  if (base === 'zh') return 'zh-cn';

  return CANONICAL_LOCALE;
}

/** DB → default web route (reverse i18n for links) */
export function toDefaultWebLocale(dbLocale: string): WebLocale {
  const db = toDbLocale(dbLocale);
  const match = WEB_LOCALE_CONFIG.find((l) => l.dbLocale === db);
  return match?.code ?? DEFAULT_WEB_LOCALE;
}

/** All web locale codes that map to the same DB row */
export function webLocalesForDb(dbLocale: string): WebLocale[] {
  const db = toDbLocale(dbLocale);
  return WEB_LOCALE_CONFIG.filter((l) => l.dbLocale === db).map((l) => l.code);
}

export function isValidWebLocale(code: string): code is WebLocale {
  return WEB_SET.has(code);
}

export function isValidDbLocale(code: string): code is DbLocale {
  const raw = code.trim().toLowerCase();
  return DB_SET.has(raw);
}

/**
 * Fallback chain when reading translations: requested → regional zh → canonical en.
 */
export function resolveLocaleFallbackChain(input?: string | null): DbLocale[] {
  const primary = toDbLocale(input);
  const chain: DbLocale[] = [primary];

  if (primary === 'zh-tw' && !chain.includes('zh-hk')) chain.push('zh-hk');
  if ((primary === 'zh-tw' || primary === 'zh-hk') && !chain.includes('zh-cn')) chain.push('zh-cn');
  if (primary !== CANONICAL_LOCALE) chain.push(CANONICAL_LOCALE);

  return [...new Set(chain)];
}

export function getWebLocaleConfig(code: string): WebLocaleConfig {
  return WEB_LOCALE_CONFIG.find((l) => l.code === code) ?? WEB_LOCALE_CONFIG[0];
}

/** Parse Accept-Language / cookie to a valid web locale */
export function detectWebLocale(acceptLanguage?: string | null, cookieLocale?: string | null): WebLocale {
  if (cookieLocale && isValidWebLocale(cookieLocale)) return cookieLocale;

  if (acceptLanguage) {
    const parts = acceptLanguage.split(',').map((p) => p.trim().split(';')[0]?.toLowerCase()).filter(Boolean);
    for (const part of parts) {
      if (isValidWebLocale(part!)) return part as WebLocale;
      const db = toDbLocale(part);
      const web = toDefaultWebLocale(db);
      if (web) return web;
    }
  }

  return DEFAULT_WEB_LOCALE;
}
