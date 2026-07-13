'use client';

import { useCallback, useEffect, useState } from 'react';
import { scheduleUi } from '../../../lib/browser';
import { SectionTitle, DataTable, Muted, Button } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { AdminField, AdminPanel, ActionBtn, ConfirmDialog } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

type LegRow = {
  id: number;
  slug: string;
  fromAirportIata: string;
  toAirportIata: string;
  departAt: string;
  aircraftModelId: number;
  price: number;
  discountPct: number;
  status: string;
};

const emptyForm = (): LegRow => ({
  id: 0,
  slug: '',
  fromAirportIata: '',
  toAirportIata: '',
  departAt: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
  aircraftModelId: 1,
  price: 5000,
  discountPct: 40,
  status: 'ACTIVE',
});

export default function EmptyLegsPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<LegRow | null>(null);
  const [msg, setMsg] = useState('');
  const [pendingDelete, setPendingDelete] = useState<number | string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .getEmptyLegs()
      .then((res) => {
        const legs = (res.emptyLegs as Record<string, unknown>[]) ?? [];
        setRows(
          legs.map((el) => ({
            id: String(el.id),
            slug: String(el.slug),
            route: `${(el.fromAirport as { iata: string })?.iata ?? '?'} → ${(el.toAirport as { iata: string })?.iata ?? '?'}`,
            discount: el.discountPct != null ? `${el.discountPct}%` : '—',
            price: el.price != null ? `USD ${Number(el.price).toLocaleString()}` : '—',
            actions: (
              <span>
                <ActionBtn
                  onClick={() =>
                    setForm({
                      id: Number(el.id),
                      slug: String(el.slug),
                      fromAirportIata: String((el.fromAirport as { iata?: string })?.iata ?? ''),
                      toAirportIata: String((el.toAirport as { iata?: string })?.iata ?? ''),
                      departAt: String(el.departAt ?? '').slice(0, 16),
                      aircraftModelId: Number((el.aircraftModel as { id?: number })?.id ?? 1),
                      price: Number(el.price ?? 0),
                      discountPct: Number(el.discountPct ?? 0),
                      status: String(el.status ?? 'ACTIVE'),
                    })
                  }
                >
                  Edit
                </ActionBtn>
                {' · '}
                <ActionBtn variant="danger" onClick={() => setPendingDelete(Number(el.id))}>Delete</ActionBtn>
              </span>
            ),
          })),
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

  async function save() {
    if (!form) return;
    setSaving(true);
    setMsg('');
    try {
      const body = {
        slug: form.slug,
        fromAirportIata: form.fromAirportIata,
        toAirportIata: form.toAirportIata,
        departAt: new Date(form.departAt).toISOString(),
        aircraftModelId: form.aircraftModelId,
        price: form.price,
        discountPct: form.discountPct,
        status: form.status,
      };
      if (form.id) {
        await adminApi.updateEmptyLeg(form.id, body);
        setMsg('Empty leg updated.');
      } else {
        await adminApi.createEmptyLeg(body);
        setMsg('Empty leg created.');
      }
      setForm(null);
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    try {
      await adminApi.deleteEmptyLeg(id);
      setMsg('Deleted.');
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <AdminShell active="/dashboard/empty-legs">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <SectionTitle>Empty Legs</SectionTitle>
        <Button type="button" onClick={() => setForm(emptyForm())}>+ New Empty Leg</Button>
      </div>

      {form && (
        <AdminPanel title={form.id ? `Edit #${form.id}` : 'New Empty Leg'} onClose={() => setForm(null)}>
          <AdminField label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
          <AdminField label="From IATA" value={form.fromAirportIata} onChange={(v) => setForm({ ...form, fromAirportIata: v.toUpperCase() })} required />
          <AdminField label="To IATA" value={form.toAirportIata} onChange={(v) => setForm({ ...form, toAirportIata: v.toUpperCase() })} required />
          <AdminField label="Departure (local)" value={form.departAt} onChange={(v) => setForm({ ...form, departAt: v })} type="datetime-local" />
          <AdminField label="Aircraft Model ID" value={String(form.aircraftModelId)} onChange={(v) => setForm({ ...form, aircraftModelId: Number(v) })} type="number" />
          <AdminField label="Price (USD)" value={String(form.price)} onChange={(v) => setForm({ ...form, price: Number(v) })} type="number" />
          <AdminField label="Discount %" value={String(form.discountPct)} onChange={(v) => setForm({ ...form, discountPct: Number(v) })} type="number" />
          <AdminField label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v })} />
          <Button type="button" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        </AdminPanel>
      )}

      {loading ? <Muted>Loading empty legs...</Muted> : (
        <DataTable
          columns={[
            { key: 'slug', label: 'Slug' },
            { key: 'route', label: 'Route' },
            { key: 'discount', label: 'Discount' },
            { key: 'price', label: 'Price' },
            { key: 'actions', label: 'Actions' },
          ]}
          rows={rows}
        />
      )}
      {msg && <p style={{ marginTop: 12, color: '#4ade80' }}>{msg}</p>}
          <ConfirmDialog
        open={pendingDelete != null}
        title="Confirm delete"
        message="Delete this item? This cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          const id = pendingDelete;
          setPendingDelete(null);
          if (id != null) void remove(id as never);
        }}
      />
    </AdminShell>
  );
}
