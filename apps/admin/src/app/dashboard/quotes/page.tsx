'use client';

import { useCallback, useEffect, useState } from 'react';
import { SectionTitle, DataTable, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { ActionBtn } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

const STATUSES = ['PENDING', 'OFFERED', 'EXPIRED', 'CONVERTED', 'CANCELLED'];

export default function QuotesPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .getRecentQuotes(50)
      .then((quotes) => {
        setRows(
          (quotes as Record<string, unknown>[]).map((q) => {
            const id = Number(q.id);
            const status = String(q.status ?? 'PENDING').toUpperCase();
            return {
              id: String(id),
              name: String(q.name ?? '—'),
              email: String(q.email),
              route: String(q.route ?? '—'),
              status,
              created: q.createdAt ? String(q.createdAt).slice(0, 10) : '—',
              actions: (
                <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {STATUSES.filter((s) => s !== status).map((s) => (
                    <ActionBtn key={s} onClick={() => updateStatus(id, s)}>
                      → {s}
                    </ActionBtn>
                  ))}
                </span>
              ),
            };
          }),
        );
      })
      .catch((e) => setMsg(e instanceof Error ? e.message : 'Load failed'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: number, status: string) {
    try {
      await adminApi.updateQuoteStatus(id, status);
      setMsg(`Quote #${id} → ${status}`);
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Update failed');
    }
  }

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
            { key: 'actions', label: 'Actions' },
          ]}
          rows={rows}
        />
      )}
      {msg && <p style={{ marginTop: 12, color: '#4ade80' }}>{msg}</p>}
    </AdminShell>
  );
}
