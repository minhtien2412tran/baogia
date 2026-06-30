import { api, safeApi } from '../../lib/api';

export async function WorldCupMatchesSection() {
  const data = await safeApi(() => api.getWorldCupMatches(), { matches: [] });

  if (data.matches.length === 0) return null;

  return (
    <section className="jb-sub-section jb-light-band">
      <div className="jb-container">
        <h2 className="jb-section-title">World Cup 2026 matches</h2>
        <p className="jb-section-desc">Fly private to host cities with fixed routes and on-demand charter.</p>
        <div className="jb-pricing-tiers">
          {data.matches.map((m: Record<string, unknown>) => (
            <div key={String(m.id)} className="jb-pricing-tier-card">
              <div>
                <div className="jb-tier-label">
                  {String(m.homeTeam)} vs {String(m.awayTeam)}
                </div>
                <div className="jb-tier-pax">{String(m.hostCity)}</div>
              </div>
              <div className="jb-tier-price" style={{ fontSize: 14 }}>
                {m.matchDate ? new Date(String(m.matchDate)).toLocaleDateString() : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
