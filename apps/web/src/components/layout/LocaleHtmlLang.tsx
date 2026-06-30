'use client';

import { useEffect } from 'react';
import { getLocaleConfig } from '../../config/locales';

export function LocaleHtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = getLocaleConfig(locale).htmlLang;
  }, [locale]);
  return null;
}
