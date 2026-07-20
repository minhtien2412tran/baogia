'use client';

import { useEffect, useState } from 'react';
import { scheduleUi } from '../../../lib/browser';
import Link from 'next/link';
import { SectionTitle, DataTable, Muted, Button } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { ActionBtn } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

export default function ContentPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    setError('');
    adminApi
      .getArticles()
      .then((res) => {
        const articles = (res as { data: Record<string, unknown>[] }).data ?? [];
        setRows(
          articles.map((a) => ({
            id: String(a.id),
            title: String(a.title ?? a.slug),
            slug: String(a.slug),
            type: String(a.type ?? 'article'),
            published: String(a.status ?? 'draft'),
            actions: (
              <ActionBtn onClick={() => { window.location.href = `/dashboard/content/articles/${a.id}`; }}>
                Edit
              </ActionBtn>
            ),
          })),
        );
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Load failed'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    scheduleUi(() => {
      void load();
    });
  }, []);

  return (
    <AdminShell active="/dashboard/content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <SectionTitle>Content</SectionTitle>
        <Link href="/dashboard/content/articles/new">
          <Button type="button">+ New Article</Button>
        </Link>
      </div>
      <p style={{ marginBottom: 16 }}>
        <Link href="/dashboard/content/pages" style={{ color: '#f1d99a' }}>CMS Pages →</Link>
        {' · '}
        <Link href="/dashboard/content/videos" style={{ color: '#f1d99a' }}>Videos →</Link>
        {' · '}
        <Link href="/dashboard/content/about-us" style={{ color: '#f1d99a' }}>About Us →</Link>
        {' · '}
        <Link href="/dashboard/content/booking-process" style={{ color: '#f1d99a' }}>Booking Process →</Link>
      </p>
      <SectionTitle>News &amp; Blog Articles</SectionTitle>
      {error ? <p style={{ color: '#fca5a5' }}>{error}</p> : null}
      {loading ? (
        <Muted>Loading content...</Muted>
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'title', label: 'Title' },
            { key: 'slug', label: 'Slug' },
            { key: 'type', label: 'Type' },
            { key: 'published', label: 'Published' },
            { key: 'actions', label: 'Actions' },
          ]}
          rows={rows}
        />
      )}
    </AdminShell>
  );
}
