import '../../styles/jetbay-home.css';
import '../../styles/jetbay-polish.css';
import '../../styles/jetbay-motion.css';
import '../../styles/jetbay-account.css';
import '../../styles/jetbay-service.css';
import '../../styles/jetbay-jetcard.css';
import '../../styles/jetbay-responsive.css';
import '../../styles/jetbay-promo.css';
import '../../styles/jetbay-modern.css';
import '../../styles/jetbay-flight-rail.css';
import '../../styles/jetbay-fixed-price.css';
import { JetBayHeader } from '../../components/home/JetBayHeader';
import { JetBayFooter } from '../../components/home/JetBayFooter';
import { CookieBanner } from '../../components/home/CookieBanner';
import { JetBayMotion } from '../../components/motion/JetBayMotion';
import { JetVinaPageLoader } from '../../components/motion/JetVinaPageLoader';
import { PageTransition } from '../../components/motion/PageTransition';
import { LocaleHtmlLang } from '../../components/layout/LocaleHtmlLang';
import { getLocaleConfig, isValidLocale } from '../../config/locales';
import { notFound } from 'next/navigation';
import { t } from '../../lib/i18n';

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
      <JetVinaPageLoader />
      <LocaleHtmlLang locale={locale} />
      <a href="#main-content" className="jb-skip-link">
        {t(locale, 'skipToContent')}
      </a>
      <JetBayMotion />
      <JetBayHeader locale={locale} currency={currency} />
      <div id="main-content" tabIndex={-1}>
        <PageTransition>{children}</PageTransition>
      </div>
      <JetBayFooter locale={locale} />
      <CookieBanner locale={locale} />
    </div>
  );
}
