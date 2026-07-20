'use client';

import { use } from 'react';
import { useEffect, useState } from 'react';
import { Card, SectionTitle, Muted, DataTable } from '@jetbay/ui';
import { AdminShell } from '../../../../components/AdminShell';
import { ActionBtn, AdminField, fieldStyle } from '../../../../components/AdminFormFields';
import { usePermissions } from '../../../../components/PermissionContext';
import { adminApi } from '../../../../lib/api';

type Customer360 = {
  user: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role: string;
    status: string;
  };
  quotes?: Array<{ id: number; status: string; createdAt: string }>;
  bookings?: Array<{
    id: number;
    bookingCode: string;
    bookingStatus: string;
    estimatedPriceTotal?: number;
    estimatedPriceCurrency?: string;
    createdAt: string;
  }>;
};

export default function Customer360Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { can } = usePermissions();
  const [data, setData] = useState<Customer360 | null>(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', role: '', status: '' });

  useEffect(() => {
    let cancelled = false;
    void adminApi
      .getCustomer360(Number(id))
      .then((raw) => {
        if (cancelled) return;
        const payload = raw as unknown as Customer360 & Record<string, unknown>;
        const user =
          payload.user ??
          ({
            id: Number(payload.id),
            email: String(payload.email ?? ''),
            firstName: String(payload.firstName ?? ''),
            lastName: String(payload.lastName ?? ''),
            phone: String(payload.phone ?? ''),
            role: String(payload.role ?? 'USER'),
            status: String(payload.status ?? 'ACTIVE'),
          } as Customer360['user']);
        const quotes = (payload.quotes ?? payload.quoteRequests ?? []) as Customer360['quotes'];
        const bookings = (payload.bookings ?? []) as Customer360['bookings'];
        setData({ user, quotes, bookings });
        setForm({
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          role: user.role,
          status: user.status,
        });
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load customer');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function save() {
    if (!data) return;
    setMsg('');
    try {
      await adminApi.updateUser(data.user.id, form);
      setData({
        ...data,
        user: { ...data.user, ...form },
      });
      setMsg('Saved');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    }
  }

  return (
    <AdminShell active="/dashboard/users">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <SectionTitle>Customer 360 #{id}</SectionTitle>
        <a href="/dashboard/users" style={{ color: '#9fb3c0', alignSelf: 'center' }}>
          ← Back
        </a>
      </div>
      {error ? <p style={{ color: '#fca5a5' }}>{error}</p> : null}
      {msg ? <p style={{ color: '#86efac' }}>{msg}</p> : null}
      {!data && !error ? (
        <Muted>Loading customer…</Muted>
      ) : data ? (
        <div style={{ display: 'grid', gap: 16 }}>
          <Card>
            <h3 style={{ marginTop: 0 }}>Profile</h3>
            <p>{data.user.email}</p>
            <p>{data.user.phone || '—'}</p>
            {can('user.manage') ? (
              <div style={{ maxWidth: 420 }}>
                <AdminField
                  label="First name"
                  value={form.firstName}
                  onChange={(v) => setForm({ ...form, firstName: v })}
                />
                <AdminField
                  label="Last name"
                  value={form.lastName}
                  onChange={(v) => setForm({ ...form, lastName: v })}
                />
                <label style={{ display: 'block', margin: '10px 0' }}>
                  <span style={{ display: 'block', marginBottom: 4, fontSize: 13, opacity: 0.7 }}>
                    Role
                  </span>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    style={fieldStyle}
                  >
                    {['USER', 'SALES', 'CONTRACT_APPROVER', 'ADMIN'].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
                <label style={{ display: 'block', margin: '10px 0' }}>
                  <span style={{ display: 'block', marginBottom: 4, fontSize: 13, opacity: 0.7 }}>
                    Status
                  </span>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    style={fieldStyle}
                  >
                    {['ACTIVE', 'SUSPENDED'].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <ActionBtn onClick={() => void save()}>Save</ActionBtn>
              </div>
            ) : null}
          </Card>

          <Card>
            <h3 style={{ marginTop: 0 }}>Quotes</h3>
            <DataTable
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'status', label: 'Status' },
                { key: 'created', label: 'Created' },
              ]}
              rows={(data.quotes ?? []).map((q) => ({
                id: (
                  <a href={`/dashboard/quotes/${q.id}`} style={{ color: '#7dd3fc' }}>
                    {q.id}
                  </a>
                ),
                status: q.status,
                created: q.createdAt?.slice?.(0, 10) ?? '—',
              }))}
            />
          </Card>

          <Card>
            <h3 style={{ marginTop: 0 }}>Bookings</h3>
            <DataTable
              columns={[
                { key: 'code', label: 'Code' },
                { key: 'status', label: 'Status' },
                { key: 'total', label: 'Total' },
                { key: 'created', label: 'Created' },
              ]}
              rows={(data.bookings ?? []).map((b) => ({
                code: (
                  <a href={`/dashboard/bookings/${b.id}`} style={{ color: '#7dd3fc' }}>
                    {b.bookingCode}
                  </a>
                ),
                status: b.bookingStatus,
                total:
                  b.estimatedPriceTotal != null
                    ? `${b.estimatedPriceCurrency ?? 'USD'} ${Number(b.estimatedPriceTotal).toLocaleString()}`
                    : '—',
                created: b.createdAt?.slice?.(0, 10) ?? '—',
              }))}
            />
          </Card>
        </div>
      ) : null}
    </AdminShell>
  );
}
