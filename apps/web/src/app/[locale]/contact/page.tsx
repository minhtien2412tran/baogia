import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { ContactEnquiryForm } from '../../../components/forms/ContactEnquiryForm';
import { buildMetadata } from '../../../lib/metadata';
import { t } from '../../../lib/i18n';
import { navHref } from '../../../config/navigation';
import Link from 'next/link';
import { JB } from '../../../config/jetbay-cdn';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({
    title: t(locale, 'contactPageTitle'),
    description: t(locale, 'contactPageDesc'),
    path: `/${locale}/contact`,
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <SubPageLayout
      locale={locale}
      title={t(locale, 'contactPageTitle')}
      description={t(locale, 'contactPageDesc')}
      tag={t(locale, 'contactUs')}
      breadcrumb={[
        { label: t(locale, 'contactUs'), href: navHref(locale, '/contact') },
      ]}
      heroImage={JB.pages?.about?.hero ?? JB.sections?.sos}
      showQuoteWidget={false}
    >
      <section className="jb-sub-section" aria-labelledby="contact-form-heading">
        <h2 id="contact-form-heading" className="jb-section-title">
          {t(locale, 'contactFormTitle')}
        </h2>
        <p className="jb-section-desc">{t(locale, 'contactFormIntro')}</p>
        <ContactEnquiryForm locale={locale} />
      </section>
      <section className="jb-sub-section jb-light-band" style={{ marginTop: '2rem', padding: '1.5rem' }}>
        <p className="jb-section-desc">
          {t(locale, 'contactAltQuote')}{' '}
          <Link href={navHref(locale, '/private-jet-charter')} className="jb-link-gold">
            {t(locale, 'getQuote')}
          </Link>
          {' · '}
          <Link href={navHref(locale, '/about-us') + '#contact'} className="jb-link-gold">
            {t(locale, 'aboutUsTag')}
          </Link>
        </p>
      </section>
    </SubPageLayout>
  );
}
