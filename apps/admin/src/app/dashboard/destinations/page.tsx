'use client';

import { useEffect, useState } from 'react';
import { SectionTitle, Muted } from '@j-ta/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';

type DestRow = {
  id: number;
  slug: string;
  category: string;
  city: string;
  country: string;
  title?: string;
  status?: string;
};

export default function DestinationsAdminPage() {
  const [rows, setRows] = useState<DestRow[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getDestinations(filter || undefined)
      .then((res) => setRows((res.data ?? []) as DestRow[]))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <AdminShell active="/dashboard/destinations">
      <SectionTitle>Destinations</SectionTitle>
      <Muted>Curated island, ski, and golf destinations served via GET /content/destinations.</Muted>

      <div style={{ margin: '16px 0', display: 'flex', gap: 8 }}>
        {['', 'ISLAND', 'SKI', 'GOLF'].map((c) => (
          <button
            key={c || 'all'}
            type="button"
            onClick={() => {
              setLoading(true);
              setFilter(c);
            }}
            style={{ padding: '6px 12px', cursor: 'pointer' }}
          >
            {c || 'All'}
          </button>
        ))}
      </div>

      {loading && <Muted>Loading…</Muted>}
      {error && <p style={{ color: '#c44' }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              <th align="left">City</th>
              <th align="left">Category</th>
              <th align="left">Slug</th>
              <th align="left">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id}>
                <td>{d.title ?? d.city}</td>
                <td>{d.category}</td>
                <td>
                  <code>{d.slug}</code>
                </td>
                <td>{d.status ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminShell>
  );
}
