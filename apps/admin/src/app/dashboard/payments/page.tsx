'use client';

import { useCallback, useEffect, useState } from 'react';
import { scheduleUi } from '../../../lib/browser';
import { SectionTitle, DataTable, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { ActionBtn } from '../../../components/AdminFormFields';
import { usePermissions } from '../../../components/PermissionContext';
import { adminApi } from '../../../lib/api';

type PaymentRow = {
  id: number;
  bookingCode: string;
  customer: string;
  method: string;
  amount: string;
  status: string;
  created: string;
};

export default function PaymentsAdminPage() {
  const { can } = usePermissions();
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .getPayments({ limit: 100 })
      .then((res) => {
        setRows(
          (res.data ?? []).map((raw) => {
            const p = raw as Record<string, unknown>;
            const customer = p.customer as { name?: string; email?: string } | null;
            return {
              id: Number(p.id),
              bookingCode: String(p.bookingCode ?? p.bookingId),
              customer: customer?.name || customer?.email || '—',
              method: String(p.method ?? '—'),
              amount: `${p.currency ?? 'USD'} ${Number(p.amount ?? 0).toLocaleString()}`,
              status: String(p.status ?? '—'),
              created: p.createdAt ? String(p.createdAt).slice(0, 10) : '—',
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

  async function exportCsv() {
    try {
      await adminApi.downloadExport('/admin/export/payments?format=csv');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Export failed');
    }
  }

  return (
    <AdminShell active="/dashboard/payments">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <SectionTitle>Payments</SectionTitle>
        {can('payment.export') || can('payment.view') ? (
          <ActionBtn onClick={() => void exportCsv()}>Export CSV</ActionBtn>
        ) : null}
      </div>
      <Muted>Ops view of booking payments (no live refunds in this wave).</Muted>
      {msg ? <p style={{ color: '#fca5a5' }}>{msg}</p> : null}
      {loading ? (
        <Muted>Loading…</Muted>
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'booking', label: 'Booking' },
            { key: 'customer', label: 'Customer' },
            { key: 'method', label: 'Method' },
            { key: 'amount', label: 'Amount' },
            { key: 'status', label: 'Status' },
            { key: 'created', label: 'Created' },
          ]}
          rows={rows.map((r) => ({
            id: String(r.id),
            booking: (
              <a href={`/dashboard/bookings`} style={{ color: '#7dd3fc' }}>
                {r.bookingCode}
              </a>
            ),
            customer: r.customer,
            method: r.method,
            amount: r.amount,
            status: r.status,
            created: r.created,
          }))}
        />
      )}
    </AdminShell>
  );
}
