import '../../styles/jetbay-home.css';
import '../../styles/jetbay-polish.css';
import '../../styles/jetbay-motion.css';
import '../../styles/jetbay-account.css';
import '../../styles/jetbay-service.css';
import '../../styles/jetbay-jetcard.css';
import '../../styles/jetbay-responsive.css';
import '../../styles/jetbay-promo.css';
import '../../styles/jetbay-modern.css';
import { JetBayHeader } from '../../components/home/JetBayHeader';
import { JetBayFooter } from '../../components/home/JetBayFooter';
import { CookieBanner } from '../../components/home/CookieBanner';
import { JetBayMotion } from '../../components/motion/JetBayMotion';
import { PageTransition } from '../../components/motion/PageTransition';
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
      <JetBayMotion />
      <JetBayHeader locale={locale} currency={currency} />
      <PageTransition>{children}</PageTransition>
      <JetBayFooter locale={locale} />
      <CookieBanner locale={locale} />
    </div>
  );
}
