'use client';

import { useEffect, useState } from 'react';
import { scheduleUi } from '../../../../lib/browser';
import Link from 'next/link';
import { SectionTitle, Muted, Button, DataTable } from '@jetbay/ui';
import { AdminShell } from '../../../../components/AdminShell';
import { ActionBtn } from '../../../../components/AdminFormFields';
import { adminApi } from '../../../../lib/api';

export default function ContentPagesList() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  function load() {
    setLoading(true);
    adminApi
      .getPages()
      .then((res) => {
        const data = (res as { data: Record<string, unknown>[] }).data ?? [];
        setRows(
          data.map((p) => {
            const id = Number(p.id);
            const slug = String(p.slug);
            return {
              id: String(id),
              title: String(p.title ?? slug),
              slug,
              status: p.isPublished || p.status === 'published' ? 'published' : String(p.status ?? 'draft'),
              actions: (
                <span>
                  <ActionBtn onClick={() => { window.location.href = `/dashboard/content/pages/${id}`; }}>
                    Edit
                  </ActionBtn>
                  {slug === 'about-us' && (
                    <>
                      {' · '}
                      <Link href="/dashboard/content/about-us" style={{ color: '#f1d99a', fontSize: 13 }}>
                        Layout
                      </Link>
                    </>
                  )}
                  {slug === 'booking-process' && (
                    <>
                      {' · '}
                      <Link href="/dashboard/content/booking-process" style={{ color: '#f1d99a', fontSize: 13 }}>
                        Layout
                      </Link>
                    </>
                  )}
                </span>
              ),
            };
          }),
        );
      })
      .catch((e) => setMsg(e instanceof Error ? e.message : 'Load failed'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    scheduleUi(() => {
      void load();
    });
  }, []);

  return (
    <AdminShell active="/dashboard/content/pages">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <SectionTitle>CMS Pages</SectionTitle>
        <Link href="/dashboard/content/pages/new">
          <Button type="button">+ New Page</Button>
        </Link>
      </div>
      <Muted style={{ marginBottom: 16 }}>Legal & marketing pages — GET /content/pages/:slug</Muted>
      {loading ? (
        <Muted>Loading pages…</Muted>
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'title', label: 'Title' },
            { key: 'slug', label: 'Slug' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' },
          ]}
          rows={rows}
        />
      )}
      {msg && <p style={{ marginTop: 12, color: '#f87171' }}>{msg}</p>}
    </AdminShell>
  );
}
