/**
 * JetBay i18n — single source of truth for locale codes.
 *
 * Canonical DB locale: `en` (English master content).
 * Web routes use richer codes (`en-us`, `zh-cn`, …) mapped via toDbLocale().
 */

/** Language stored in ContentTranslation.locale and business records */
export const CANONICAL_LOCALE = 'en' as const;

/** Normalized locales allowed in DB/API */
export const DB_LOCALES = ['en', 'zh-cn', 'zh-hk', 'zh-tw', 'vi'] as const;
export type DbLocale = (typeof DB_LOCALES)[number];

/** Next.js [locale] segment codes */
export const WEB_LOCALES = ['en-us', 'en', 'zh-cn', 'zh-hk', 'zh-tw', 'vi'] as const;
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

  // Legacy: bare `zh` → simplified
  if (raw === 'zh') return 'zh-cn';

  if (DB_SET.has(raw)) return raw as DbLocale;
  const base = raw.split('-')[0];
  if (base === 'en') return 'en';
  if (base === 'zh') return 'zh-cn';
  if (base === 'vi') return 'vi';

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
  return DB_SET.has(toDbLocale(code));
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
      if (isValidWebLocale(part)) return part as WebLocale;
      const db = toDbLocale(part);
      const web = toDefaultWebLocale(db);
      if (web) return web;
    }
  }

  return DEFAULT_WEB_LOCALE;
}
