import Link from 'next/link';
import { t } from '@jetbay/i18n';
import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { api, loadApi } from '../../../lib/api';
import { buildMetadata } from '../../../lib/metadata';
import { navHref } from '../../../config/navigation';
import { JB, fixedPriceRegion } from '../../../config/jetbay-cdn';
import { CdnImage } from '../../../components/ui/CdnImage';
import { ApiLoadNotice } from '../../../components/ui/ApiLoadNotice';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({
    title: t(locale, 'fixedPricePageTitle'),
    description: t(locale, 'fixedPriceMetaDesc'),
    path: `/${locale}/fixed-price-charter`,
  });
}

export default async function FixedPricePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const load = await loadApi(() => api.getFixedPriceRoutes(fixedPriceRegion(locale)), { routes: [] });
  const data = load.data;

  return (
    <SubPageLayout
      locale={locale}
      title={t(locale, 'fixedPricePageTitle')}
      description={t(locale, 'fixedPricePageDesc')}
      tag={t(locale, 'deals')}
      heroImage={JB.pages.fixedPrice.hero}
      showQuoteWidget
    >
      <section className="jb-sub-section">
        <h2 className="jb-section-title">{t(locale, 'popularRoutes')}</h2>
        <div className="jb-hot-routes">
          {JB.pages.fixedPrice.hotRoutes.map((img) => (
            <div key={img} className="jb-hot-route-card">
              <CdnImage src={img} alt={t(locale, 'fixedPriceRouteAlt')} fill className="jb-cover-img" sizes="25vw" />
            </div>
          ))}
        </div>
      </section>

      <section className="jb-sub-section">
        <h2 className="jb-section-title">{t(locale, 'allFixedPriceRoutes')}</h2>
        {!load.ok ? <ApiLoadNotice locale={locale} kind="error" /> : null}
        {load.ok && data.routes.length === 0 ? <ApiLoadNotice locale={locale} kind="empty" /> : null}
        <div className="jb-routes-scroll" style={{ flexWrap: 'wrap', overflow: 'visible' }}>
          {data.routes.map((r: Record<string, unknown>) => {
            const from = r.fromAirport as { city: string; iata: string };
            const to = r.toAirport as { city: string; iata: string };
            const tiers =
              (r.priceOptions as Array<{
                category: string;
                categoryLabel?: string;
                price: number;
                paxLimit: number;
                includedTerms?: string | null;
              }>) ?? [];
            return (
              <div key={String(r.slug)} className="jb-route-card" style={{ flex: '1 1 300px' }}>
                <div className="jb-route-airports">
                  <div><div className="jb-iata">{from?.iata}</div><div className="jb-city">{from?.city}</div></div>
                  <span className="jb-route-arrow">→</span>
                  <div><div className="jb-iata">{to?.iata}</div><div className="jb-city">{to?.city}</div></div>
                </div>
                {tiers.length === 0 ? (
                  <p className="jb-tier-empty">{t(locale, 'pricingOnRequest')}</p>
                ) : (
                  tiers.map((tier) => (
                    <div key={tier.category} className="jb-tier">
                      <div>
                        <div className="jb-tier-label">
                          {t(locale, 'categoryJets', { category: tier.categoryLabel ?? tier.category })}
                        </div>
                        <div className="jb-tier-pax">{t(locale, 'upToPassengers', { n: tier.paxLimit })}</div>
                        {tier.includedTerms ? <div className="jb-tier-terms">{tier.includedTerms}</div> : null}
                      </div>
                      <div className="jb-tier-price">USD {tier.price.toLocaleString()}</div>
                    </div>
                  ))
                )}
                <Link href={navHref(locale, `/fixed-price-charter/${r.slug}`)} className="jb-book-btn">
                  {t(locale, 'bookNow')}
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </SubPageLayout>
  );
}
