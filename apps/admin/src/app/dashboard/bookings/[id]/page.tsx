'use client';

import { use } from 'react';
import { useEffect, useState } from 'react';
import { Card, SectionTitle, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../../components/AdminShell';
import { ActionBtn, fieldStyle } from '../../../../components/AdminFormFields';
import { usePermissions } from '../../../../components/PermissionContext';
import { adminApi } from '../../../../lib/api';

type BookingDetail = {
  id: number;
  bookingCode?: string;
  status?: string;
  estimatedPriceTotal?: number | null;
  estimatedPriceCurrency?: string;
  createdAt?: string;
  contact?: { email?: string; firstName?: string; lastName?: string; phone?: string };
  itinerary?: {
    tripType?: string;
    legs?: Array<{ fromAirport: string; toAirport: string; departureAt: string }>;
  };
  payments?: Array<{
    id: number;
    method?: string;
    amount: number;
    currency?: string;
    status: string;
  }>;
  paymentStatus?: string;
};

const BOOKING_STATUSES = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { can } = usePermissions();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    void adminApi
      .getBooking(Number(id))
      .then((data) => {
        if (cancelled) return;
        const b = data as unknown as BookingDetail;
        setBooking(b);
        setStatus(String(b.status ?? 'pending').toLowerCase());
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load booking');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function saveStatus() {
    if (!booking) return;
    setMsg('');
    try {
      await adminApi.updateBookingStatus(booking.id, status);
      setBooking({ ...booking, status });
      setMsg(`Status → ${status}`);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Update failed');
    }
  }

  async function downloadPdf() {
    try {
      await adminApi.downloadExport(`/admin/export/bookings/${id}/pdf`);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Export failed');
    }
  }

  const code = booking?.bookingCode ?? `#${id}`;
  const email = booking?.contact?.email ?? '—';

  return (
    <AdminShell active={`/dashboard/bookings/${id}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <SectionTitle>Booking {code}</SectionTitle>
        <div style={{ display: 'flex', gap: 8 }}>
          {can('booking.export') || can('booking.view') ? (
            <ActionBtn onClick={() => void downloadPdf()}>PDF</ActionBtn>
          ) : null}
          <a href="/dashboard/bookings" style={{ color: '#9fb3c0', alignSelf: 'center' }}>
            ← Back
          </a>
        </div>
      </div>
      {error ? <p style={{ color: '#fca5a5' }}>{error}</p> : null}
      {msg ? <p style={{ color: '#86efac' }}>{msg}</p> : null}
      {!booking && !error ? (
        <Muted>Loading booking…</Muted>
      ) : booking ? (
        <div style={{ display: 'grid', gap: 16 }}>
          <Card>
            <h3 style={{ marginTop: 0 }}>Summary</h3>
            <p>
              Customer: {booking.contact?.firstName} {booking.contact?.lastName} · {email}
            </p>
            <p>
              Total:{' '}
              {booking.estimatedPriceTotal != null
                ? `${booking.estimatedPriceCurrency ?? 'USD'} ${Number(booking.estimatedPriceTotal).toLocaleString()}`
                : '—'}
            </p>
            <p>Created: {booking.createdAt?.slice(0, 19).replace('T', ' ') ?? '—'}</p>
            {can('booking.update') ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'end', flexWrap: 'wrap' }}>
                <label>
                  <span style={{ display: 'block', marginBottom: 4, fontSize: 13, opacity: 0.7 }}>
                    Status
                  </span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ ...fieldStyle, width: 200 }}
                  >
                    {BOOKING_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <ActionBtn onClick={() => void saveStatus()}>Save status</ActionBtn>
              </div>
            ) : (
              <p>Status: {status || '—'}</p>
            )}
          </Card>

          <Card>
            <h3 style={{ marginTop: 0 }}>Itinerary</h3>
            {!booking.itinerary?.legs?.length ? (
              <Muted>No itinerary</Muted>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {booking.itinerary.legs.map((leg, i) => (
                  <li key={`${leg.fromAirport}-${leg.toAirport}-${i}`}>
                    {leg.fromAirport} → {leg.toAirport} ·{' '}
                    {leg.departureAt.slice(0, 16).replace('T', ' ')}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h3 style={{ marginTop: 0 }}>Payments</h3>
            <p>Payment status: {booking.paymentStatus ?? '—'}</p>
            {!booking.payments?.length ? (
              <Muted>No payment rows</Muted>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {booking.payments.map((p) => (
                  <li key={p.id}>
                    #{p.id} · {p.method ?? '—'} · {p.currency ?? 'USD'}{' '}
                    {Number(p.amount).toLocaleString()} · {p.status}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      ) : null}
    </AdminShell>
  );
}
