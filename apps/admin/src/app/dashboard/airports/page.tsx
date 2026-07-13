'use client';

import { useCallback, useEffect, useState } from 'react';
import { SectionTitle, DataTable, Muted, Button } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { AdminField, AdminPanel, ActionBtn } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

type AirportForm = {
  id: number;
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  status: string;
  canParkAircraft: boolean;
  isBaseAirport: boolean;
  parkingFee: string;
  overnightFee: string;
  landingFee: string;
  feeCurrency: string;
  operationalNotes: string;
};

const emptyForm = (): AirportForm => ({
  id: 0,
  iata: '',
  icao: '',
  name: '',
  city: '',
  country: '',
  timezone: 'UTC',
  status: 'ACTIVE',
  canParkAircraft: true,
  isBaseAirport: false,
  parkingFee: '',
  overnightFee: '',
  landingFee: '',
  feeCurrency: 'USD',
  operationalNotes: '',
});

export default function AirportsAdminPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<AirportForm | null>(null);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .getAirports()
      .then((res) => {
        const list = (res as { data?: unknown[] }).data ?? [];
        setRows(
          (list as Record<string, unknown>[]).map((a) => ({
            id: String(a.id),
            iata: String(a.iata),
            city: String(a.city),
            country: String(a.country),
            park: String(a.canParkAircraft ?? true),
            base: String(a.isBaseAirport ?? false),
            name: String(a.name ?? '—'),
            status: String(a.status ?? 'ACTIVE'),
            actions: (
              <span>
                <ActionBtn
                  onClick={() =>
                    setForm({
                      id: Number(a.id),
                      iata: String(a.iata),
                      icao: String(a.icao ?? ''),
                      name: String(a.name ?? ''),
                      city: String(a.city ?? ''),
                      country: String(a.country ?? ''),
                      timezone: String(a.timezone ?? 'UTC'),
                      status: String(a.status ?? 'ACTIVE'),
                      canParkAircraft: Boolean(a.canParkAircraft ?? true),
                      isBaseAirport: Boolean(a.isBaseAirport ?? false),
                      parkingFee:
                        a.parkingFee != null ? String(a.parkingFee) : '',
                      overnightFee:
                        a.overnightFee != null ? String(a.overnightFee) : '',
                      landingFee:
                        a.landingFee != null ? String(a.landingFee) : '',
                      feeCurrency: String(a.feeCurrency ?? 'USD'),
                      operationalNotes: String(a.operationalNotes ?? ''),
                    })
                  }
                >
                  Edit
                </ActionBtn>
                {' · '}
                <ActionBtn variant="danger" onClick={() => remove(Number(a.id))}>
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
    load();
  }, [load]);

  async function save() {
    if (!form) return;
    setSaving(true);
    setMsg('');
    try {
      const body = {
        iata: form.iata,
        icao: form.icao,
        name: form.name,
        city: form.city,
        country: form.country,
        timezone: form.timezone,
        status: form.status,
        canParkAircraft: form.canParkAircraft,
        isBaseAirport: form.isBaseAirport,
        parkingFee: form.parkingFee ? Number(form.parkingFee) : undefined,
        overnightFee: form.overnightFee ? Number(form.overnightFee) : undefined,
        landingFee: form.landingFee ? Number(form.landingFee) : undefined,
        feeCurrency: form.feeCurrency,
        operationalNotes: form.operationalNotes || undefined,
      };
      if (form.id) {
        await adminApi.updateAirport(form.id, body);
        setMsg('Airport updated.');
      } else {
        await adminApi.createAirport(body);
        setMsg('Airport created.');
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
    if (!confirm('Delete this airport?')) return;
    try {
      await adminApi.deleteAirport(id);
      setMsg('Airport deleted.');
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <AdminShell active="/dashboard/airports">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <SectionTitle>Airports & bases</SectionTitle>
        <Button type="button" onClick={() => setForm(emptyForm())}>
          + New Airport
        </Button>
      </div>

      {form && (
        <AdminPanel title={form.id ? `Edit #${form.id}` : 'New Airport'} onClose={() => setForm(null)}>
          <AdminField label="IATA" value={form.iata} onChange={(v) => setForm({ ...form, iata: v.toUpperCase() })} required />
          <AdminField label="ICAO" value={form.icao} onChange={(v) => setForm({ ...form, icao: v.toUpperCase() })} required />
          <AdminField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <AdminField label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
          <AdminField label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} required />
          <AdminField label="Timezone" value={form.timezone} onChange={(v) => setForm({ ...form, timezone: v })} />
          <AdminField label="Status (ACTIVE / INACTIVE)" value={form.status} onChange={(v) => setForm({ ...form, status: v })} />
          <label style={{ display: 'block', marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={form.canParkAircraft}
              onChange={(e) => setForm({ ...form, canParkAircraft: e.target.checked })}
            />{' '}
            Can park aircraft (chỗ đậu)
          </label>
          <label style={{ display: 'block', marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={form.isBaseAirport}
              onChange={(e) => setForm({ ...form, isBaseAirport: e.target.checked })}
            />{' '}
            Base airport
          </label>
          <AdminField label="Parking fee" value={form.parkingFee} onChange={(v) => setForm({ ...form, parkingFee: v })} />
          <AdminField label="Overnight fee" value={form.overnightFee} onChange={(v) => setForm({ ...form, overnightFee: v })} />
          <AdminField label="Landing fee" value={form.landingFee} onChange={(v) => setForm({ ...form, landingFee: v })} />
          <AdminField label="Fee currency" value={form.feeCurrency} onChange={(v) => setForm({ ...form, feeCurrency: v })} />
          <AdminField label="Operational notes" value={form.operationalNotes} onChange={(v) => setForm({ ...form, operationalNotes: v })} />
          <Button type="button" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </AdminPanel>
      )}

      {loading ? (
        <Muted>Loading airports…</Muted>
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'iata', label: 'IATA' },
            { key: 'city', label: 'City' },
            { key: 'country', label: 'Country' },
            { key: 'park', label: 'Park' },
            { key: 'base', label: 'Base' },
            { key: 'name', label: 'Name' },
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
