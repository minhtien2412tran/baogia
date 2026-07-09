'use client';

import { useEffect, useState } from 'react';
import { SectionTitle, DataTable, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';

export default function TravelCreditsAdminPage() {
  const [packages, setPackages] = useState<Record<string, React.ReactNode>[]>([]);
  const [txns, setTxns] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.getTravelCreditPackages(), adminApi.getTravelCreditTransactions()])
      .then(([pkgRes, txnRes]) => {
        setPackages(
          (pkgRes.packages as Record<string, unknown>[]).map((p) => ({
            id: String(p.id),
            name: String(p.name),
            credit: p.creditAmount != null ? `USD ${Number(p.creditAmount).toLocaleString()}` : '—',
            price: p.priceUsd != null ? `USD ${Number(p.priceUsd).toLocaleString()}` : '—',
          })),
        );
        const data = (txnRes as { data?: unknown[] }).data ?? [];
        setTxns(
          (data as Record<string, unknown>[]).map((t) => ({
            id: String(t.id),
            user: String(t.userEmail ?? t.userId ?? '—'),
            amount: String(t.amount ?? '—'),
            type: String(t.type ?? '—'),
            created: t.createdAt ? String(t.createdAt).slice(0, 10) : '—',
          })),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell active="/dashboard/travel-credits">
      <SectionTitle>Travel Credit Packages</SectionTitle>
      {loading ? <Muted>Loading…</Muted> : (
        <>
          <DataTable
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Package' },
              { key: 'credit', label: 'Credit' },
              { key: 'price', label: 'Price' },
            ]}
            rows={packages}
          />
          <div style={{ marginTop: 32 }}>
            <SectionTitle>Recent Transactions</SectionTitle>
            <DataTable
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'user', label: 'User' },
                { key: 'amount', label: 'Amount' },
                { key: 'type', label: 'Type' },
                { key: 'created', label: 'Date' },
              ]}
              rows={txns}
            />
          </div>
        </>
      )}
    </AdminShell>
  );
}
