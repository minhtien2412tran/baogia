'use client';

import { useCallback, useEffect, useState } from 'react';
import { scheduleUi } from '../../../lib/browser';
import { SectionTitle, DataTable, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { ActionBtn } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

const STATUSES = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

type BookingRow = {
  id: number;
  email: string;
  type: string;
  route: string;
  estimate: string;
  status: string;
  created: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .getBookings()
      .then((res) => {
        const data = (res as { data: Record<string, unknown>[] }).data ?? [];
        setBookings(
          data.map((b) => {
            const id = Number(b.id);
            const status = String(b.status ?? b.bookingStatus ?? 'pending');
            return {
              id,
              email: String(b.email ?? b.userEmail ?? '—'),
              type: String(b.bookingType ?? '—'),
              route: String(b.customerRouteSummary ?? '—'),
              estimate:
                b.estimatedPriceTotal != null
                  ? `Giá ước tính ${b.estimatedPriceCurrency ?? 'USD'} ${Number(b.estimatedPriceTotal).toLocaleString()}`
                  : '—',
              status,
              created: b.createdAt ? String(b.createdAt).slice(0, 10) : '—',
            };
          }),
        );
      })
      .catch((e) => setMsg(e instanceof Error ? e.message : 'Load failed'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    scheduleUi(() => {
      void load();
    });
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

  const rows = bookings.map((b) => ({
    id: (
      <a href={`/dashboard/bookings/${b.id}`} style={{ color: '#e6c76a' }}>
        {b.id}
      </a>
    ),
    email: b.email,
    type: b.type,
    route: b.route,
    estimate: b.estimate,
    status: b.status,
    created: b.created,
    actions: (
      <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {STATUSES.filter((s) => s !== b.status).map((s) => (
          <ActionBtn key={s} onClick={() => void updateStatus(b.id, s)}>
            → {s}
          </ActionBtn>
        ))}
      </span>
    ),
  }));

  return (
    <AdminShell active="/dashboard/bookings">
      <SectionTitle>Manage Bookings</SectionTitle>
      {loading ? (
        <Muted>Loading bookings...</Muted>
      ) : !bookings.length ? (
        <Muted>No bookings found.</Muted>
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'email', label: 'Email' },
            { key: 'type', label: 'Type' },
            { key: 'route', label: 'Route' },
            { key: 'estimate', label: 'Giá ước tính' },
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
