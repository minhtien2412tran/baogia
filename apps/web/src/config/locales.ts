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

/** Stable SSR/client number formatting for a web locale (avoids hydration mismatch). */
export function formatNumber(value: number, localeCode?: string): string {
  return value.toLocaleString(getLocaleConfig(localeCode ?? DEFAULT_LOCALE).htmlLang);
}

/** Cookie name for persisted web locale */
export const LOCALE_COOKIE = 'jb_locale';
