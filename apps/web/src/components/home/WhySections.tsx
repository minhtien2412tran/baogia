import { JB } from '../../config/jetbay-cdn';
import { CdnImage } from '../ui/CdnImage';
import { t } from '@jetbay/i18n';

export function WhySections({ locale }: { locale: string }) {
  const p = `/${locale}`;
  const whyItems = [
    t(locale, 'whyCharterItem1'),
    t(locale, 'whyCharterItem2'),
    t(locale, 'whyCharterItem3'),
    t(locale, 'whyCharterItem4'),
  ];
  const features = [
    {
      icon: JB.features.time,
      title: t(locale, 'featureAvailTitle'),
      desc: t(locale, 'featureAvailDesc'),
    },
    {
      icon: JB.features.safe,
      title: t(locale, 'featureSafeTitle'),
      desc: t(locale, 'featureSafeDesc'),
    },
    {
      icon: JB.features.luxury,
      title: t(locale, 'featureLuxuryTitle'),
      desc: t(locale, 'featureLuxuryDesc'),
    },
    {
      icon: JB.features.dedicated,
      title: t(locale, 'featureDedicatedTitle'),
      desc: t(locale, 'featureDedicatedDesc'),
    },
    {
      icon: JB.features.global,
      title: t(locale, 'featureGlobalTitle'),
      desc: t(locale, 'featureGlobalDesc'),
    },
    {
      icon: JB.features.flexible,
      title: t(locale, 'featureFlexibleTitle'),
      desc: t(locale, 'featureFlexibleDesc'),
    },
  ];

  return (
    <>
      <section className="jb-section" style={{ background: 'var(--jb-bg-elevated)' }}>
        <div className="jb-container">
          <div className="jb-split">
            <div>
              <span className="jb-tag">{t(locale, 'aboutUsTag')}</span>
              <h2 className="jb-section-title">{t(locale, 'whyCharterTitle')}</h2>
              <p className="jb-section-desc">{t(locale, 'whyCharterDesc')}</p>
              <ul
                style={{
                  margin: '20px 0',
                  paddingLeft: 20,
                  color: 'var(--jb-text-muted)',
                  lineHeight: 2,
                }}
              >
                {whyItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a href={`${p}/about-us`} className="jb-btn-outline">
                {t(locale, 'learnMoreAboutJetvina')}
              </a>
            </div>
            <div className="jb-split-visual jb-split-visual-img">
              <CdnImage
                src={JB.sections.whyCharter}
                alt={t(locale, 'whyCharterTitle')}
                fill
                className="jb-cover-img"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="jb-section">
        <div className="jb-container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="jb-tag">{t(locale, 'whatSetsUsApart')}</span>
            <h2 className="jb-section-title">{t(locale, 'whyChooseJetvina')}</h2>
            <p className="jb-section-desc">{t(locale, 'excellenceDetail')}</p>
          </div>
          <div className="jb-features-grid">
            {features.map((f) => (
              <div key={f.title} className="jb-feature">
                <div className="jb-feature-icon">
                  <CdnImage
                    src={f.icon}
                    alt=""
                    width={40}
                    height={40}
                    className="jb-cdn-icon"
                  />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
