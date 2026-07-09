import { JB } from '../../config/jetbay-cdn';
import { CdnImage } from '../ui/CdnImage';

const WHY_CHARTER = [
  'Access 10,000+ aircraft across 1,000+ operators',
  '24/7 global concierge support',
  'AI-driven aircraft matching',
  'Transparent end-to-end booking support',
];

const FEATURES = [
  { icon: JB.features.time, title: '24/7 Availability', desc: 'Support is available whenever you need to fly.' },
  { icon: JB.features.safe, title: 'Trusted Safety', desc: 'Flights arranged with vetted operators and high standards.' },
  { icon: JB.features.luxury, title: 'Luxury Experience', desc: 'Enjoy premium comfort, privacy, and flexibility onboard.' },
  { icon: JB.features.dedicated, title: 'Dedicated Service', desc: 'Receive attentive support throughout your journey.' },
  { icon: JB.features.global, title: 'Global Network', desc: 'Fly across major cities and destinations worldwide.' },
  { icon: JB.features.flexible, title: 'Flexible & Tailored', desc: 'Choose flight solutions built around your travel plans.' },
];

export function WhySections({ locale }: { locale: string }) {
  const p = `/${locale}`;
  return (
    <>
      <section className="jb-section" style={{ background: 'var(--jb-bg-elevated)' }}>
        <div className="jb-container">
          <div className="jb-split">
            <div>
              <span className="jb-tag">About Us</span>
              <h2 className="jb-section-title">Why Charter with JetBay?</h2>
              <p className="jb-section-desc">JetBay offers bespoke charter solutions, connecting you to a global fleet.</p>
              <ul style={{ margin: '20px 0', paddingLeft: 20, color: 'var(--jb-text-muted)', lineHeight: 2 }}>
                {WHY_CHARTER.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a href={`${p}/about-us`} className="jb-btn-outline">Learn More About JetBay</a>
            </div>
            <div className="jb-split-visual jb-split-visual-img">
              <CdnImage src={JB.sections.whyCharter} alt="Private jet charter" fill className="jb-cover-img" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </section>

      <section className="jb-section">
        <div className="jb-container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="jb-tag">What Sets Us Apart</span>
            <h2 className="jb-section-title">Why Choose JetBay?</h2>
            <p className="jb-section-desc">Excellence in Every Detail</p>
          </div>
          <div className="jb-features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="jb-feature">
                <div className="jb-feature-icon">
                  <CdnImage src={f.icon} alt="" width={40} height={40} className="jb-cdn-icon" />
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
