'use client';

import { useEffect } from 'react';
import { getLocaleConfig } from '../../config/locales';

export function LocaleHtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    const cfg = getLocaleConfig(locale);
    document.documentElement.lang = cfg.htmlLang;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);
  return null;
}
