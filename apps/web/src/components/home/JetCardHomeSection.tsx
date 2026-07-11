import { jetCardArt } from '../../config/jetbay-cdn';
import { CdnImage } from '../ui/CdnImage';

type Plan = Record<string, unknown>;

const PLAN_COPY: Record<number, { subtitle: string; desc: string }> = {
  10: { subtitle: 'Occasional private flyers', desc: 'Flexibility without long-term commitment' },
  25: { subtitle: 'Business travellers & executives', desc: 'Lower hourly rates, priority booking' },
  50: { subtitle: 'Frequent global travellers', desc: 'Best value, ultimate convenience' },
};

export function JetCardHomeSection({ locale, plans }: { locale: string; plans: Plan[] }) {
  const p = `/${locale}`;

  if (plans.length === 0) {
    return null;
  }

  return (
    <section className="jb-section">
      <div className="jb-container">
        <span className="jb-tag">Jet Card</span>
        <div className="jb-section-header">
          <div>
            <h2 className="jb-section-title">Elevate Your Travel with The JetBay Jet Card</h2>
          </div>
          <a href={`${p}/jet-card`} className="jb-link-gold">More information about Jet Card →</a>
        </div>

        <div className="jb-jetcard-grid jb-jetcard-grid--premium">
          {plans.map((plan) => {
            const hours = Number(plan.hours ?? 10);
            const copy = PLAN_COPY[hours] ?? { subtitle: String(plan.name), desc: '' };
            return (
              <div key={String(plan.id)} className="jb-jetcard-item">
                <div className="jb-jetcard-art">
                  <CdnImage
                    src={jetCardArt(hours)}
                    alt={`${hours} hour Jet Card`}
                    fill
                    sizes="(max-width:900px) 100vw, 33vw"
                    className="jb-jetcard-img"
                  />
                </div>
                <div className="jb-jetcard-body">
                  <div className="jb-jetcard-hours">{hours} Hour Jet Card</div>
                  <div className="jb-jetcard-tagline">{copy.subtitle}</div>
                  <div className="jb-jetcard-subtitle">{copy.desc}</div>
                  <a href={`${p}/jet-card`} className="jb-unlock-link">
                    Unlock Now ›
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="jb-cta-row" style={{ justifyContent: 'center', marginTop: 32 }}>
          <a href={`${p}/jet-card`} className="jb-btn-primary">Apply for Jet Card</a>
        </div>
      </div>
    </section>
  );
}
