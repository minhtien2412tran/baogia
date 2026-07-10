import { Controller, Get, Headers, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CANONICAL_LOCALE, WEB_LOCALE_CONFIG } from '@jetbay/i18n';
import { Public } from '../../auth/public.decorator';
import { LocaleService } from './locale.service';

@ApiTags('i18n')
@Controller('i18n')
export class I18nController {
  constructor(private readonly locales: LocaleService) {}

  @Get('config')
  @Public()
  @ApiOperation({ summary: 'Supported locales — web ↔ DB mapping (reverse i18n)' })
  @ApiResponse({ status: 200, description: 'Locale registry for FE/Admin' })
  getConfig() {
    return {
      canonicalLocale: CANONICAL_LOCALE,
      dbLocales: this.locales.dbLocales,
      webLocales: this.locales.webLocales,
      mapping: this.locales.webLocales.map((w) => ({
        web: w.code,
        db: w.dbLocale,
        label: w.label,
        currency: w.currency,
        htmlLang: w.htmlLang,
      })),
    };
  }

  @Get('resolve')
  @Public()
  @ApiOperation({ summary: 'Resolve web/accept-language to DB locale + fallback chain' })
  @ApiQuery({ name: 'locale', required: false, example: 'en-us' })
  @ApiQuery({ name: 'cookie', required: false })
  resolve(
    @Query('locale') locale?: string,
    @Query('cookie') cookie?: string,
    @Headers('accept-language') acceptLanguage?: string,
  ) {
    const web = this.locales.detectWeb(acceptLanguage, cookie ?? locale);
    const db = this.locales.normalize(locale ?? cookie ?? web);
    return {
      web,
      db,
      fallbackChain: this.locales.fallbackChain(db),
      webAliases: this.locales.webAliases(db),
    };
  }
}
