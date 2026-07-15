'use client';

import { useCallback, useEffect, useState } from 'react';
import { SectionTitle, DataTable, Muted, Button } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { AdminField, AdminPanel, ActionBtn } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

type OperatorForm = {
  id: number;
  name: string;
  region: string;
  legalName: string;
  country: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
};

const empty = (): OperatorForm => ({
  id: 0,
  name: '',
  region: 'APAC',
  legalName: '',
  country: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  status: 'ACTIVE',
});

export default function OperatorsAdminPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<OperatorForm | null>(null);
  const [msg, setMsg] = useState('');
  const [attachEmail, setAttachEmail] = useState('');
  const [attachPassword, setAttachPassword] = useState('Operator123!');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .listOperators()
      .then((res) => {
        const list = res.operators ?? [];
        setRows(
          list.map((o) => ({
            id: String(o.id),
            name: o.name,
            region: o.region,
            email: o.contactEmail ?? '—',
            users: String(o.users?.length ?? 0),
            status: o.status ?? 'ACTIVE',
            actions: (
              <span>
                <ActionBtn
                  onClick={() => {
                    setSelectedId(o.id);
                    setForm({
                      id: o.id,
                      name: o.name,
                      region: o.region,
                      legalName: o.legalName ?? '',
                      country: o.country ?? '',
                      contactName: o.contactName ?? '',
                      contactEmail: o.contactEmail ?? '',
                      contactPhone: o.contactPhone ?? '',
                      status: o.status ?? 'ACTIVE',
                    });
                  }}
                >
                  Edit
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
    const timer = window.setTimeout(() => load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function save() {
    if (!form) return;
    setMsg('');
    try {
      const body = {
        name: form.name,
        region: form.region,
        legalName: form.legalName || undefined,
        country: form.country || undefined,
        contactName: form.contactName || undefined,
        contactEmail: form.contactEmail || undefined,
        contactPhone: form.contactPhone || undefined,
        status: form.status,
      };
      if (form.id) await adminApi.updateOperator(form.id, body);
      else await adminApi.createOperator(body);
      setMsg('Saved operator');
      setForm(null);
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Save failed');
    }
  }

  async function attachUser() {
    if (!selectedId || !attachEmail) return;
    try {
      await adminApi.attachOperatorUser(selectedId, {
        email: attachEmail,
        password: attachPassword,
        role: 'OPERATOR_STAFF',
      });
      setMsg(`Attached ${attachEmail}`);
      setAttachEmail('');
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Attach failed');
    }
  }

  return (
    <AdminShell active="/dashboard/operators">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <SectionTitle>Operators (hãng)</SectionTitle>
        <Button type="button" onClick={() => setForm(empty())}>
          + New operator
        </Button>
      </div>
      <Muted>Mỗi hãng có contact email riêng — booking sẽ gửi mail tự động tới email này + admin inbox.</Muted>

      {form && (
        <AdminPanel title={form.id ? `Edit #${form.id}` : 'New operator'} onClose={() => setForm(null)}>
          <AdminField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <AdminField label="Region" value={form.region} onChange={(v) => setForm({ ...form, region: v })} required />
          <AdminField label="Legal name" value={form.legalName} onChange={(v) => setForm({ ...form, legalName: v })} />
          <AdminField label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
          <AdminField label="Contact name" value={form.contactName} onChange={(v) => setForm({ ...form, contactName: v })} />
          <AdminField label="Contact email" value={form.contactEmail} onChange={(v) => setForm({ ...form, contactEmail: v })} />
          <AdminField label="Contact phone" value={form.contactPhone} onChange={(v) => setForm({ ...form, contactPhone: v })} />
          <AdminField label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v })} />
          <Button type="button" onClick={() => void save()}>
            Save
          </Button>
          {form.id ? (
            <div style={{ marginTop: 16 }}>
              <Muted>Attach user to this operator</Muted>
              <AdminField label="User email" value={attachEmail} onChange={setAttachEmail} />
              <AdminField label="Password (if new)" value={attachPassword} onChange={setAttachPassword} />
              <Button type="button" onClick={() => void attachUser()}>
                Attach user
              </Button>
            </div>
          ) : null}
        </AdminPanel>
      )}

      {loading ? (
        <Muted>Loading…</Muted>
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'region', label: 'Region' },
            { key: 'email', label: 'Contact email' },
            { key: 'users', label: 'Users' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: '' },
          ]}
          rows={rows}
        />
      )}
      {msg ? <p role="status">{msg}</p> : null}
    </AdminShell>
  );
}
