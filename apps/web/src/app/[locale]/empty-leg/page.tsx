import Link from 'next/link';
import { t } from '@jetbay/i18n';
import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { LightSection } from '../../../components/layout/LightSection';
import { EmptyLegAlertsForm } from '../../../components/home/EmptyLegAlertsForm';
import { StepsTimeline } from '../../../components/layout/StepsTimeline';
import { api, safeApi } from '../../../lib/api';
import { buildMetadata } from '../../../lib/metadata';
import { navHref } from '../../../config/navigation';
import { JB } from '../../../config/jetbay-cdn';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({
    title: t(locale, 'emptyLegPageTitle'),
    description: t(locale, 'emptyLegMetaDesc'),
    path: `/${locale}/empty-leg`,
  });
}

export default async function EmptyLegPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await safeApi(() => api.getEmptyLegs(), { emptyLegs: [] });

  const howItWorks = [
    { title: t(locale, 'elStepBrowseTitle'), body: t(locale, 'elStepBrowseBody'), image: JB.pages.emptyLeg.steps[0] },
    { title: t(locale, 'elStepSelectTitle'), body: t(locale, 'elStepSelectBody'), image: JB.pages.emptyLeg.steps[1] },
    { title: t(locale, 'elStepBookTitle'), body: t(locale, 'elStepBookBody'), image: JB.pages.emptyLeg.steps[2] },
    { title: t(locale, 'elStepFlyTitle'), body: t(locale, 'elStepFlyBody'), image: JB.pages.emptyLeg.steps[3] },
  ];

  return (
    <>
      <SubPageLayout
        locale={locale}
        title={t(locale, 'emptyLegPageTitle')}
        description={t(locale, 'emptyLegPageDesc')}
        tag={t(locale, 'deals')}
        heroImage={JB.pages.emptyLeg.hero}
        showQuoteWidget
      >
        <section className="jb-sub-section">
          <h2 className="jb-section-title">{t(locale, 'availableEmptyLegs')}</h2>
          {data.emptyLegs.length === 0 ? (
            <p className="jb-section-desc">{t(locale, 'emptyLegsEmptyDesc')}</p>
          ) : (
            <div className="jb-empty-grid">
              {data.emptyLegs.map((el: Record<string, unknown>) => {
                const from = el.fromAirport as { city?: string };
                const to = el.toAirport as { city?: string };
                return (
                  <Link
                    key={String(el.slug)}
                    href={navHref(locale, `/empty-leg-recommendation/${el.slug}`)}
                    className="jb-empty-card"
                  >
                    <span className="jb-discount-badge">
                      {t(locale, 'discountOff', { n: String(el.discountPct) })}
                    </span>
                    <div className="jb-route-line">
                      {from?.city} → {to?.city}
                    </div>
                    <div className="jb-price">USD {Number(el.price).toLocaleString()}</div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <EmptyLegAlertsForm locale={locale} />
      </SubPageLayout>

      <LightSection title={t(locale, 'howEmptyLegsWork')}>
        <StepsTimeline steps={howItWorks} />
      </LightSection>
    </>
  );
}
