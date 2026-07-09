'use client';

import { useCallback, useEffect, useState } from 'react';
import { SectionTitle, DataTable, Muted, Button } from '@j-ta/ui';
import { AdminShell } from '../../../components/AdminShell';
import { AdminField, AdminPanel, ActionBtn } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

type PlanRow = {
  id: number;
  name: string;
  hours: number;
  validityYears: number;
  minNoticeHours: number;
  dailyMinHours: number;
  price: number;
};

const emptyForm = (): PlanRow => ({
  id: 0,
  name: '',
  hours: 25,
  validityYears: 2,
  minNoticeHours: 24,
  dailyMinHours: 1.5,
  price: 120000,
});

export default function JetCardAdminPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<PlanRow | null>(null);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .getAdminJetCardPlans()
      .then((res) => {
        setRows(
          (res.plans as Record<string, unknown>[]).map((p) => ({
            id: String(p.id),
            name: String(p.name),
            hours: String(p.hours),
            price: p.price != null ? `USD ${Number(p.price).toLocaleString()}` : '—',
            validity: String(p.validityYears ?? '—'),
            actions: (
              <span>
                <ActionBtn
                  onClick={() =>
                    setForm({
                      id: Number(p.id),
                      name: String(p.name),
                      hours: Number(p.hours),
                      validityYears: Number(p.validityYears ?? 2),
                      minNoticeHours: Number(p.minNoticeHours ?? 24),
                      dailyMinHours: Number(p.dailyMinHours ?? 1.5),
                      price: Number(p.price ?? 0),
                    })
                  }
                >
                  Edit
                </ActionBtn>
                {' · '}
                <ActionBtn variant="danger" onClick={() => remove(Number(p.id))}>Delete</ActionBtn>
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
        name: form.name,
        hours: form.hours,
        validityYears: form.validityYears,
        minNoticeHours: form.minNoticeHours,
        dailyMinHours: form.dailyMinHours,
        price: form.price,
      };
      if (form.id) {
        await adminApi.updateJetCardPlan(form.id, body);
        setMsg('Plan updated.');
      } else {
        await adminApi.createJetCardPlan(body);
        setMsg('Plan created.');
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
    if (!confirm('Delete this plan?')) return;
    try {
      await adminApi.deleteJetCardPlan(id);
      setMsg('Plan deleted.');
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <AdminShell active="/dashboard/jet-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <SectionTitle>Jet Card Plans</SectionTitle>
        <Button type="button" onClick={() => setForm(emptyForm())}>+ New Plan</Button>
      </div>

      {form && (
        <AdminPanel title={form.id ? `Edit #${form.id}` : 'New Plan'} onClose={() => setForm(null)}>
          <AdminField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <AdminField label="Hours" value={String(form.hours)} onChange={(v) => setForm({ ...form, hours: Number(v) })} type="number" />
          <AdminField label="Price (USD)" value={String(form.price)} onChange={(v) => setForm({ ...form, price: Number(v) })} type="number" />
          <AdminField label="Validity (years)" value={String(form.validityYears)} onChange={(v) => setForm({ ...form, validityYears: Number(v) })} type="number" />
          <AdminField label="Min notice (hours)" value={String(form.minNoticeHours)} onChange={(v) => setForm({ ...form, minNoticeHours: Number(v) })} type="number" />
          <AdminField label="Daily min hours" value={String(form.dailyMinHours)} onChange={(v) => setForm({ ...form, dailyMinHours: Number(v) })} type="number" />
          <Button type="button" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        </AdminPanel>
      )}

      {loading ? <Muted>Loading plans…</Muted> : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'hours', label: 'Hours' },
            { key: 'price', label: 'Price' },
            { key: 'validity', label: 'Validity (yrs)' },
            { key: 'actions', label: 'Actions' },
          ]}
          rows={rows}
        />
      )}
      {msg && <p style={{ marginTop: 12, color: '#4ade80' }}>{msg}</p>}
    </AdminShell>
  );
}
