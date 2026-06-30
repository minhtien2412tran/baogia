'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SectionTitle, Muted, Button } from '@j-ta/ui';
import { AdminShell } from '../../../../components/AdminShell';
import { adminApi } from '../../../../lib/api';

type PageRow = {
  id: number;
  slug: string;
  title: string;
  isPublished: boolean;
};

export default function ContentPagesList() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getPages()
      .then((res) => {
        const data = (res as { data: Record<string, unknown>[] }).data ?? [];
        setPages(
          data.map((p) => ({
            id: Number(p.id),
            slug: String(p.slug),
            title: String(p.title ?? p.slug),
            isPublished: Boolean(p.isPublished),
          })),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell active="/dashboard/content">
      <SectionTitle>CMS Pages</SectionTitle>
      <Muted style={{ marginBottom: 16 }}>Legal and marketing pages served via GET /content/pages/:slug</Muted>
      {loading ? (
        <Muted>Loading pages…</Muted>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {pages.map((p) => (
            <li key={p.id} style={{ marginBottom: 12, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}>
              <strong>{p.title}</strong>
              <span style={{ marginLeft: 12, opacity: 0.6 }}>/{p.slug}</span>
              <span style={{ marginLeft: 12, fontSize: 12, opacity: 0.5 }}>{p.isPublished ? 'published' : 'draft'}</span>
              {p.slug === 'about-us' && (
                <Link href="/dashboard/content/about-us" style={{ marginLeft: 16, color: '#f1d99a' }}>
                  Edit layout →
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
