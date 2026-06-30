import { api, safeApi } from '../../lib/api';

export async function PartnerProgramsSection() {
  const data = await safeApi(() => api.getPartnerPrograms(), { roles: [] });

  if (data.roles.length === 0) return null;

  return (
    <section className="jb-sub-section jb-light-band">
      <div className="jb-container">
        <h2 className="jb-section-title">Partnership tiers</h2>
        <p className="jb-section-desc">Compare commission levels and benefits across J-TA partner programs.</p>
        <div className="jb-jetcard-grid">
          {data.roles.map((role) => (
            <div key={role.code} className="jb-jetcard-item">
              <div className="jb-jetcard-hours">{role.commission}</div>
              <div style={{ fontWeight: 600 }}>{role.name}</div>
              <ul className="jb-bullet-list" style={{ marginTop: 12, fontSize: 14 }}>
                {role.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
