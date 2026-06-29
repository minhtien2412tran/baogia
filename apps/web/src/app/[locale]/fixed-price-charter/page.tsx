import Link from 'next/link';
import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { api, safeApi } from '../../../lib/api';
import { buildMetadata } from '../../../lib/metadata';
import { navHref } from '../../../config/navigation';

export async function generateMetadata() {
  return buildMetadata({ title: 'Fixed Price Charter', description: 'Transparent fixed-price private jet routes.' });
}

export default async function FixedPricePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await safeApi(() => api.getFixedPriceRoutes(), { routes: [] });

  return (
    <SubPageLayout
      locale={locale}
      title="Fixed-Price Charter Routes"
      description="Experience price certainty on our most requested global routes."
      tag="Deals"
    >
      <div className="jb-routes-scroll" style={{ flexWrap: 'wrap', overflow: 'visible' }}>
        {data.routes.map((r: Record<string, unknown>) => {
          const from = r.fromAirport as { city: string; iata: string };
          const to = r.toAirport as { city: string; iata: string };
          const tiers = (r.priceOptions as Array<{ category: string; price: number; paxLimit: number }>) ?? [];
          return (
            <div key={String(r.slug)} className="jb-route-card" style={{ flex: '1 1 300px' }}>
              <div className="jb-route-airports">
                <div><div className="jb-iata">{from?.iata}</div><div className="jb-city">{from?.city}</div></div>
                <span className="jb-route-arrow">→</span>
                <div><div className="jb-iata">{to?.iata}</div><div className="jb-city">{to?.city}</div></div>
              </div>
              {tiers.map((t) => (
                <div key={t.category} className="jb-tier">
                  <div><div className="jb-tier-label">{t.category} Jets</div><div className="jb-tier-pax">Up to {t.paxLimit} pax</div></div>
                  <div className="jb-tier-price">USD {t.price.toLocaleString()}</div>
                </div>
              ))}
              <Link href={navHref(locale, `/fixed-price-charter/${r.slug}`)} className="jb-book-btn">Book Now</Link>
            </div>
          );
        })}
      </div>
    </SubPageLayout>
  );
}
