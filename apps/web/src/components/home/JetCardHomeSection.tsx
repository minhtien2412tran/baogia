type Plan = Record<string, unknown>;

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
            <h2 className="jb-section-title">Elevate Your Travel with The J-TA Jet Card</h2>
          </div>
          <a href={`${p}/jet-card`} className="jb-link-gold">Explore J-TA Jet Card benefits →</a>
        </div>

        <div className="jb-jetcard-grid">
          {plans.map((plan) => (
            <div key={String(plan.id)} className="jb-jetcard-item">
              <div className="jb-jetcard-hours">{String(plan.hours)} Hour</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{String(plan.name)}</div>
              <div className="jb-jetcard-subtitle">USD {Number(plan.price).toLocaleString()}</div>
              <p style={{ fontSize: 14, color: 'var(--jb-text-muted)', margin: '0 0 20px' }}>
                {plan.validityYears ? `${String(plan.validityYears)} year validity · ` : ''}From USD {Number(plan.price).toLocaleString()}
              </p>
              <a href={`${p}/jet-card`} className="jb-unlock-link">Unlock Now ›</a>
            </div>
          ))}
        </div>

        <div className="jb-cta-row" style={{ justifyContent: 'center', marginTop: 32 }}>
          <a href={`${p}/jet-card`} className="jb-btn-primary">Apply for Jet Card</a>
        </div>
      </div>
    </section>
  );
}
