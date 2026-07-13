'use client';

import { useCallback, useEffect, useState } from 'react';
import { scheduleUi } from '../../../lib/browser';
import { SectionTitle, Muted, DataTable } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
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

export default function AircraftAdminPage() {
  const [fleet, setFleet] = useState<FleetRow[]>([]);
  const [categories, setCategories] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

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
  }));

  return (
    <AdminShell active="/dashboard/aircraft">
      <SectionTitle>Aircraft fleet</SectionTitle>
      <Muted>
        Tail-number instances with live location. Models/categories still managed via API —
        seed includes B-JBAY1 at CAN for CAN→HAN→SGN pricing demos.
      </Muted>
      {msg ? <p style={{ color: 'crimson' }}>{msg}</p> : null}
      {loading ? <Muted>Loading…</Muted> : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'registration', label: 'Registration' },
            { key: 'model', label: 'Model' },
            { key: 'operator', label: 'Operator' },
            { key: 'location', label: 'Location' },
            { key: 'status', label: 'Status' },
            { key: 'rate', label: 'Hourly rate' },
          ]}
          rows={rows}
        />
      )}
      <SectionTitle>Model catalog</SectionTitle>
      <Muted>{categories.length} categories loaded (edit via existing category/model endpoints).</Muted>
    </AdminShell>
  );
}
