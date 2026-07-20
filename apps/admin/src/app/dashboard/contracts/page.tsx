'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { scheduleUi } from '../../../lib/browser';
import { SectionTitle, Muted, DataTable, Button } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import {
  ActionBtn,
  AdminField,
  AdminPanel,
} from '../../../components/AdminFormFields';
import { usePermissions } from '../../../components/PermissionContext';
import { adminApi } from '../../../lib/api';

type Contract = {
  id: number;
  contractNumber?: string;
  status: string;
  amount?: number | string | null;
  currency?: string;
  bookingId: number;
  aircraft?: { registration?: string };
  operator?: { name?: string };
  docusignEnvelopeId?: string | null;
};

export default function ContractsPage() {
  const { can } = usePermissions();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    bookingId: '',
    aircraftId: '',
    operatorId: '',
    amount: '',
  });

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .getContracts()
      .then((res) => setContracts((res.contracts ?? []) as Contract[]))
      .catch((e: Error) => setMsg(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    scheduleUi(() => {
      void load();
    });
  }, [load]);

  async function act(id: number, action: 'submit' | 'approve' | 'reject' | 'send') {
    try {
      if (action === 'submit') await adminApi.submitContract(id);
      if (action === 'approve') await adminApi.approveContract(id);
      if (action === 'reject') await adminApi.rejectContract(id, 'Rejected from admin');
      if (action === 'send') {
        await adminApi.sendContractDocuSign(id, [
          { email: 'ops@jetbay.local', name: 'Operator Signer', role: 'operator' },
        ]);
      }
      setMsg(`Contract #${id} → ${action}`);
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Action failed');
    }
  }

  async function createContract(e: FormEvent) {
    e.preventDefault();
    try {
      await adminApi.createContract({
        bookingId: Number(form.bookingId),
        aircraftId: Number(form.aircraftId),
        operatorId: form.operatorId ? Number(form.operatorId) : undefined,
        amount: form.amount ? Number(form.amount) : undefined,
      });
      setShowCreate(false);
      setMsg('Contract created');
      load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Create failed');
    }
  }

  const rows = contracts.map((c) => ({
    id: (
      <a href={`/dashboard/contracts/${c.id}`} style={{ color: '#7dd3fc' }}>
        {c.id}
      </a>
    ),
    number: c.contractNumber ?? '—',
    booking: String(c.bookingId),
    aircraft: c.aircraft?.registration ?? '—',
    operator: c.operator?.name ?? '—',
    status: c.status,
    amount:
      c.amount != null ? `${c.currency ?? 'USD'} ${Number(c.amount).toLocaleString()}` : '—',
    envelope: c.docusignEnvelopeId ?? '—',
    actions: (
      <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {c.status === 'DRAFT' && can('contract.submit_approval') ? (
          <ActionBtn onClick={() => void act(c.id, 'submit')}>Submit</ActionBtn>
        ) : null}
        {c.status === 'PENDING_APPROVAL' && can('contract.approve') ? (
          <ActionBtn onClick={() => void act(c.id, 'approve')}>Approve</ActionBtn>
        ) : null}
        {c.status === 'PENDING_APPROVAL' && can('contract.reject') ? (
          <ActionBtn onClick={() => void act(c.id, 'reject')}>Reject</ActionBtn>
        ) : null}
        {c.status === 'APPROVED' && can('contract.send_docusign') ? (
          <ActionBtn onClick={() => void act(c.id, 'send')}>Send DocuSign</ActionBtn>
        ) : null}
      </span>
    ),
  }));

  return (
    <AdminShell active="/dashboard/contracts">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <SectionTitle>Operator contracts</SectionTitle>
        <div style={{ display: 'flex', gap: 8 }}>
          {can('contract.export') || can('contract.view') ? (
            <ActionBtn
              onClick={() =>
                void adminApi
                  .downloadExport('/admin/export/contracts?format=csv')
                  .catch((e: Error) => setMsg(e.message))
              }
            >
              Export CSV
            </ActionBtn>
          ) : null}
          {can('contract.create') ? (
            <ActionBtn onClick={() => setShowCreate(true)}>New contract</ActionBtn>
          ) : null}
        </div>
      </div>
      <Muted>
        Approval workflow then mock DocuSign. Send is blocked until status is APPROVED.
      </Muted>
      {msg ? <p>{msg}</p> : null}

      {showCreate ? (
        <AdminPanel title="Create contract" onClose={() => setShowCreate(false)}>
          <form onSubmit={(e) => void createContract(e)}>
            <AdminField
              label="Booking ID"
              value={form.bookingId}
              onChange={(v) => setForm({ ...form, bookingId: v })}
              type="number"
              required
            />
            <AdminField
              label="Aircraft fleet ID"
              value={form.aircraftId}
              onChange={(v) => setForm({ ...form, aircraftId: v })}
              type="number"
              required
            />
            <AdminField
              label="Operator ID (optional)"
              value={form.operatorId}
              onChange={(v) => setForm({ ...form, operatorId: v })}
              type="number"
            />
            <AdminField
              label="Amount"
              value={form.amount}
              onChange={(v) => setForm({ ...form, amount: v })}
              type="number"
            />
            <ActionBtn type="submit">Create</ActionBtn>
          </form>
        </AdminPanel>
      ) : null}

      {loading ? (
        <Muted>Loading…</Muted>
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'number', label: 'Number' },
            { key: 'booking', label: 'Booking' },
            { key: 'aircraft', label: 'Aircraft' },
            { key: 'operator', label: 'Operator' },
            { key: 'status', label: 'Status' },
            { key: 'amount', label: 'Amount' },
            { key: 'envelope', label: 'Envelope' },
            { key: 'actions', label: 'Actions' },
          ]}
          rows={rows}
        />
      )}
      <Button type="button" onClick={load}>
        Refresh
      </Button>
    </AdminShell>
  );
}
