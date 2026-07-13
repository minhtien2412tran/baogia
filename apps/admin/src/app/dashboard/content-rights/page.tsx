'use client';

import { useEffect, useState } from 'react';
import { SectionTitle, Muted, DataTable } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';

/**
 * Content / media rights review.
 * Sync operators do not get production approve by default — use
 * content_media.approve_staging vs content_media.approve_production.
 */
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
      <SectionTitle>Content & media rights</SectionTitle>
      <Muted>
        Publish only OWNED / LICENSED / CLIENT_PROVIDED / PUBLIC_DOMAIN. JetVina mirrors stay
        UNVERIFIED until written evidence. CLIENT_DIRECTED ≠ CLIENT_PROVIDED. Production must not
        hotlink jetvina.com. Permissions: content_media.view / sync / review / approve_staging /
        approve_production / block.
      </Muted>
      {msg ? <p>{msg}</p> : null}
      <DataTable
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'type', label: 'Type' },
          { key: 'status', label: 'Rights' },
          { key: 'publish', label: 'Publish?' },
          { key: 'url', label: 'Source URL' },
          { key: 'note', label: 'Evidence / note' },
        ]}
        rows={rights.map((r) => ({
          id: String(r.id),
          type: String(r.assetType ?? r.sourceType ?? '—'),
          status: String(r.rightsStatus),
          publish: String(r.approvedForPublish ?? false),
          url: String(r.sourceUrl ?? '—'),
          note: String(r.rightsEvidence ?? r.note ?? '—'),
        }))}
      />
    </AdminShell>
  );
}
