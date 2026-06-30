'use client';

import { useEffect, useState } from 'react';
import { Card, SectionTitle, Muted, colors } from '@j-ta/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';

export default function SettingsAdminPage() {
  const [health, setHealth] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getHealth()
      .then(setHealth)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell active="/dashboard/settings">
      <SectionTitle>System Health</SectionTitle>
      {loading ? (
        <Muted>Loading…</Muted>
      ) : health ? (
        <div style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
          {Object.entries(health).map(([k, v]) => (
            <Card key={k}>
              <div style={{ fontSize: 14, color: colors.textMuted }}>{k}</div>
              <div style={{ fontSize: 18, color: colors.accent }}>{String(v)}</div>
            </Card>
          ))}
        </div>
      ) : (
        <Muted>Unable to load health status</Muted>
      )}
    </AdminShell>
  );
}
