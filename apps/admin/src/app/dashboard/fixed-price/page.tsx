'use client';

import { useCallback, useEffect, useState } from 'react';
import { scheduleUi } from '../../../lib/browser';
import { SectionTitle, DataTable, Muted, Button } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { AdminField, AdminPanel, ActionBtn, fieldStyle, ConfirmDialog } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

type PriceOptionRow = {
  categoryCode: string;
  price: string;
  paxLimit: string;
  includedTerms: string;
};

type RouteRow = {
  id: number;
  slug: string;
  fromAirportIata: string;
  toAirportIata: string;
  region: string;
  status: string;
  options: PriceOptionRow[];
};

const CATEGORY_PRESETS = ['LIGHT', 'MIDSIZE', 'HEAVY', 'ULTRA_LONG_RANGE'];

const emptyOption = (): PriceOptionRow => ({
  categoryCode: 'LIGHT',
  price: '',
  paxLimit: '4',
  includedTerms: '',
});

const emptyForm = (): RouteRow => ({
  id: 0,
  slug: '',
  fromAirportIata: '',
  toAirportIata: '',
  region: 'Europe',
  status: 'ACTIVE',
  options: [emptyOption()],
});

function mapOptions(raw: Record<string, unknown>[]): PriceOptionRow[] {
  if (!raw.length) return [emptyOption()];
  return raw.map((o) => ({
    categoryCode: String(o.category ?? o.categoryCode ?? 'LIGHT'),
    price: String(o.price ?? ''),
    paxLimit: String(o.paxLimit ?? '4'),
    includedTerms: String(o.includedTerms ?? ''),
  }));
}

export default function FixedPricePage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<RouteRow | null>(null);
  const [msg, setMsg] = useState('');
  const [pendingDelete, setPendingDelete] = useState<number | string | null>(null);
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
          options: mapOptions((r.priceOptions as Record<string, unknown>[]) ?? []),
        }));
        setRows(
          mapped.map((r) => ({
            slug: r.slug,
            route: `${r.fromAirportIata} → ${r.toAirportIata}`,
            tiers: r.options.length,
            region: r.region,
            status: r.status,
            actions: (
              <span>
                <ActionBtn onClick={() => setForm({ ...r, options: r.options.map((o) => ({ ...o })) })}>
                  Edit
                </ActionBtn>
                {' · '}
                <ActionBtn variant="danger" onClick={() => setPendingDelete(r.id)}>
                  Delete
                </ActionBtn>
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

  function updateOption(index: number, patch: Partial<PriceOptionRow>) {
    if (!form) return;
    const options = form.options.map((o, i) => (i === index ? { ...o, ...patch } : o));
    setForm({ ...form, options });
  }

  function addOption() {
    if (!form) return;
    setForm({ ...form, options: [...form.options, emptyOption()] });
  }

  function removeOption(index: number) {
    if (!form) return;
    const options = form.options.filter((_, i) => i !== index);
    setForm({ ...form, options: options.length ? options : [emptyOption()] });
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    setMsg('');
    try {
      const options = form.options
        .filter((o) => o.categoryCode && o.price && o.paxLimit)
        .map((o) => ({
          categoryCode: o.categoryCode.toUpperCase(),
          price: Number(o.price),
          paxLimit: Number.parseInt(o.paxLimit, 10),
          ...(o.includedTerms.trim() ? { includedTerms: o.includedTerms.trim() } : {}),
        }));

      const body = {
        slug: form.slug,
        fromAirportIata: form.fromAirportIata,
        toAirportIata: form.toAirportIata,
        region: form.region,
        status: form.status,
        options,
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
        <Button type="button" onClick={() => setForm(emptyForm())}>
          + New Route
        </Button>
      </div>

      {form && (
        <AdminPanel title={form.id ? `Edit #${form.id}` : 'New Route'} onClose={() => setForm(null)}>
          <AdminField label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
          <AdminField
            label="From IATA"
            value={form.fromAirportIata}
            onChange={(v) => setForm({ ...form, fromAirportIata: v.toUpperCase() })}
            required
          />
          <AdminField
            label="To IATA"
            value={form.toAirportIata}
            onChange={(v) => setForm({ ...form, toAirportIata: v.toUpperCase() })}
            required
          />
          <AdminField label="Region" value={form.region} onChange={(v) => setForm({ ...form, region: v })} required />
          <label style={{ display: 'block', margin: '10px 0' }}>
            <span style={{ display: 'block', marginBottom: 4, fontSize: 13, opacity: 0.7 }}>Status</span>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={fieldStyle}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>

          <div style={{ marginTop: 16, marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong style={{ fontSize: 14 }}>Price tiers</strong>
              <Button type="button" onClick={addOption}>
                + Add tier
              </Button>
            </div>
            {form.options.map((opt, i) => (
              <div
                key={i}
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 10,
                }}
              >
                <label style={{ display: 'block', marginBottom: 8 }}>
                  <span style={{ display: 'block', marginBottom: 4, fontSize: 13, opacity: 0.7 }}>Category</span>
                  <select
                    value={opt.categoryCode}
                    onChange={(e) => updateOption(i, { categoryCode: e.target.value })}
                    style={fieldStyle}
                  >
                    {CATEGORY_PRESETS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <AdminField
                    label="Price (USD)"
                    type="number"
                    value={opt.price}
                    onChange={(v) => updateOption(i, { price: v })}
                    required
                  />
                  <AdminField
                    label="Pax limit"
                    type="number"
                    value={opt.paxLimit}
                    onChange={(v) => updateOption(i, { paxLimit: v })}
                    required
                  />
                </div>
                <AdminField
                  label="Included terms (optional)"
                  value={opt.includedTerms}
                  onChange={(v) => updateOption(i, { includedTerms: v })}
                  rows={2}
                />
                {form.options.length > 1 && (
                  <ActionBtn variant="danger" onClick={() => removeOption(i)}>
                    Remove tier
                  </ActionBtn>
                )}
              </div>
            ))}
          </div>

          <Button type="button" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </AdminPanel>
      )}

      {loading ? (
        <Muted>Loading routes...</Muted>
      ) : (
        <DataTable
          columns={[
            { key: 'slug', label: 'Slug' },
            { key: 'route', label: 'Route' },
            { key: 'tiers', label: 'Tiers' },
            { key: 'region', label: 'Region' },
            { key: 'status', label: 'Status' },
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
