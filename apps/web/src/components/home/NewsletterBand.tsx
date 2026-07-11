import { tn } from '@jetbay/i18n';
import { t } from '../../lib/i18n';
import { NewsletterForm } from './NewsletterForm';

export function NewsletterBand({ locale }: { locale: string }) {
  return (
    <section className="jb-section jb-newsletter-band" aria-labelledby="jb-newsletter-band-title">
      <div className="jb-container jb-newsletter-band__inner">
        <div className="jb-newsletter-band__copy">
          <h2 id="jb-newsletter-band-title" className="jb-newsletter-band__title">
            {t(locale, 'newsletter')}
          </h2>
          <p className="jb-newsletter-band__hint">{tn(locale, 'footerNewsletterHint')}</p>
        </div>
        <div className="jb-newsletter-band__form">
          <NewsletterForm locale={locale} />
        </div>
      </div>
    </section>
  );
}
