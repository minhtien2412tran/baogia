'use client';

import { useCallback, useEffect, useState } from 'react';
import { SectionTitle, DataTable, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { ActionBtn } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

const STATUSES = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

export default function BookingsPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .getBookings()
      .then((res) => {
        const data = (res as { data: Record<string, unknown>[] }).data ?? [];
        setRows(
          data.map((b) => {
            const id = Number(b.id);
            const status = String(b.status ?? b.bookingStatus ?? 'pending');
            return {
              id: String(id),
              email: String(b.email ?? b.userEmail ?? '—'),
              type: String(b.bookingType ?? '—'),
              route: String(b.customerRouteSummary ?? '—'),
              estimate:
                b.estimatedPriceTotal != null
                  ? `Giá ước tính ${b.estimatedPriceCurrency ?? 'USD'} ${Number(b.estimatedPriceTotal).toLocaleString()}`
                  : '—',
              status,
              created: b.createdAt ? String(b.createdAt).slice(0, 10) : '—',
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
      await adminApi.updateBookingStatus(id, status);
      setMsg(`Booking #${id} → ${status}`);
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Update failed');
    }
  }

  return (
    <AdminShell active="/dashboard/bookings">
      <SectionTitle>Manage Bookings</SectionTitle>
      {loading ? (
        <Muted>Loading bookings...</Muted>
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'email', label: 'Email' },
            { key: 'type', label: 'Type' },
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
