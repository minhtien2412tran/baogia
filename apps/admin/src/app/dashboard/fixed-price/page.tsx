'use client';

import { useCallback, useEffect, useState } from 'react';
import { SectionTitle, DataTable, Muted, Button } from '@j-ta/ui';
import { AdminShell } from '../../../components/AdminShell';
import { AdminField, AdminPanel, ActionBtn } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

type RouteRow = {
  id: number;
  slug: string;
  fromAirportIata: string;
  toAirportIata: string;
  region: string;
  status: string;
};

const emptyForm = (): RouteRow => ({
  id: 0,
  slug: '',
  fromAirportIata: '',
  toAirportIata: '',
  region: 'Europe',
  status: 'ACTIVE',
});

export default function FixedPricePage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [raw, setRaw] = useState<RouteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<RouteRow | null>(null);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .getAdminFixedPriceRoutes()
      .then((res) => {
        const routes = (res.routes as Record<string, unknown>[]) ?? [];
        const mapped: RouteRow[] = routes.map((r) => ({
          id: Number(r.id),
          slug: String(r.slug),
          fromAirportIata: String((r.fromAirport as { iata?: string })?.iata ?? ''),
          toAirportIata: String((r.toAirport as { iata?: string })?.iata ?? ''),
          region: String(r.region ?? ''),
          status: String(r.status ?? 'ACTIVE'),
        }));
        setRaw(mapped);
        setRows(
          mapped.map((r) => ({
            slug: r.slug,
            route: `${r.fromAirportIata} → ${r.toAirportIata}`,
            region: r.region,
            status: r.status,
            actions: (
              <span>
                <ActionBtn onClick={() => setForm({ ...r })}>Edit</ActionBtn>
                {' · '}
                <ActionBtn variant="danger" onClick={() => remove(r.id)}>Delete</ActionBtn>
              </span>
            ),
          })),
        );
      })
      .catch((e) => setMsg(e instanceof Error ? e.message : 'Load failed'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
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
        region: form.region,
        status: form.status,
      };
      if (form.id) {
        await adminApi.updateFixedPriceRoute(form.id, body);
        setMsg('Route updated.');
      } else {
        await adminApi.createFixedPriceRoute(body);
        setMsg('Route created.');
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
    if (!confirm('Delete this route?')) return;
    try {
      await adminApi.deleteFixedPriceRoute(id);
      setMsg('Route deleted.');
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <AdminShell active="/dashboard/fixed-price">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <SectionTitle>Fixed Price Routes</SectionTitle>
        <Button type="button" onClick={() => setForm(emptyForm())}>+ New Route</Button>
      </div>

      {form && (
        <AdminPanel title={form.id ? `Edit #${form.id}` : 'New Route'} onClose={() => setForm(null)}>
          <AdminField label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
          <AdminField label="From IATA" value={form.fromAirportIata} onChange={(v) => setForm({ ...form, fromAirportIata: v.toUpperCase() })} required />
          <AdminField label="To IATA" value={form.toAirportIata} onChange={(v) => setForm({ ...form, toAirportIata: v.toUpperCase() })} required />
          <AdminField label="Region" value={form.region} onChange={(v) => setForm({ ...form, region: v })} required />
          <AdminField label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v })} />
          <Button type="button" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        </AdminPanel>
      )}

      {loading ? <Muted>Loading routes...</Muted> : (
        <DataTable
          columns={[
            { key: 'slug', label: 'Slug' },
            { key: 'route', label: 'Route' },
            { key: 'region', label: 'Region' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' },
          ]}
          rows={rows}
        />
      )}
      {msg && <p style={{ marginTop: 12, color: '#4ade80' }}>{msg}</p>}
    </AdminShell>
  );
}
