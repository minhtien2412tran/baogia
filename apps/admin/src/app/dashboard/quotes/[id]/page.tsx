'use client';

import { use } from 'react';
import { useEffect, useState } from 'react';
import { Card, SectionTitle, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../../components/AdminShell';
import { ActionBtn, fieldStyle } from '../../../../components/AdminFormFields';
import { usePermissions } from '../../../../components/PermissionContext';
import { adminApi } from '../../../../lib/api';

const STATUSES = ['PENDING', 'OFFERED', 'EXPIRED', 'CONVERTED', 'CANCELLED'];

type QuoteDetail = {
  id: number;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  tripType: string;
  status: string;
  locale?: string;
  currency?: string;
  message?: string;
  createdAt: string;
  legs: Array<{
    seq: number;
    from: string;
    to: string;
    departureAt: string;
    passengers: number;
  }>;
  offers: Array<{
    id: number;
    price: number;
    status: string;
    expiresAt: string;
    aircraft: string;
    category: string;
    operator: string;
  }>;
};

export default function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { can } = usePermissions();
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    void adminApi
      .getQuote(Number(id))
      .then((data) => {
        if (cancelled) return;
        const q = data as unknown as QuoteDetail;
        setQuote(q);
        setStatus(q.status);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load quote');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function saveStatus() {
    if (!quote) return;
    setMsg('');
    try {
      await adminApi.updateQuoteStatus(quote.id, status);
      setQuote({ ...quote, status });
      setMsg(`Status → ${status}`);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Update failed');
    }
  }

  async function downloadPdf() {
    try {
      await adminApi.downloadExport(`/admin/export/quotes/${id}/pdf`);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Export failed');
    }
  }

  return (
    <AdminShell active={`/dashboard/quotes/${id}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <SectionTitle>Quote #{id}</SectionTitle>
        <div style={{ display: 'flex', gap: 8 }}>
          {can('quote.export') || can('quote.view') ? (
            <ActionBtn onClick={() => void downloadPdf()}>PDF</ActionBtn>
          ) : null}
          <a href="/dashboard/quotes" style={{ color: '#9fb3c0', alignSelf: 'center' }}>
            ← Back
          </a>
        </div>
      </div>
      {error ? <p style={{ color: '#fca5a5' }}>{error}</p> : null}
      {msg ? <p style={{ color: '#86efac' }}>{msg}</p> : null}
      {!quote && !error ? (
        <Muted>Loading quote…</Muted>
      ) : quote ? (
        <div style={{ display: 'grid', gap: 16 }}>
          <Card>
            <h3 style={{ marginTop: 0 }}>Customer</h3>
            <p>
              <strong>
                {quote.firstName} {quote.lastName}
              </strong>
            </p>
            <p>{quote.email}</p>
            <p>{quote.phone || '—'}</p>
            <p>
              Locale {quote.locale || '—'} · Currency {quote.currency || '—'}
            </p>
            <p>Created {quote.createdAt.slice(0, 19).replace('T', ' ')}</p>
          </Card>

          <Card>
            <h3 style={{ marginTop: 0 }}>Trip</h3>
            <p>Type: {quote.tripType}</p>
            {can('quote.update') ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'end', flexWrap: 'wrap' }}>
                <label style={{ display: 'block' }}>
                  <span style={{ display: 'block', marginBottom: 4, fontSize: 13, opacity: 0.7 }}>
                    Status
                  </span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ ...fieldStyle, width: 200 }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <ActionBtn onClick={() => void saveStatus()}>Save status</ActionBtn>
              </div>
            ) : (
              <p>Status: {quote.status}</p>
            )}
            {quote.message ? (
              <p style={{ marginTop: 12, opacity: 0.85 }}>{quote.message}</p>
            ) : null}
          </Card>

          <Card>
            <h3 style={{ marginTop: 0 }}>Legs</h3>
            {quote.legs.length === 0 ? (
              <Muted>No legs</Muted>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {quote.legs.map((leg) => (
                  <li key={leg.seq}>
                    {leg.from} → {leg.to} · {leg.departureAt.slice(0, 16).replace('T', ' ')} ·{' '}
                    {leg.passengers} pax
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h3 style={{ marginTop: 0 }}>Offers ({quote.offers.length})</h3>
            {quote.offers.length === 0 ? (
              <Muted>No offers yet</Muted>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {quote.offers.map((o) => (
                  <li key={o.id}>
                    #{o.id} · {o.aircraft} ({o.category}) · {o.operator} ·{' '}
                    {o.price.toLocaleString()} · {o.status}
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
