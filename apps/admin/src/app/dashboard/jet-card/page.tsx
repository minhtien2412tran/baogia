'use client';

import { useEffect, useState } from 'react';
import { SectionTitle, DataTable, Muted } from '@j-ta/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';

export default function JetCardAdminPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getJetCardPlans()
      .then((res) => {
        setRows(
          (res.plans as Record<string, unknown>[]).map((p) => ({
            id: String(p.id),
            name: String(p.name),
            hours: String(p.hours),
            price: p.price != null ? `USD ${Number(p.price).toLocaleString()}` : '—',
            validity: String(p.validityYears ?? '—'),
          })),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell active="/dashboard/jet-card">
      <SectionTitle>Jet Card Plans</SectionTitle>
      {loading ? <Muted>Loading plans…</Muted> : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'hours', label: 'Hours' },
            { key: 'price', label: 'Price' },
            { key: 'validity', label: 'Validity (yrs)' },
          ]}
          rows={rows}
        />
      )}
    </AdminShell>
  );
}
