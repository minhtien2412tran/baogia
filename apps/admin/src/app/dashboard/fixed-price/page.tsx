'use client';

import { useEffect, useState } from 'react';
import { SectionTitle, DataTable, Muted } from '@j-ta/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';

export default function FixedPricePage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getFixedPriceRoutes()
      .then((res) => {
        const routes = (res as { routes: Record<string, unknown>[] }).routes ?? [];
        setRows(
          routes.map((r) => ({
            slug: String(r.slug),
            route: `${(r.fromAirport as { iata: string })?.iata ?? '?'} → ${(r.toAirport as { iata: string })?.iata ?? '?'}`,
            region: String(r.region ?? '—'),
            status: r.isActive === false ? 'inactive' : 'active',
          })),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell active="/dashboard/fixed-price">
      <SectionTitle>Fixed Price Routes</SectionTitle>
      {loading ? (
        <Muted>Loading routes...</Muted>
      ) : (
        <DataTable
          columns={[
            { key: 'slug', label: 'Slug' },
            { key: 'route', label: 'Route' },
            { key: 'region', label: 'Region' },
            { key: 'status', label: 'Status' },
          ]}
          rows={rows}
        />
      )}
    </AdminShell>
  );
}
