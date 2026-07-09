'use client';

import { useEffect, useState } from 'react';
import { SectionTitle, DataTable, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';

export default function PartnersAdminPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getPartnerApplications()
      .then((res) => {
        setRows(
          (res.applications as Record<string, unknown>[]).map((a) => ({
            id: String(a.id),
            email: String(a.email),
            program: String(a.program),
            status: String(a.status),
            created: a.createdAt ? String(a.createdAt).slice(0, 10) : '—',
          })),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell active="/dashboard/partners">
      <SectionTitle>Partner Applications</SectionTitle>
      {loading ? <Muted>Loading applications…</Muted> : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'email', label: 'Email' },
            { key: 'program', label: 'Program' },
            { key: 'status', label: 'Status' },
            { key: 'created', label: 'Submitted' },
          ]}
          rows={rows}
        />
      )}
    </AdminShell>
  );
}
