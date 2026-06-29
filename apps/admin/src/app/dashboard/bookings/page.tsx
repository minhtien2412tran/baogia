'use client';

import { useEffect, useState } from 'react';
import { SectionTitle, DataTable, Muted } from '@j-ta/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';

export default function BookingsPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getBookings()
      .then((res) => {
        const data = (res as { data: Record<string, unknown>[] }).data ?? [];
        setRows(
          data.map((b) => ({
            id: String(b.id),
            email: String(b.email ?? b.userEmail ?? '—'),
            type: String(b.bookingType ?? '—'),
            status: String(b.status ?? b.bookingStatus ?? '—'),
            created: b.createdAt ? String(b.createdAt).slice(0, 10) : '—',
          })),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
          ]}
          rows={rows}
        />
      )}
    </AdminShell>
  );
}
