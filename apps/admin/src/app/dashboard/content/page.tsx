'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SectionTitle, DataTable, Muted } from '@j-ta/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';

export default function ContentPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getArticles()
      .then((res) => {
        const articles = (res as { data: Record<string, unknown>[] }).data ?? [];
        setRows(
          articles.map((a) => ({
            id: String(a.id),
            slug: String(a.slug),
            type: String(a.contentType ?? 'article'),
            published: a.isPublished ? 'yes' : 'no',
            title: String((a.translations as Array<{ title: string }>)?.[0]?.title ?? a.slug),
          })),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell active="/dashboard/content">
      <SectionTitle>Content</SectionTitle>
      <p style={{ marginBottom: 16 }}>
        <Link href="/dashboard/content/pages" style={{ color: '#f1d99a' }}>CMS Pages (About Us, Legal) →</Link>
        {' · '}
        <Link href="/dashboard/content/about-us" style={{ color: '#f1d99a' }}>Edit About Us →</Link>
      </p>
      <SectionTitle>News & Blog Articles</SectionTitle>
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
          ]}
          rows={rows}
        />
      )}
    </AdminShell>
  );
}
