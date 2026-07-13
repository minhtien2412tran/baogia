'use client';

import { useCallback, useEffect, useState } from 'react';
import { scheduleUi } from '../../../lib/browser';
import { SectionTitle, DataTable, Muted, Button } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { AdminField, AdminPanel, ActionBtn, ConfirmDialog } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

type PackageRow = {
  id: number;
  name: string;
  creditAmount: number;
  priceUsd: number;
  bonusPct: number;
  validityMonths: number;
  active: boolean;
};

const emptyForm = (): PackageRow => ({
  id: 0,
  name: '',
  creditAmount: 1000,
  priceUsd: 1000,
  bonusPct: 0,
  validityMonths: 12,
  active: true,
});

export default function TravelCreditsAdminPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [txns, setTxns] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<PackageRow | null>(null);
  const [msg, setMsg] = useState('');
  const [pendingDelete, setPendingDelete] = useState<number | string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([adminApi.getAdminTravelCreditPackages(), adminApi.getTravelCreditTransactions()])
      .then(([pkgRes, txnRes]) => {
        setRows(
          (pkgRes.packages as Record<string, unknown>[]).map((p) => ({
            id: String(p.id),
            name: String(p.name),
            credit: `USD ${Number(p.creditAmount).toLocaleString()}`,
            price: `USD ${Number(p.priceUsd).toLocaleString()}`,
            bonus: p.bonusPct != null ? `${Number(p.bonusPct)}%` : '—',
            validity: String(p.validityMonths ?? '—'),
            active: p.active === false ? 'No' : 'Yes',
            actions: (
              <span>
                <ActionBtn
                  onClick={() =>
                    setForm({
                      id: Number(p.id),
                      name: String(p.name),
                      creditAmount: Number(p.creditAmount),
                      priceUsd: Number(p.priceUsd),
                      bonusPct: Number(p.bonusPct ?? 0),
                      validityMonths: Number(p.validityMonths ?? 12),
                      active: p.active !== false,
                    })
                  }
                >
                  Edit
                </ActionBtn>
                {' · '}
                <ActionBtn variant="danger" onClick={() => setPendingDelete(Number(p.id))}>
                  Delete
                </ActionBtn>
              </span>
            ),
          })),
        );
        const data = (txnRes as { data?: unknown[] }).data ?? [];
        setTxns(
          (data as Record<string, unknown>[]).map((t) => ({
            id: String(t.id),
            user: String(t.userEmail ?? t.userId ?? '—'),
            amount: String(t.creditsDelta ?? t.amount ?? '—'),
            type: String(t.reason ?? t.type ?? '—'),
            created: t.createdAt ? String(t.createdAt).slice(0, 10) : '—',
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
        name: form.name,
        creditAmount: form.creditAmount,
        priceUsd: form.priceUsd,
        bonusPct: form.bonusPct || null,
        validityMonths: form.validityMonths,
        active: form.active,
      };
      if (form.id) {
        await adminApi.updateTravelCreditPackage(form.id, body);
        setMsg('Package updated.');
      } else {
        await adminApi.createTravelCreditPackage(body);
        setMsg('Package created.');
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
      await adminApi.deleteTravelCreditPackage(id);
      setMsg('Package deleted.');
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <AdminShell active="/dashboard/travel-credits">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <SectionTitle>Travel Credit Packages</SectionTitle>
        <Button type="button" onClick={() => setForm(emptyForm())}>
          + New Package
        </Button>
      </div>

      {form && (
        <AdminPanel title={form.id ? `Edit #${form.id}` : 'New Package'} onClose={() => setForm(null)}>
          <AdminField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <AdminField
            label="Credit amount (USD)"
            value={String(form.creditAmount)}
            onChange={(v) => setForm({ ...form, creditAmount: Number(v) })}
            type="number"
          />
          <AdminField
            label="Price (USD)"
            value={String(form.priceUsd)}
            onChange={(v) => setForm({ ...form, priceUsd: Number(v) })}
            type="number"
          />
          <AdminField
            label="Bonus %"
            value={String(form.bonusPct)}
            onChange={(v) => setForm({ ...form, bonusPct: Number(v) })}
            type="number"
          />
          <AdminField
            label="Validity (months)"
            value={String(form.validityMonths)}
            onChange={(v) => setForm({ ...form, validityMonths: Number(v) })}
            type="number"
          />
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Active (visible on public site)
          </label>
          <Button type="button" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </AdminPanel>
      )}

      {loading ? (
        <Muted>Loading…</Muted>
      ) : (
        <>
          <DataTable
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Package' },
              { key: 'credit', label: 'Credit' },
              { key: 'price', label: 'Price' },
              { key: 'bonus', label: 'Bonus' },
              { key: 'validity', label: 'Months' },
              { key: 'active', label: 'Active' },
              { key: 'actions', label: 'Actions' },
            ]}
            rows={rows}
          />
          <div style={{ marginTop: 32 }}>
            <SectionTitle>Recent Transactions</SectionTitle>
            <DataTable
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'user', label: 'User' },
                { key: 'amount', label: 'Delta' },
                { key: 'type', label: 'Reason' },
                { key: 'created', label: 'Date' },
              ]}
              rows={txns}
            />
          </div>
        </>
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
