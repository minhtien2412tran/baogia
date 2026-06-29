const STATS = [
  { num: '10K+', label: 'Clients Served Worldwide', desc: 'Serving clients across 190+ countries with seamless global access.' },
  { num: 'No.1', label: "Asia's Transaction Volume", desc: 'Leading private aviation transactions across Asia.' },
  { num: '190+', label: 'Countries Flown', desc: 'Coverage across major cities and remote destinations worldwide.' },
  { num: '5K+', label: 'Annual Flights', desc: 'A trusted network supporting thousands of flights each year.' },
];

export function StatsSection() {
  return (
    <section className="jb-stats">
      <div className="jb-container">
        <div style={{ textAlign: 'center', paddingTop: 48 }}>
          <h2 className="jb-section-title">A leading global private jet charter platform</h2>
          <p className="jb-section-desc">Trusted Worldwide</p>
        </div>
        <div className="jb-stats-grid">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="jb-stat-num">{s.num}</div>
              <div className="jb-stat-label">{s.label}</div>
              <p className="jb-stat-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
