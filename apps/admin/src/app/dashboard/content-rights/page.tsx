'use client';

import { useEffect, useState } from 'react';
import { SectionTitle, Muted, DataTable } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';

export default function ContentRightsPage() {
  const [rights, setRights] = useState<Record<string, unknown>[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    adminApi
      .listContentRights()
      .then((r) => setRights((r.rights as Record<string, unknown>[]) ?? []))
      .catch((e: Error) => setMsg(e.message));
  }, []);

  return (
    <AdminShell active="/dashboard/content-rights">
      <SectionTitle>Content rights</SectionTitle>
      <Muted>
        Only OWNED / LICENSED / CLIENT_PROVIDED / PUBLIC_DOMAIN may publish. JetVina media stays
        UNVERIFIED/PROHIBITED until client provides assets.
      </Muted>
      {msg ? <p>{msg}</p> : null}
      <DataTable
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'type', label: 'Type' },
          { key: 'status', label: 'Status' },
          { key: 'publish', label: 'Publish?' },
          { key: 'url', label: 'Source URL' },
        ]}
        rows={rights.map((r) => ({
          id: String(r.id),
          type: String(r.assetType),
          status: String(r.rightsStatus),
          publish: String(r.approvedForPublish),
          url: String(r.sourceUrl ?? '—'),
        }))}
      />
    </AdminShell>
  );
}
