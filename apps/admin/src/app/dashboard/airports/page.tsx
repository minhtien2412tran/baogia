'use client';

import { useEffect, useState } from 'react';
import { SectionTitle, DataTable, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';

export default function AirportsAdminPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getAirports()
      .then((res) => {
        const list = (res as { data?: unknown[] }).data ?? [];
        setRows(
          (list as Record<string, unknown>[]).map((a) => ({
            iata: String(a.iata),
            city: String(a.city),
            country: String(a.country),
            name: String(a.name ?? '—'),
          })),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell active="/dashboard/airports">
      <SectionTitle>Airports</SectionTitle>
      {loading ? <Muted>Loading airports…</Muted> : (
        <DataTable
          columns={[
            { key: 'iata', label: 'IATA' },
            { key: 'city', label: 'City' },
            { key: 'country', label: 'Country' },
            { key: 'name', label: 'Name' },
          ]}
          rows={rows}
        />
      )}
    </AdminShell>
  );
}
