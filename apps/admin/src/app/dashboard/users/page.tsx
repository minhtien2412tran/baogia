'use client';

import { SectionTitle, Muted } from '@j-ta/ui';
import { AdminShell } from '../../../components/AdminShell';

export default function UsersAdminPage() {
  return (
    <AdminShell active="/dashboard/users">
      <SectionTitle>Users</SectionTitle>
      <Muted>
        User management CRUD is planned for a future sprint. Use audit logs and bookings to trace user activity.
      </Muted>
    </AdminShell>
  );
}
