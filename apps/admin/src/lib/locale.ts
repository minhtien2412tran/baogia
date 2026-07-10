/** Admin CMS — DB locale options (canonical storage) */
export {
  CANONICAL_LOCALE,
  DB_LOCALES,
  WEB_LOCALE_CONFIG,
  toDbLocale,
  toDefaultWebLocale,
} from '@jetbay/i18n';

export const ADMIN_LOCALE_OPTIONS = [
  { value: 'en', label: 'English (canonical)' },
  { value: 'zh-cn', label: '简体中文' },
  { value: 'zh-hk', label: '繁體中文 (HK)' },
  { value: 'zh-tw', label: '繁體中文 (TW)' },
  { value: 'vi', label: 'Tiếng Việt' },
] as const;
