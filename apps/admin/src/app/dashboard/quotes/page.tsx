'use client';

import { useEffect, useState } from 'react';
import { SectionTitle, DataTable, Muted } from '@j-ta/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';

export default function QuotesPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getRecentQuotes(50)
      .then((quotes) => {
        setRows(
          (quotes as Record<string, unknown>[]).map((q) => ({
            id: String(q.id),
            name: String(q.name ?? '—'),
            email: String(q.email),
            route: String(q.route ?? '—'),
            status: String(q.status),
            created: q.createdAt ? String(q.createdAt).slice(0, 10) : '—',
          })),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell active="/dashboard/quotes">
      <SectionTitle>Quote Requests</SectionTitle>
      {loading ? (
        <Muted>Loading quotes...</Muted>
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'route', label: 'Route' },
            { key: 'status', label: 'Status' },
            { key: 'created', label: 'Created' },
          ]}
          rows={rows}
        />
      )}
    </AdminShell>
  );
}
