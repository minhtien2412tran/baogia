'use client';

import { useEffect, useState } from 'react';
import { SectionTitle, Muted, DataTable } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';

export default function JetbayCleanupPage() {
  const [groups, setGroups] = useState<Record<string, unknown>[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    adminApi
      .getJetbayCleanup()
      .then((r) => setGroups((r.groups as Record<string, unknown>[]) ?? []))
      .catch((e: Error) => setMsg(e.message));
  }, []);

  return (
    <AdminShell active="/dashboard/jetbay-cleanup">
      <SectionTitle>Legacy brand cleanup report</SectionTitle>
      <Muted>Tracking remnant brand/claims. Full table: docs/jetbay-cleanup-audit.md</Muted>
      {msg ? <p>{msg}</p> : null}
      <DataTable
        columns={[
          { key: 'group', label: 'Group' },
          { key: 'findings', label: 'Findings' },
          { key: 'replaced', label: 'Replaced' },
          { key: 'removed', label: 'Removed' },
          { key: 'pending', label: 'Pending' },
          { key: 'notes', label: 'Notes' },
        ]}
        rows={groups.map((g) => ({
          group: String(g.group),
          findings: String(g.findings),
          replaced: String(g.replaced),
          removed: String(g.removed),
          pending: String(g.pendingReview),
          notes: String(g.notes),
        }))}
      />
    </AdminShell>
  );
}
