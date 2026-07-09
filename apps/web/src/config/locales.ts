/** JetBay-style locale configuration */
export type LocaleConfig = {
  code: string;
  label: string;
  htmlLang: string;
  currency: string;
};

export const LOCALES: LocaleConfig[] = [
  { code: 'en-us', label: 'English (US)', htmlLang: 'en-us', currency: 'USD' },
  { code: 'en', label: 'English', htmlLang: 'en', currency: 'USD' },
  { code: 'zh-cn', label: '简体中文', htmlLang: 'zh-cn', currency: 'CNY' },
  { code: 'zh-hk', label: '繁體中文 (HK)', htmlLang: 'zh-hk', currency: 'HKD' },
  { code: 'zh-tw', label: '繁體中文 (TW)', htmlLang: 'zh-tw', currency: 'TWD' },
  { code: 'vi', label: 'Tiếng Việt', htmlLang: 'vi', currency: 'USD' },
];

export const DEFAULT_LOCALE = 'en-us';

const LOCALE_CODES = new Set(LOCALES.map((l) => l.code));

export function isValidLocale(code: string): boolean {
  return LOCALE_CODES.has(code);
}

export function getLocaleConfig(code: string): LocaleConfig {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}

/** Map locale to API/content language (en-us → en) */
export function apiLocale(code: string): string {
  if (code.startsWith('zh')) return code;
  if (code.startsWith('en')) return 'en';
  return code.split('-')[0] ?? 'en';
}
