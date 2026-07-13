import { Injectable } from '@nestjs/common';
import {
  CANONICAL_LOCALE,
  DB_LOCALES,
  WEB_LOCALE_CONFIG,
  detectWebLocale,
  isValidDbLocale,
  resolveLocaleFallbackChain,
  toDbLocale,
  toDefaultWebLocale,
  webLocalesForDb,
} from '@jetbay/i18n';

@Injectable()
export class LocaleService {
  readonly canonical = CANONICAL_LOCALE;
  readonly dbLocales = DB_LOCALES;
  readonly webLocales = WEB_LOCALE_CONFIG;

  normalize(input?: string | null) {
    return toDbLocale(input);
  }

  fallbackChain(input?: string | null) {
    return resolveLocaleFallbackChain(input);
  }

  isValidDb(code: string) {
    return isValidDbLocale(code);
  }

  toWebDefault(dbLocale: string) {
    return toDefaultWebLocale(dbLocale);
  }

  webAliases(dbLocale: string) {
    return webLocalesForDb(dbLocale);
  }

  detectWeb(acceptLanguage?: string | null, cookieLocale?: string | null) {
    return detectWebLocale(acceptLanguage, cookieLocale);
  }

  /** Normalize translation payload before DB write */
  normalizeTranslationDto<T extends { locale?: string }>(
    dto: T,
  ): T & { locale: string } {
    const locale = this.normalize(dto.locale ?? CANONICAL_LOCALE);
    return { ...dto, locale };
  }
}
