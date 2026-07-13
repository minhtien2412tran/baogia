'use client';

import { useCallback, useEffect, useState } from 'react';
import { scheduleUi } from '../../../lib/browser';
import { SectionTitle, Muted, DataTable, Button } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { ActionBtn } from '../../../components/AdminFormFields';
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
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

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

  const rows = contracts.map((c) => ({
    id: String(c.id),
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
        {c.status === 'DRAFT' ? (
          <ActionBtn onClick={() => act(c.id, 'submit')}>Submit</ActionBtn>
        ) : null}
        {c.status === 'PENDING_APPROVAL' ? (
          <>
            <ActionBtn onClick={() => act(c.id, 'approve')}>Approve</ActionBtn>
            <ActionBtn onClick={() => act(c.id, 'reject')}>Reject</ActionBtn>
          </>
        ) : null}
        {c.status === 'APPROVED' ? (
          <ActionBtn onClick={() => act(c.id, 'send')}>Send DocuSign</ActionBtn>
        ) : null}
      </span>
    ),
  }));

  return (
    <AdminShell active="/dashboard/contracts">
      <SectionTitle>Operator contracts</SectionTitle>
      <Muted>
        Approval workflow then mock DocuSign. Send is blocked until status is APPROVED.
      </Muted>
      {msg ? <p>{msg}</p> : null}
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
