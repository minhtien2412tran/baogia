'use client';

import { useCallback, useEffect, useState } from 'react';
import { scheduleUi } from '../../../lib/browser';
import { SectionTitle, Muted, Button, DataTable } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { AdminField } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

export default function ContentSyncPage() {
  const [sourceId, setSourceId] = useState('1');
  const [jobs, setJobs] = useState<Record<string, unknown>[]>([]);
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [msg, setMsg] = useState('');

  const loadJobs = useCallback(() => {
    adminApi
      .listContentJobs()
      .then((r) => setJobs((r.jobs as Record<string, unknown>[]) ?? []))
      .catch((e: Error) => setMsg(e.message));
  }, []);

  useEffect(() => {
    scheduleUi(() => {
      void loadJobs();
    });
  }, [loadJobs]);

  async function discover() {
    try {
      const r = (await adminApi.discoverContent(Number(sourceId), true)) as {
        job?: { id: number };
        items?: { items: unknown[] };
      };
      setMsg(`Dry-run job #${r.job?.id}`);
      if (r.items?.items) setItems(r.items.items as Record<string, unknown>[]);
      loadJobs();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Discover failed');
    }
  }

  async function openItems(id: number) {
    const r = await adminApi.listContentJobItems(id);
    setItems((r.items as Record<string, unknown>[]) ?? []);
  }

  return (
    <AdminShell active="/dashboard/content-sync">
      <SectionTitle>Content sync jobs</SectionTitle>
      <Muted>Always dry-run first. Publish requires CONTENT_SYNC_PUBLISH_ENABLED + rights.</Muted>
      {msg ? <p>{msg}</p> : null}
      <AdminField label="Source ID" value={sourceId} onChange={setSourceId} />
      <Button type="button" onClick={discover}>
        Discover (dry-run)
      </Button>
      <DataTable
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'mode', label: 'Mode' },
          { key: 'status', label: 'Status' },
          { key: 'dryRun', label: 'Dry-run' },
          { key: 'counts', label: 'Counts' },
          { key: 'actions', label: 'Actions' },
        ]}
        rows={jobs.map((j) => ({
          id: String(j.id),
          mode: String(j.mode),
          status: String(j.status),
          dryRun: String(j.dryRun),
          counts: `+${j.newCount}/~${j.changedCount}/!${j.blockedCount}`,
          actions: (
            <Button type="button" onClick={() => openItems(Number(j.id))}>
              Diff
            </Button>
          ),
        }))}
      />
      <SectionTitle>Items / diff</SectionTitle>
      <DataTable
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'action', label: 'Action' },
          { key: 'rights', label: 'Rights' },
          { key: 'review', label: 'Review' },
          { key: 'externalId', label: 'External' },
        ]}
        rows={items.map((i) => ({
          id: String(i.id),
          action: String(i.action),
          rights: String(i.rightsStatus),
          review: String(i.reviewStatus),
          externalId: String(i.externalId ?? '—'),
        }))}
      />
    </AdminShell>
  );
}
