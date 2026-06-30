import { api, safeApi } from '../../lib/api';

export async function PartnerProgramsStrip() {
  const data = await safeApi(() => api.getPartnerPrograms(), { roles: [] });
  if (data.roles.length === 0) return null;

  return (
    <div className="jb-partner-strip">
      {data.roles.map((role) => (
        <div key={role.code} className="jb-partner-strip-item">
          <strong>{role.name}</strong>
          <span>{role.commission} commission</span>
        </div>
      ))}
    </div>
  );
}
