import { JB } from '../../config/jetbay-cdn';
import { CdnImage } from '../ui/CdnImage';

import { PartnerProgramsStrip } from './PartnerProgramsStrip';

export async function PartnerSection({ locale }: { locale: string }) {
  const p = `/${locale}`;
  return (
    <section className="jb-section" style={{ background: 'var(--jb-bg-elevated)' }}>
      <div className="jb-container">
        <div className="jb-split">
          <div className="jb-split-visual jb-split-visual-img">
            <CdnImage src={JB.sections.partner} alt="Global Partner Program" fill className="jb-cover-img" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div>
            <span className="jb-tag">Partner Program</span>
            <h2 className="jb-section-title">Join the J-TA Global Partner Program</h2>
            <p className="jb-section-desc">
              Refer clients, choose your preferred partnership program, and leverage our global fleet with
              comprehensive support — no prior aviation experience required.
            </p>
            <PartnerProgramsStrip />
            <div className="jb-cta-row">
              <a href={`${p}/global-partnership-program`} className="jb-btn-primary">Become a Partner</a>
              <a href={`${p}/global-partnership-program`} className="jb-btn-outline">Explore More</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
