'use client';

import { useCallback, useEffect, useState } from 'react';
import { SectionTitle, DataTable, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { ActionBtn, AdminField, AdminPanel, fieldStyle } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

const STATUSES = ['PENDING', 'OFFERED', 'EXPIRED', 'CONVERTED', 'CANCELLED'];

type Operator = { id: number; name: string; region: string };
type AircraftModel = { id: number; manufacturer: string; model: string };

export default function QuotesPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [offerFor, setOfferFor] = useState<number | null>(null);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [models, setModels] = useState<AircraftModel[]>([]);
  const [form, setForm] = useState({
    aircraftModelId: '',
    operatorId: '',
    price: '',
    expiresAt: '',
  });

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .getQuotes({ limit: 50 })
      .then((res) => {
        setRows(
          (res.data ?? []).map((q) => {
            const row = q as Record<string, unknown>;
            const id = Number(row.id);
            const status = String(row.status ?? 'PENDING').toUpperCase();
            return {
              id: String(id),
              name: String(row.name ?? '—'),
              email: String(row.email),
              route: String(row.route ?? '—'),
              offers: String(row.offerCount ?? 0),
              status,
              created: row.createdAt ? String(row.createdAt).slice(0, 10) : '—',
              actions: (
                <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <ActionBtn onClick={() => openOffer(id)}>Offer</ActionBtn>
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

  async function openOffer(id: number) {
    setOfferFor(id);
    setMsg('');
    try {
      const [ops, aircraft] = await Promise.all([
        adminApi.getOperators(),
        adminApi.getAircraftModels(),
      ]);
      setOperators((ops.operators as Operator[]) ?? []);
      const list = (aircraft as { models?: AircraftModel[] }).models ?? [];
      setModels(list);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setForm({
        aircraftModelId: list[0] ? String(list[0].id) : '',
        operatorId: ops.operators?.[0] ? String((ops.operators[0] as Operator).id) : '',
        price: '18500',
        expiresAt: nextWeek.toISOString().slice(0, 16),
      });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Failed to load offer form');
    }
  }

  async function updateStatus(id: number, status: string) {
    try {
      await adminApi.updateQuoteStatus(id, status);
      setMsg(`Quote #${id} → ${status}`);
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Update failed');
    }
  }

  async function submitOffer(e: React.FormEvent) {
    e.preventDefault();
    if (!offerFor) return;
    try {
      await adminApi.createQuoteOffer(offerFor, {
        aircraftModelId: Number(form.aircraftModelId),
        operatorId: Number(form.operatorId),
        price: Number(form.price),
        expiresAt: new Date(form.expiresAt).toISOString(),
      });
      setMsg(`Offer created for quote #${offerFor}`);
      setOfferFor(null);
      load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Create offer failed');
    }
  }

  return (
    <AdminShell active="/dashboard/quotes">
      <SectionTitle>Quote Requests</SectionTitle>

      {offerFor !== null && (
        <AdminPanel title={`Create offer for quote #${offerFor}`} onClose={() => setOfferFor(null)}>
          <form onSubmit={submitOffer}>
            <label style={{ display: 'block', margin: '10px 0' }}>
              <span style={{ display: 'block', marginBottom: 4, fontSize: 13, opacity: 0.7 }}>Aircraft model</span>
              <select
                value={form.aircraftModelId}
                onChange={(e) => setForm((f) => ({ ...f, aircraftModelId: e.target.value }))}
                style={fieldStyle}
                required
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.manufacturer} {m.model}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: 'block', margin: '10px 0' }}>
              <span style={{ display: 'block', marginBottom: 4, fontSize: 13, opacity: 0.7 }}>Operator</span>
              <select
                value={form.operatorId}
                onChange={(e) => setForm((f) => ({ ...f, operatorId: e.target.value }))}
                style={fieldStyle}
                required
              >
                {operators.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.region})
                  </option>
                ))}
              </select>
            </label>
            <AdminField
              label="Price (USD)"
              type="number"
              value={form.price}
              onChange={(v) => setForm((f) => ({ ...f, price: v }))}
              required
            />
            <AdminField
              label="Expires at"
              type="datetime-local"
              value={form.expiresAt}
              onChange={(v) => setForm((f) => ({ ...f, expiresAt: v }))}
              required
            />
            <button
              type="submit"
              style={{
                marginTop: 8,
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                background: '#c9a227',
                color: '#0d1a24',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Create offer
            </button>
          </form>
        </AdminPanel>
      )}

      {loading ? (
        <Muted>Loading quotes...</Muted>
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'route', label: 'Route' },
            { key: 'offers', label: 'Offers' },
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
