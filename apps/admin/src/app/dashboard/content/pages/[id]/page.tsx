'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SectionTitle, Button, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../../../components/AdminShell';
import { AdminField } from '../../../../../components/AdminFormFields';
import { RichTextEditor } from '../../../../../components/RichTextEditor';
import { adminApi } from '../../../../../lib/api';

export default function CmsPageEditor({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNew = params.id === 'new';
  const pageId = isNew ? 0 : Number(params.id);

  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('draft');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    adminApi
      .getPage(pageId)
      .then((p) => {
        setSlug(String(p.slug ?? ''));
        setStatus(String(p.status ?? 'draft'));
        setTitle(String(p.title ?? ''));
        setExcerpt(String(p.excerpt ?? ''));
        setBody(String(p.content ?? p.body ?? ''));
      })
      .catch((e) => setMsg(e instanceof Error ? e.message : 'Load failed'))
      .finally(() => setLoading(false));
  }, [pageId, isNew]);

  async function save() {
    setSaving(true);
    setMsg('');
    const payload = {
      slug,
      status,
      translation: {
        locale: 'en',
        title,
        excerpt,
        body,
        seoTitle: title,
        seoDescription: excerpt || title,
      },
    };
    try {
      if (isNew) {
        const created = (await adminApi.createPage(payload)) as { id: number };
        router.push(`/dashboard/content/pages/${created.id}`);
        setMsg('Page created.');
      } else {
        await adminApi.updatePage(pageId, payload);
        setMsg('Page saved.');
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (isNew || !confirm('Delete this page?')) return;
    await adminApi.deletePage(pageId);
    router.push('/dashboard/content/pages');
  }

  if (loading) {
    return (
      <AdminShell active="/dashboard/content/pages">
        <Muted>Loading page…</Muted>
      </AdminShell>
    );
  }

  return (
    <AdminShell active="/dashboard/content/pages">
      <p style={{ marginBottom: 16 }}>
        <Link href="/dashboard/content/pages" style={{ color: '#f1d99a' }}>
          ← All CMS pages
        </Link>
      </p>
      <SectionTitle>{isNew ? 'New CMS Page' : `Edit Page #${pageId}`}</SectionTitle>

      <AdminField label="Slug" value={slug} onChange={setSlug} required />
      <AdminField label="Status (draft / published)" value={status} onChange={setStatus} />
      <AdminField label="Title" value={title} onChange={setTitle} required />
      <AdminField label="Excerpt" value={excerpt} onChange={setExcerpt} />
      <RichTextEditor label="Body" value={body} onChange={setBody} />

      <div style={{ display: 'flex', gap: 12 }}>
        <Button type="button" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
        {!isNew && (
          <Button type="button" onClick={remove}>
            Delete
          </Button>
        )}
      </div>
      {msg && <p style={{ marginTop: 12, color: '#4ade80' }}>{msg}</p>}
    </AdminShell>
  );
}
