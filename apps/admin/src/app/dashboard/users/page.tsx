'use client';

import { useCallback, useEffect, useState } from 'react';
import { SectionTitle, DataTable, Muted, Button } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { ActionBtn } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

type UserRow = {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: string;
  status: string;
};

export default function UsersAdminPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .getUsers()
      .then((res) => {
        const users = (res.data as UserRow[]) ?? [];
        setRows(
          users.map((u) => ({
            id: String(u.id),
            email: u.email,
            name: [u.firstName, u.lastName].filter(Boolean).join(' ') || '—',
            phone: u.phone ?? '—',
            role: u.role,
            status: u.status,
            actions: (
              <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {u.role === 'USER' && (
                  <ActionBtn onClick={() => update(u.id, { role: 'ADMIN' })}>Make Admin</ActionBtn>
                )}
                {u.role === 'ADMIN' && u.email !== 'admin@jetbay.local' && (
                  <ActionBtn onClick={() => update(u.id, { role: 'USER' })}>Remove Admin</ActionBtn>
                )}
                {u.status === 'ACTIVE' ? (
                  <ActionBtn variant="danger" onClick={() => update(u.id, { status: 'SUSPENDED' })}>Suspend</ActionBtn>
                ) : (
                  <ActionBtn onClick={() => update(u.id, { status: 'ACTIVE' })}>Activate</ActionBtn>
                )}
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

  async function update(id: number, body: { role?: string; status?: string }) {
    try {
      await adminApi.updateUser(id, body);
      setMsg(`User #${id} updated`);
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Update failed');
    }
  }

  return (
    <AdminShell active="/dashboard/users">
      <SectionTitle>Users</SectionTitle>
      <Muted>Manage roles and account status.</Muted>
      {loading ? <Muted>Loading users…</Muted> : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'email', label: 'Email' },
            { key: 'name', label: 'Name' },
            { key: 'phone', label: 'Phone' },
            { key: 'role', label: 'Role' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' },
          ]}
          rows={rows}
        />
      )}
      {msg && <p style={{ marginTop: 12, color: '#4ade80' }}>{msg}</p>}
    </AdminShell>
  );
}
