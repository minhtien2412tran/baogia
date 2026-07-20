/**
 * Web locale config — re-exports shared @jetbay/i18n registry.
 */
import {
  DEFAULT_WEB_LOCALE,
  WEB_LOCALE_CONFIG,
  isValidWebLocale,
  toDbLocale,
  type WebLocaleConfig,
} from '@jetbay/i18n';

export type LocaleConfig = WebLocaleConfig;

export const LOCALES = WEB_LOCALE_CONFIG;
export const DEFAULT_LOCALE = DEFAULT_WEB_LOCALE;

export { isValidWebLocale as isValidLocale, toDbLocale as apiLocale };

export function getLocaleConfig(code: string): LocaleConfig {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}

/** BCP-47 tag for Intl APIs (`en-us` → `en-US`). Web route codes are not always valid. */
export function toIntlLocale(localeCode?: string): string {
  return getLocaleConfig(localeCode ?? DEFAULT_LOCALE).htmlLang;
}

/** Stable SSR/client number formatting for a web locale (avoids hydration mismatch). */
export function formatNumber(value: number, localeCode?: string): string {
  try {
    return value.toLocaleString(toIntlLocale(localeCode));
  } catch {
    return value.toLocaleString('en-US');
  }
}

/** Safe date formatting — never pass raw web codes like `zh-cn` / `en-us` to Intl. */
export function formatDate(
  value: Date | string | number,
  localeCode?: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  try {
    return date.toLocaleDateString(toIntlLocale(localeCode), options);
  } catch {
    return date.toLocaleDateString('en-US', options);
  }
}

/** Cookie name for persisted web locale */
export const LOCALE_COOKIE = 'jb_locale';
