'use client';

import { useEffect, useState } from 'react';
import { SectionTitle, DataTable, Muted } from '@j-ta/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';

export default function EmptyLegsPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getEmptyLegs()
      .then((res) => {
        const legs = res.emptyLegs ?? [];
        setRows(
          (legs as Record<string, unknown>[]).map((el) => ({
            slug: String(el.slug),
            route: `${(el.fromAirport as { iata: string })?.iata ?? '?'} → ${(el.toAirport as { iata: string })?.iata ?? '?'}`,
            discount: el.discountPct != null ? `${el.discountPct}%` : '—',
            price: el.priceUsd != null ? `USD ${Number(el.priceUsd).toLocaleString()}` : '—',
          })),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell active="/dashboard/empty-legs">
      <SectionTitle>Empty Legs</SectionTitle>
      {loading ? (
        <Muted>Loading empty legs...</Muted>
      ) : (
        <DataTable
          columns={[
            { key: 'slug', label: 'Slug' },
            { key: 'route', label: 'Route' },
            { key: 'discount', label: 'Discount' },
            { key: 'price', label: 'Price' },
          ]}
          rows={rows}
        />
      )}
    </AdminShell>
  );
}
