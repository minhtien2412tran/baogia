'use client';

import { useCallback, useEffect, useState } from 'react';
import { scheduleUi } from '../../../lib/browser';
import { SectionTitle, DataTable, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { ActionBtn } from '../../../components/AdminFormFields';
import { IconButton } from '../../../components/ui/IconButton';
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
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .getUsers()
      .then((res) => setUsers((res.data as UserRow[]) ?? []))
      .catch((e) => setMsg(e instanceof Error ? e.message : 'Load failed'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    scheduleUi(() => {
      void load();
    });
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

  const rows = users.map((u) => ({
    email: u.email,
    id: (
      <a href={`/dashboard/users/${u.id}`} style={{ color: '#e6c76a' }}>
        {u.id}
      </a>
    ),
    name: [u.firstName, u.lastName].filter(Boolean).join(' ') || '—',
    phone: u.phone ?? '—',
    role: u.role,
    status: u.status,
    actions: (
      <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {u.role === 'USER' && (
          <>
            <ActionBtn onClick={() => void update(u.id, { role: 'SALES' })}>Make Sales</ActionBtn>
            <ActionBtn onClick={() => void update(u.id, { role: 'CONTRACT_APPROVER' })}>
              Make Approver
            </ActionBtn>
            <ActionBtn onClick={() => void update(u.id, { role: 'ADMIN' })}>Make Admin</ActionBtn>
          </>
        )}
        {u.role !== 'USER' && u.email !== 'admin@jetbay.local' && (
          <ActionBtn onClick={() => void update(u.id, { role: 'USER' })}>Set User</ActionBtn>
        )}
        {u.status === 'ACTIVE' ? (
          <IconButton
            name="ban"
            label={`Suspend user ${u.email}`}
            onClick={() => void update(u.id, { status: 'SUSPENDED' })}
          />
        ) : (
          <IconButton
            name="check"
            label={`Activate user ${u.email}`}
            onClick={() => void update(u.id, { status: 'ACTIVE' })}
          />
        )}
      </span>
    ),
  }));

  return (
    <AdminShell active="/dashboard/users">
      <SectionTitle>Users</SectionTitle>
      <Muted>Manage roles and account status.</Muted>
      {loading ? (
        <Muted>Loading users…</Muted>
      ) : (
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
