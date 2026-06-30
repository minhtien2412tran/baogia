import '../../styles/jetbay-home.css';
import '../../styles/jetbay-polish.css';
import { JetBayHeader } from '../../components/home/JetBayHeader';
import { JetBayFooter } from '../../components/home/JetBayFooter';
import { CookieBanner } from '../../components/home/CookieBanner';
import { LocaleHtmlLang } from '../../components/layout/LocaleHtmlLang';
import { getLocaleConfig, isValidLocale } from '../../config/locales';
import { notFound } from 'next/navigation';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const { currency } = getLocaleConfig(locale);

  return (
    <div className="jb-page">
      <LocaleHtmlLang locale={locale} />
      <JetBayHeader locale={locale} currency={currency} />
      {children}
      <JetBayFooter locale={locale} />
      <CookieBanner locale={locale} />
    </div>
  );
}
