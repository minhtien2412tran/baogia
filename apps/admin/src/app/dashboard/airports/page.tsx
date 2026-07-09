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
        <SectionTitle>Airports</SectionTitle>
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
