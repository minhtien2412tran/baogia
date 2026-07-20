import Link from 'next/link';
import { getPageContent } from '../../lib/page-content';
import { navHref } from '../../config/navigation';
import { apiLocale } from '../../config/locales';
import { t, tn } from '@jetbay/i18n';
import { api, safeApi } from '../../lib/api';
import { PAGE_CMS_SLUG } from '../../lib/service-page';
import { PageHero } from './PageHero';
import { FeatureGrid } from './FeatureGrid';
import { StepsTimeline } from './StepsTimeline';
import { PromoBannerRow } from './PromoBannerRow';
import { LightSection } from './LightSection';
import { ServiceBlocks } from './ServiceBlocks';
import { FaqAccordion } from './FaqAccordion';
import { JB } from '../../config/jetbay-cdn';
import { StatsSection } from '../home/StatsSection';
import { AircraftCarousel } from '../charter/AircraftCarousel';

export async function ServicePage({
  locale,
  pageKey,
}: {
  locale: string;
  pageKey: string;
}) {
  const content = getPageContent(pageKey, locale);
  const cmsSlug = PAGE_CMS_SLUG[pageKey];
  const cms = cmsSlug
    ? await safeApi(() => api.getContentPage(cmsSlug, apiLocale(locale)), null)
    : null;

  if (!content) {
    return (
      <main className="jb-subpage jb-service-page">
        <PageHero locale={locale} title={tn(locale, 'pageNotFound')} />
        <div className="jb-container jb-sub-body">
          <p className="jb-section-desc">{tn(locale, 'pageUnavailable')}</p>
        </div>
      </main>
    );
  }

  const pjc = JB.pages.privateJetCharter;

  return (
    <>
      <main className="jb-subpage jb-service-page">
        <PageHero
          locale={locale}
          title={content.title}
          description={content.hero}
          tag={content.tag}
          heroImage={content.heroImage}
          showQuoteWidget={content.showQuoteWidget}
          breadcrumb={[
            { label: tn(locale, 'home'), href: '' },
            { label: content.title },
          ]}
        />

        <div className="jb-container jb-sub-body">
          {pageKey === 'private-jet-charter' && (
            <section className="jb-sub-section jb-intro-stats">
              <h2 className="jb-section-title">{t(locale, 'pjcIntroTitle')}</h2>
              <p className="jb-section-desc">{t(locale, 'pjcIntroDesc')}</p>
              <div className="jb-mini-stats">
                <div>
                  <strong>500+</strong>
                  <span>{t(locale, 'pjcAircraftAvailable')}</span>
                </div>
                <div>
                  <strong>24/7</strong>
                  <span>{t(locale, 'pjcConciergeService')}</span>
                </div>
                <div>
                  <strong>Global</strong>
                  <span>{t(locale, 'pjcNetworkAccess')}</span>
                </div>
              </div>
            </section>
          )}

          {content.promoBanners && content.promoBanners.length > 0 && (
            <section className="jb-sub-section">
              <h2 className="jb-section-title">
                {t(locale, 'privateJetPromotion')}
              </h2>
              <PromoBannerRow locale={locale} items={content.promoBanners} />
            </section>
          )}

          {pageKey === 'private-jet-charter' && (
            <>
              <section className="jb-sub-section">
                <h2 className="jb-section-title">
                  {t(locale, 'pjcServicesTitle')}
                </h2>
                <ServiceBlocks items={pjc.serviceBlocks} />
              </section>

              <LightSection
                title={t(locale, 'pjcExceptionalTitle')}
                subtitle={t(locale, 'pjcExceptionalSubtitle')}
              >
                <FeatureGrid
                  items={pjc.highlights.map((h) => ({
                    icon: h.icon,
                    title: h.title,
                    body:
                      h.title === 'Global Coverage'
                        ? t(locale, 'pjcHighlightGlobalBody')
                        : h.title === 'AI-Powered Efficiency'
                          ? t(locale, 'pjcHighlightAiBody')
                          : h.title === 'Uncompromised Safety'
                            ? t(locale, 'pjcHighlightSafetyBody')
                            : t(locale, 'pjcHighlightDefaultBody'),
                  }))}
                />
              </LightSection>

              <AircraftCarousel locale={locale} />
            </>
          )}

          {cms?.body ? (
            <section className="jb-content-block jb-cms-block">
              <div
                dangerouslySetInnerHTML={{
                  __html: String(cms.body).replace(/\n/g, '<br/>'),
                }}
              />
            </section>
          ) : null}

          {pageKey !== 'private-jet-charter' &&
            content.sections.map((s) => (
              <section key={s.heading} className="jb-content-block">
                <h2>{s.heading}</h2>
                <p>{s.body}</p>
                {s.bullets && (
                  <ul className="jb-bullet-list">
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

          {content.cta && pageKey !== 'private-jet-charter' && (
            <div className="jb-cta-row" style={{ marginTop: 32 }}>
              <Link
                href={navHref(locale, content.cta.href)}
                className="jb-btn-primary"
              >
                {content.cta.label}
              </Link>
            </div>
          )}
        </div>
      </main>

      {pageKey === 'private-jet-charter' && (
        <>
          <LightSection
            title={t(locale, 'pjcProcessTitle')}
            subtitle={t(locale, 'pjcProcessSubtitle')}
          >
            <StepsTimeline
              steps={pjc.processSteps.map((s, i) => ({
                title: `${i + 1}. ${s.title}`,
                body: s.body,
              }))}
            />
          </LightSection>

          <section className="jb-section">
            <div className="jb-container">
              <h2 className="jb-section-title">{t(locale, 'pjcFaqTitle')}</h2>
              <FaqAccordion items={pjc.faqs} />
            </div>
          </section>

          <StatsSection locale={locale} />
        </>
      )}

      {pageKey !== 'private-jet-charter' &&
        content.steps &&
        content.steps.length > 0 && (
          <LightSection
            title={t(locale, 'howItWorks')}
            subtitle={t(locale, 'howItWorksSubtitle')}
          >
            <StepsTimeline steps={content.steps} />
          </LightSection>
        )}

      {pageKey !== 'private-jet-charter' &&
        content.features &&
        content.features.length > 0 && (
          <LightSection
            title={t(locale, 'whyJetvinaSection')}
            subtitle={t(locale, 'whyJetvinaSubtitle')}
          >
            <FeatureGrid items={content.features} />
          </LightSection>
        )}
    </>
  );
}
