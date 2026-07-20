'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { scheduleUi } from '../../../lib/browser';
import { SectionTitle, Muted, DataTable } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import {
  ActionBtn,
  AdminField,
  AdminPanel,
  fieldStyle,
} from '../../../components/AdminFormFields';
import { usePermissions } from '../../../components/PermissionContext';
import { adminApi } from '../../../lib/api';

type FleetRow = {
  id: number;
  registration: string;
  model: string;
  operator: string;
  availabilityStatus: string;
  currentAirport: { iata: string; city: string } | null;
  hourlyRate: number | null;
  hourlyRateCurrency: string;
};

type ModelOpt = { id: number; manufacturer: string; model: string };
type OperatorOpt = { id: number; name: string };
type AirportOpt = { id: number; iata: string; city: string };

export default function AircraftAdminPage() {
  const { can } = usePermissions();
  const [fleet, setFleet] = useState<FleetRow[]>([]);
  const [categories, setCategories] = useState<unknown[]>([]);
  const [models, setModels] = useState<ModelOpt[]>([]);
  const [operators, setOperators] = useState<OperatorOpt[]>([]);
  const [airports, setAirports] = useState<AirportOpt[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [locFor, setLocFor] = useState<number | null>(null);
  const [form, setForm] = useState({
    registration: '',
    aircraftModelId: '',
    operatorId: '',
    currentAirportId: '',
    hourlyRate: '',
    availabilityStatus: 'AVAILABLE',
  });
  const [locAirportId, setLocAirportId] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([adminApi.getAircraftFleet(), adminApi.getAircraftCategories()])
      .then(([fleetRes, catRes]) => {
        setFleet((fleetRes.aircraft ?? []) as FleetRow[]);
        setCategories(catRes.categories ?? []);
      })
      .catch((e: Error) => setMsg(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    scheduleUi(() => {
      void load();
    });
  }, [load]);

  async function openCreate() {
    setShowCreate(true);
    setMsg('');
    try {
      const [aircraft, ops, airportsRes] = await Promise.all([
        adminApi.getAircraftModels(),
        adminApi.getOperators(),
        adminApi.getAirports(),
      ]);
      const list = ((aircraft as { models?: ModelOpt[] }).models ?? []) as ModelOpt[];
      setModels(list);
      setOperators((ops.operators as OperatorOpt[]) ?? []);
      const ap = ((airportsRes.data ?? []) as AirportOpt[]).map((a) => ({
        id: Number((a as AirportOpt).id),
        iata: String((a as AirportOpt).iata),
        city: String((a as AirportOpt).city),
      }));
      setAirports(ap);
      setForm({
        registration: '',
        aircraftModelId: list[0] ? String(list[0].id) : '',
        operatorId: ops.operators?.[0] ? String((ops.operators[0] as OperatorOpt).id) : '',
        currentAirportId: ap[0] ? String(ap[0].id) : '',
        hourlyRate: '',
        availabilityStatus: 'AVAILABLE',
      });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Load form failed');
    }
  }

  async function submitCreate(e: FormEvent) {
    e.preventDefault();
    try {
      await adminApi.createAircraftFleet({
        registration: form.registration.trim().toUpperCase(),
        aircraftModelId: Number(form.aircraftModelId),
        operatorId: Number(form.operatorId),
        currentAirportId: form.currentAirportId ? Number(form.currentAirportId) : undefined,
        hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
        availabilityStatus: form.availabilityStatus,
      });
      setShowCreate(false);
      setMsg('Fleet aircraft created');
      load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Create failed');
    }
  }

  async function submitLocation(e: FormEvent) {
    e.preventDefault();
    if (!locFor) return;
    try {
      await adminApi.updateAircraftLocation(locFor, {
        airportId: Number(locAirportId),
        reason: 'Admin update',
      });
      setLocFor(null);
      setMsg(`Location updated for #${locFor}`);
      load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Location update failed');
    }
  }

  const rows = fleet.map((a) => ({
    id: String(a.id),
    registration: a.registration,
    model: a.model,
    operator: a.operator,
    location: a.currentAirport ? `${a.currentAirport.iata} (${a.currentAirport.city})` : '—',
    status: a.availabilityStatus,
    rate:
      a.hourlyRate != null
        ? `${a.hourlyRateCurrency} ${a.hourlyRate.toLocaleString()}/h`
        : '—',
    actions: can('aircraft.update_location') ? (
      <ActionBtn
        onClick={() => {
          setLocFor(a.id);
          setLocAirportId('');
          void adminApi.getAirports().then((res) => {
            const ap = ((res.data ?? []) as AirportOpt[]).map((a) => ({
              id: Number(a.id),
              iata: String(a.iata),
              city: String(a.city),
            }));
            setAirports(ap);
            if (ap[0]) setLocAirportId(String(ap[0].id));
          });
        }}
      >
        Location
      </ActionBtn>
    ) : (
      '—'
    ),
  }));

  return (
    <AdminShell active="/dashboard/aircraft">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <SectionTitle>Aircraft fleet</SectionTitle>
        {can('aircraft.view') ? (
          <ActionBtn onClick={() => void openCreate()}>Add aircraft</ActionBtn>
        ) : null}
      </div>
      <Muted>Tail-number instances with live location for pricing / ops.</Muted>
      {msg ? <p style={{ color: msg.includes('fail') || msg.includes('Fail') ? '#fca5a5' : '#86efac' }}>{msg}</p> : null}

      {showCreate ? (
        <AdminPanel title="Create fleet aircraft" onClose={() => setShowCreate(false)}>
          <form onSubmit={(e) => void submitCreate(e)}>
            <AdminField
              label="Registration"
              value={form.registration}
              onChange={(v) => setForm({ ...form, registration: v })}
              required
            />
            <label style={{ display: 'block', margin: '10px 0' }}>
              <span style={{ display: 'block', marginBottom: 4, fontSize: 13, opacity: 0.7 }}>Model</span>
              <select
                value={form.aircraftModelId}
                onChange={(e) => setForm({ ...form, aircraftModelId: e.target.value })}
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
                onChange={(e) => setForm({ ...form, operatorId: e.target.value })}
                style={fieldStyle}
                required
              >
                {operators.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: 'block', margin: '10px 0' }}>
              <span style={{ display: 'block', marginBottom: 4, fontSize: 13, opacity: 0.7 }}>
                Current airport
              </span>
              <select
                value={form.currentAirportId}
                onChange={(e) => setForm({ ...form, currentAirportId: e.target.value })}
                style={fieldStyle}
              >
                <option value="">—</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.iata} ({a.city})
                  </option>
                ))}
              </select>
            </label>
            <AdminField
              label="Hourly rate"
              value={form.hourlyRate}
              onChange={(v) => setForm({ ...form, hourlyRate: v })}
              type="number"
            />
            <ActionBtn type="submit">Create</ActionBtn>
          </form>
        </AdminPanel>
      ) : null}

      {locFor != null ? (
        <AdminPanel title={`Update location · fleet #${locFor}`} onClose={() => setLocFor(null)}>
          <form onSubmit={(e) => void submitLocation(e)}>
            <label style={{ display: 'block', margin: '10px 0' }}>
              <span style={{ display: 'block', marginBottom: 4, fontSize: 13, opacity: 0.7 }}>Airport</span>
              <select
                value={locAirportId}
                onChange={(e) => setLocAirportId(e.target.value)}
                style={fieldStyle}
                required
              >
                {airports.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.iata} ({a.city})
                  </option>
                ))}
              </select>
            </label>
            <ActionBtn type="submit">Save location</ActionBtn>
          </form>
        </AdminPanel>
      ) : null}

      {loading ? (
        <Muted>Loading…</Muted>
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'registration', label: 'Registration' },
            { key: 'model', label: 'Model' },
            { key: 'operator', label: 'Operator' },
            { key: 'location', label: 'Location' },
            { key: 'status', label: 'Status' },
            { key: 'rate', label: 'Hourly rate' },
            { key: 'actions', label: 'Actions' },
          ]}
          rows={rows}
        />
      )}
      <SectionTitle>Model catalog</SectionTitle>
      <Muted>{categories.length} categories loaded.</Muted>
    </AdminShell>
  );
}
