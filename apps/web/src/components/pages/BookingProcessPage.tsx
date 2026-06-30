import Link from 'next/link';
import { JB } from '../../config/jetbay-cdn';
import { navHref } from '../../config/navigation';
import { rebrandText } from '../../lib/brand';
import type { BookingProcessPageData } from '../../lib/booking-process-default';
import { bookingStepImages } from '../../lib/booking-process-default';
import { CdnImage } from '../ui/CdnImage';
import { PageHero } from '../layout/PageHero';
import { FeatureGrid } from '../layout/FeatureGrid';

function txt(value: string) {
  return rebrandText(value);
}

const WHY_ICONS = JB.pages.privateJetCharter.highlights;

export function BookingProcessPage({ locale, data }: { locale: string; data: BookingProcessPageData }) {
  const stepImages = bookingStepImages();

  return (
    <main className="jb-subpage jb-booking-page">
      <PageHero
        locale={locale}
        title={txt(data.heroTitle)}
        description={txt(data.heroSubtitle)}
        tag="Guide"
        heroImage={JB.pages.bookingProcess.hero}
        breadcrumb={[{ label: 'Home', href: '' }, { label: 'Booking Process' }]}
      />

      <section className="jb-section">
        <div className="jb-container jb-about-intro">
          <h2 className="jb-section-title">{txt(data.introTitle)}</h2>
          <p className="jb-section-desc jb-about-lead">{txt(data.introBody)}</p>
        </div>
      </section>

      <section className="jb-section jb-light-band">
        <div className="jb-container">
          <span className="jb-tag">{txt(data.processSubtitle)}</span>
          <h2 className="jb-section-title">{txt(data.processTitle)}</h2>
          <div className="jb-booking-steps">
            {data.steps.map((step, i) => (
              <article key={step.title} className="jb-booking-step">
                <div className="jb-booking-step-visual">
                  <span className="jb-booking-step-num">{i + 1}</span>
                  <CdnImage
                    src={stepImages[i] ?? stepImages[0]}
                    alt={step.title}
                    width={280}
                    height={200}
                    className="jb-booking-step-img"
                  />
                </div>
                <div className="jb-booking-step-body">
                  <h3>{txt(step.title)}</h3>
                  <p>{txt(step.body)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="jb-section">
        <div className="jb-container">
          <h2 className="jb-section-title">{txt(data.whyTitle)}</h2>
          <FeatureGrid
            items={data.whyItems.map((item, i) => ({
              icon: WHY_ICONS[i]?.icon ?? WHY_ICONS[0].icon,
              title: txt(item.title),
              body: txt(item.body),
            }))}
          />
        </div>
      </section>

      <section className="jb-section jb-light-band">
        <div className="jb-container">
          <h2 className="jb-section-title">{txt(data.paymentTitle)}</h2>
          <div className="jb-about-why-grid">
            {data.paymentMethods.map((m) => (
              <div key={m.title} className="jb-about-why-item">
                <h3>{txt(m.title)}</h3>
                <p>{txt(m.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="jb-section">
        <div className="jb-container jb-cta-row">
          <Link href={navHref(locale, '/')} className="jb-btn-primary">
            {txt(data.ctaLabel)}
          </Link>
        </div>
      </section>
    </main>
  );
}
