'use client';

import { use } from 'react';
import { useEffect, useState } from 'react';
import { Card, SectionTitle, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../../components/AdminShell';
import { ActionBtn } from '../../../../components/AdminFormFields';
import { usePermissions } from '../../../../components/PermissionContext';
import { adminApi } from '../../../../lib/api';

type ContractDetail = {
  id: number;
  contractNumber?: string | null;
  status: string;
  bookingId: number;
  amount?: number | string | null;
  currency?: string;
  aircraft?: { registration?: string };
  operator?: { name?: string };
  docusignEnvelopeId?: string | null;
  createdAt?: string;
};

export default function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { can } = usePermissions();
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    void adminApi
      .getContract(Number(id))
      .then((data) => {
        if (!cancelled) setContract(data as ContractDetail);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load contract');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function act(action: 'submit' | 'approve' | 'reject' | 'send') {
    if (!contract) return;
    try {
      if (action === 'submit') await adminApi.submitContract(contract.id);
      if (action === 'approve') await adminApi.approveContract(contract.id);
      if (action === 'reject') await adminApi.rejectContract(contract.id, 'Rejected from admin');
      if (action === 'send') {
        await adminApi.sendContractDocuSign(contract.id, [
          { email: 'ops@jetbay.local', name: 'Operator Signer', role: 'operator' },
        ]);
      }
      const refreshed = (await adminApi.getContract(contract.id)) as ContractDetail;
      setContract(refreshed);
      setMsg(`→ ${action}`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Action failed');
    }
  }

  return (
    <AdminShell active="/dashboard/contracts">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <SectionTitle>Contract #{id}</SectionTitle>
        <a href="/dashboard/contracts" style={{ color: '#9fb3c0', alignSelf: 'center' }}>
          ← Back
        </a>
      </div>
      {error ? <p style={{ color: '#fca5a5' }}>{error}</p> : null}
      {msg ? <p style={{ color: '#86efac' }}>{msg}</p> : null}
      {!contract && !error ? (
        <Muted>Loading…</Muted>
      ) : contract ? (
        <Card>
          <p>
            <strong>{contract.contractNumber ?? `Contract #${contract.id}`}</strong>
          </p>
          <p>Status: {contract.status}</p>
          <p>Booking: {contract.bookingId}</p>
          <p>Aircraft: {contract.aircraft?.registration ?? '—'}</p>
          <p>Operator: {contract.operator?.name ?? '—'}</p>
          <p>
            Amount:{' '}
            {contract.amount != null
              ? `${contract.currency ?? 'USD'} ${Number(contract.amount).toLocaleString()}`
              : '—'}
          </p>
          <p>DocuSign: {contract.docusignEnvelopeId ?? '—'}</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
            {contract.status === 'DRAFT' && can('contract.submit_approval') ? (
              <ActionBtn onClick={() => void act('submit')}>Submit</ActionBtn>
            ) : null}
            {contract.status === 'PENDING_APPROVAL' && can('contract.approve') ? (
              <ActionBtn onClick={() => void act('approve')}>Approve</ActionBtn>
            ) : null}
            {contract.status === 'PENDING_APPROVAL' && can('contract.reject') ? (
              <ActionBtn onClick={() => void act('reject')}>Reject</ActionBtn>
            ) : null}
            {contract.status === 'APPROVED' && can('contract.send_docusign') ? (
              <ActionBtn onClick={() => void act('send')}>Send DocuSign</ActionBtn>
            ) : null}
          </div>
        </Card>
      ) : null}
    </AdminShell>
  );
}
