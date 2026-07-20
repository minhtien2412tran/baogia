import Link from 'next/link';
import { JB } from '../../config/jetbay-cdn';
import { navHref } from '../../config/navigation';
import { rebrandText } from '../../lib/brand';
import type { AboutUsPageData } from '../../lib/about-us-default';
import { DEFAULT_ABOUT_US } from '../../lib/about-us-default';
import { CdnImage } from '../ui/CdnImage';
import { PageHero } from '../layout/PageHero';
import { t, tn } from '@jetbay/i18n';
import { getPageContent } from '../../lib/page-content';

function txt(value: string) {
  return rebrandText(value);
}

export function AboutUsPage({
  locale,
  data,
}: {
  locale: string;
  data: AboutUsPageData;
}) {
  const overlay = getPageContent('about-us', locale);
  const tag = overlay?.tag ?? t(locale, 'aboutUsTag');
  const useOverlayHero = data.heroTitle === DEFAULT_ABOUT_US.heroTitle;
  const title =
    useOverlayHero && overlay?.title ? txt(overlay.title) : txt(data.heroTitle);
  const description =
    useOverlayHero && overlay?.hero
      ? txt(overlay.hero)
      : txt(data.heroSubtitle);

  return (
    <main className="jb-subpage jb-about-page">
      <PageHero
        locale={locale}
        title={title}
        description={description}
        tag={tag}
        heroImage={JB.pages.about.hero}
        breadcrumb={[
          { label: tn(locale, 'home'), href: '' },
          { label: tag },
        ]}
      />

      <section className="jb-section">
        <div className="jb-container jb-about-intro">
          <h2 className="jb-section-title">{txt(data.introTitle)}</h2>
          <p className="jb-section-desc jb-about-lead">{txt(data.introBody)}</p>
        </div>
      </section>

      <section className="jb-section jb-light-band">
        <div className="jb-container">
          <h2 className="jb-section-title">{txt(data.pillarsTitle)}</h2>
          <div className="jb-about-pillars">
            {data.pillars.map((pillar) => (
              <article key={pillar.title} className="jb-about-pillar">
                <div className="jb-about-pillar-img">
                  <CdnImage
                    src={pillar.image}
                    alt={pillar.title}
                    width={320}
                    height={200}
                    className="jb-about-pillar-photo"
                  />
                </div>
                <h3>{txt(pillar.title)}</h3>
                {pillar.subtitle && (
                  <p className="jb-about-pillar-sub">{txt(pillar.subtitle)}</p>
                )}
                <p>{txt(pillar.body)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="jb-section">
        <div className="jb-container jb-split">
          <div>
            <h2 className="jb-section-title">{txt(data.flyAnywhereTitle)}</h2>
            <p className="jb-section-desc">{txt(data.flyAnywhereBody)}</p>
            <Link
              href={navHref(locale, '/private-jet-charter')}
              className="jb-btn-primary"
              style={{ display: 'inline-block', marginTop: 20 }}
            >
              {t(locale, 'searchAircraft')}
            </Link>
          </div>
          <div className="jb-split-visual jb-split-visual-img">
            <CdnImage
              src={data.flyAnywhereImage}
              alt=""
              fill
              className="jb-cover-img"
              sizes="50vw"
            />
          </div>
        </div>
      </section>

      <section
        className="jb-section"
        style={{ background: 'var(--jb-bg-elevated)' }}
      >
        <div className="jb-container">
          <h2 className="jb-section-title">{txt(data.teamTitle)}</h2>
          <div className="jb-about-team-grid">
            {data.teamCards.map((card) => (
              <article key={card.title} className="jb-about-team-card">
                <CdnImage
                  src={card.image}
                  alt=""
                  width={280}
                  height={180}
                  className="jb-about-team-img"
                />
                <h3>{txt(card.title)}</h3>
                <p>{txt(card.body)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="jb-section jb-light-band">
        <div className="jb-container">
          <h2 className="jb-section-title">{txt(data.awardsTitle)}</h2>
          <p className="jb-section-desc">{txt(data.awardsSubtitle)}</p>
          <div className="jb-about-awards">
            {data.awards.map((a) => (
              <CdnImage
                key={a.alt}
                src={a.image}
                alt={a.alt}
                width={140}
                height={80}
                className="jb-about-award-img"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="jb-section">
        <div className="jb-container">
          <h2 className="jb-section-title">{txt(data.whyTitle)}</h2>
          <p className="jb-section-desc">{txt(data.whyIntro)}</p>
          <div className="jb-about-why-grid">
            {data.whyItems.map((item) => (
              <div key={item.title} className="jb-about-why-item">
                <h3>{txt(item.title)}</h3>
                <p>{txt(item.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="jb-section jb-light-band" id="contact">
        <div className="jb-container">
          <h2 className="jb-section-title">{txt(data.officesTitle)}</h2>
          <div className="jb-about-offices">
            {data.offices.map((office) => (
              <article key={office.city} className="jb-about-office">
                <div className="jb-about-office-map">
                  <CdnImage
                    src={office.mapImage}
                    alt={office.city}
                    width={200}
                    height={120}
                    className="jb-about-office-img"
                  />
                </div>
                <h3>{office.label}</h3>
                <p>{office.city}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
