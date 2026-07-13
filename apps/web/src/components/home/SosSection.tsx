import { JB } from '../../config/jetbay-cdn';
import { CdnImage } from '../ui/CdnImage';

export function SosSection({ locale }: { locale: string }) {
  const p = `/${locale}`;
  return (
    <section className="jb-section" style={{ background: 'var(--jb-bg-elevated)' }}>
      <div className="jb-container">
        <div className="jb-split">
          <div>
            <span className="jb-tag">24/7 Emergency Support</span>
            <h2 className="jb-section-title">Air Ambulance Global Medical Air Assistance</h2>
            <p className="jb-section-desc">
              24/7 rapid-response medical evacuation, combining world-class healthcare networks with
              uncompromising aviation safety.
            </p>
            <div className="jb-cta-row">
              <a href={`${p}/air-ambulance`} className="jb-btn-primary">Request Air Ambulance</a>
              <a href={`${p}/air-ambulance`} className="jb-btn-outline">Learn About Air Ambulance</a>
            </div>
          </div>
          <div className="jb-split-visual jb-split-visual-img">
            <CdnImage src={JB.sections.sos} alt="Medical air assistance" fill className="jb-cover-img" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
