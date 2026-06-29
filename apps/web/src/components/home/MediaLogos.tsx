const MEDIA = ['The Business Times', 'Markets Insider', 'Supercar Blondie', 'EIN Presswire', 'Business Air News'];
const MEMBERSHIPS = ['WYVERN', 'AsBAA', 'NBAA', 'BBGA', 'EBAA', 'ACA'];

export function MediaLogos() {
  return (
    <section className="jb-section" style={{ padding: '24px 0' }}>
      <div className="jb-container">
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--jb-text-muted)', marginBottom: 24 }}>Featured Media</p>
        <div className="jb-logos-row">
          {MEDIA.map((m) => (
            <span key={m} className="jb-logo-placeholder">{m}</span>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--jb-text-muted)', margin: '32px 0 24px' }}>Industry Membership</p>
        <div className="jb-logos-row">
          {MEMBERSHIPS.map((m) => (
            <span key={m} className="jb-logo-placeholder">{m}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
