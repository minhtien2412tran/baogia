'use client';

import { useEffect, useState } from 'react';
import { SectionTitle, DataTable, Muted } from '@j-ta/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';

export default function AuditLogsPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getAuditLogs()
      .then((res) => {
        const logs = res.data ?? [];
        setRows(
          (logs as Record<string, unknown>[]).map((l) => ({
            id: String(l.id),
            action: String(l.action),
            user: String(l.userEmail ?? l.userId ?? '—'),
            ip: String(l.ipAddress ?? '—'),
            created: l.createdAt ? String(l.createdAt).slice(0, 19) : '—',
          })),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell active="/dashboard/audit-logs">
      <SectionTitle>Audit Logs</SectionTitle>
      {loading ? (
        <Muted>Loading audit logs...</Muted>
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'action', label: 'Action' },
            { key: 'user', label: 'User' },
            { key: 'ip', label: 'IP' },
            { key: 'created', label: 'When' },
          ]}
          rows={rows}
        />
      )}
    </AdminShell>
  );
}
