import Link from 'next/link';

import { getPageContent } from '../../lib/page-content';

import { navHref } from '../../config/navigation';

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



export async function ServicePage({ locale, pageKey }: { locale: string; pageKey: string }) {

  const content = getPageContent(pageKey);

  const cmsSlug = PAGE_CMS_SLUG[pageKey];

  const cms = cmsSlug

    ? await safeApi(() => api.getContentPage(cmsSlug, locale), null)

    : null;



  if (!content) {

    return (

      <main className="jb-subpage">

        <PageHero locale={locale} title="Page not found" />

        <div className="jb-container jb-sub-body">

          <p className="jb-section-desc">This page is not available.</p>

        </div>

      </main>

    );

  }



  const pjc = JB.pages.privateJetCharter;



  return (

    <>

      <main className="jb-subpage">

        <PageHero

          locale={locale}

          title={content.title}

          description={content.hero}

          tag={content.tag}

          heroImage={content.heroImage}

          showQuoteWidget={content.showQuoteWidget}

          breadcrumb={[{ label: 'Home', href: '' }, { label: content.title }]}

        />



        <div className="jb-container jb-sub-body">

          {pageKey === 'private-jet-charter' && (

            <section className="jb-sub-section jb-intro-stats">

              <h2 className="jb-section-title">Global Private Air Charter Service, Simplified.</h2>

              <p className="jb-section-desc">

                J-TA&apos;s private air charter service combines luxury, efficiency, and safety at the best value.

              </p>

              <div className="jb-mini-stats">

                <div><strong>500+</strong><span>Aircraft Available</span></div>

                <div><strong>24/7</strong><span>Concierge Service</span></div>

                <div><strong>Global</strong><span>Network Access</span></div>

              </div>

            </section>

          )}



          {content.promoBanners && content.promoBanners.length > 0 && (

            <section className="jb-sub-section">

              <h2 className="jb-section-title">Private Jet Promotion</h2>

              <PromoBannerRow locale={locale} items={content.promoBanners} />

            </section>

          )}



          {pageKey === 'private-jet-charter' && (

            <>

              <section className="jb-sub-section">

                <h2 className="jb-section-title">Our Private Air Charter Services</h2>

                <ServiceBlocks items={pjc.serviceBlocks} />

              </section>



              <LightSection title="What Makes Our Private Air Charter Service Exceptional" subtitle="Trusted standards on every flight.">

                <FeatureGrid

                  items={pjc.highlights.map((h) => ({

                    icon: h.icon,

                    title: h.title,

                    body:

                      h.title === 'Global Coverage'

                        ? 'Available 24/7, our network spans 190+ countries with seamless connectivity.'

                        : h.title === 'AI-Powered Efficiency'

                          ? 'AI matches your needs, securing the best aircraft in 1–2 hours.'

                          : h.title === 'Uncompromised Safety'

                            ? 'Certified aircraft, experienced pilots, and trusted partners on every flight.'

                            : 'Over 10,000 satisfied clients — Asia\'s leading private jet charter platform.',

                  }))}

                />

              </LightSection>



              <AircraftCarousel />

            </>

          )}



          {cms?.body && (

            <section className="jb-content-block jb-cms-block">

              <div dangerouslySetInnerHTML={{ __html: String(cms.body).replace(/\n/g, '<br/>') }} />

            </section>

          )}



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

              <Link href={navHref(locale, content.cta.href)} className="jb-btn-primary">

                {content.cta.label}

              </Link>

            </div>

          )}

        </div>

      </main>



      {pageKey === 'private-jet-charter' && (

        <>

          <LightSection title="The J-TA Charter Process" subtitle="Your Journey, Effortlessly Arranged.">

            <StepsTimeline

              steps={pjc.processSteps.map((s, i) => ({

                title: `${i + 1}. ${s.title}`,

                body: s.body,

              }))}

            />

          </LightSection>

          <section className="jb-section">

            <div className="jb-container">

              <h2 className="jb-section-title">Frequently Asked Questions About Our Private Jet Charter Services</h2>

              <FaqAccordion items={pjc.faqs} />

            </div>

          </section>

          <StatsSection />

        </>

      )}



      {pageKey !== 'private-jet-charter' && content.steps && content.steps.length > 0 && (

        <LightSection title="How it works" subtitle="Your journey from search to wheels-up.">

          <StepsTimeline steps={content.steps} />

        </LightSection>

      )}



      {pageKey !== 'private-jet-charter' && content.features && content.features.length > 0 && (

        <LightSection title="Why J-TA" subtitle="Trusted standards on every flight.">

          <FeatureGrid items={content.features} />

        </LightSection>

      )}

    </>

  );

}

