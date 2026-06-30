'use client';

import { SectionTitle, Muted } from '@j-ta/ui';
import { AdminShell } from '../../../components/AdminShell';

export default function AircraftAdminPage() {
  return (
    <AdminShell active="/dashboard/aircraft">
      <SectionTitle>Aircraft Fleet</SectionTitle>
      <Muted>
        Aircraft categories and models are managed via seed data and quote search. Admin CRUD coming in a future sprint.
      </Muted>
    </AdminShell>
  );
}
