import Link from 'next/link';
import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { EmptyLegAlertsForm } from '../../../components/home/EmptyLegAlertsForm';
import { StepsTimeline } from '../../../components/layout/StepsTimeline';
import { api, safeApi } from '../../../lib/api';
import { buildMetadata } from '../../../lib/metadata';
import { navHref } from '../../../config/navigation';
import { JB } from '../../../config/jetbay-cdn';

export async function generateMetadata() {
  return buildMetadata({ title: 'Empty Legs', description: 'Last-minute private jet deals at reduced rates.' });
}

const HOW_IT_WORKS = [
  { title: 'Browse deals', body: 'Explore discounted one-way empty leg flights updated in real time.', image: JB.pages.emptyLeg.steps[0] },
  { title: 'Select your route', body: 'Filter by departure city, destination, and travel dates.', image: JB.pages.emptyLeg.steps[1] },
  { title: 'Book instantly', body: 'Confirm your empty leg at a fraction of standard charter cost.', image: JB.pages.emptyLeg.steps[2] },
  { title: 'Fly private', body: 'Enjoy the same premium experience at a reduced rate.', image: JB.pages.emptyLeg.steps[3] },
];

export default async function EmptyLegPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await safeApi(() => api.getEmptyLegs(), { emptyLegs: [] });

  return (
    <SubPageLayout
      locale={locale}
      title="Empty Legs"
      description="Last-minute private jet deals at reduced rates — fly private for less."
      tag="Deals"
      heroImage={JB.pages.emptyLeg.hero}
      showQuoteWidget
    >
      <section className="jb-sub-section">
        <h2 className="jb-section-title">Available empty legs</h2>
        {data.emptyLegs.length === 0 ? (
          <p className="jb-section-desc">No empty legs available right now. Subscribe below for alerts.</p>
        ) : (
          <div className="jb-empty-grid">
            {data.emptyLegs.map((el: Record<string, unknown>) => {
              const from = el.fromAirport as { city?: string };
              const to = el.toAirport as { city?: string };
              return (
                <Link key={String(el.slug)} href={navHref(locale, `/empty-leg-recommendation/${el.slug}`)} className="jb-empty-card">
                  <span className="jb-discount-badge">{String(el.discountPct)}% off</span>
                  <div className="jb-route-line">{from?.city} → {to?.city}</div>
                  <div className="jb-price">USD {Number(el.price).toLocaleString()}</div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="jb-sub-section">
        <h2 className="jb-section-title">How empty legs work</h2>
        <StepsTimeline steps={HOW_IT_WORKS} />
      </section>

      <EmptyLegAlertsForm locale={locale} />
    </SubPageLayout>
  );
}
