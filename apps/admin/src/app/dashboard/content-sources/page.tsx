'use client';

import { useCallback, useEffect, useState } from 'react';
import { SectionTitle, Muted, Button, DataTable } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';

export default function ContentSourcesPage() {
  const [sources, setSources] = useState<Record<string, unknown>[]>([]);
  const [flags, setFlags] = useState<Record<string, unknown>>({});
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    adminApi
      .listContentSources()
      .then((r) => {
        setSources((r.sources as Record<string, unknown>[]) ?? []);
        setFlags((r.flags as Record<string, unknown>) ?? {});
      })
      .catch((e: Error) => setMsg(e.message));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function seed() {
    try {
      await adminApi.seedJetvinaSource();
      setMsg('Seeded JetVina SAFE_REFERENCE source');
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Seed failed');
    }
  }

  async function test(id: number) {
    try {
      const r = await adminApi.testContentSource(id);
      setMsg(JSON.stringify(r));
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Test failed');
    }
  }

  const rows = sources.map((s) => ({
    id: String(s.id),
    name: String(s.name),
    mode: String(s.syncMode),
    enabled: String(s.isEnabled),
    lastOk: String(s.lastTestOk ?? '—'),
    actions: (
      <Button type="button" onClick={() => test(Number(s.id))}>
        Test
      </Button>
    ),
  }));

  return (
    <AdminShell active="/dashboard/content-sources">
      <SectionTitle>Content sources</SectionTitle>
      <Muted>
        Default mode SAFE_REFERENCE_MODE — metadata discovery only. Flags:{' '}
        {JSON.stringify(flags)}
      </Muted>
      {msg ? <p>{msg}</p> : null}
      <Button type="button" onClick={seed}>
        Seed JetVina reference source
      </Button>
      <DataTable
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
          { key: 'mode', label: 'Mode' },
          { key: 'enabled', label: 'Enabled' },
          { key: 'lastOk', label: 'Last test' },
          { key: 'actions', label: 'Actions' },
        ]}
        rows={rows}
      />
    </AdminShell>
  );
}
