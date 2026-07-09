'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SectionTitle, Button, Muted } from '@j-ta/ui';
import { AdminShell } from '../../../../../components/AdminShell';
import { AdminField } from '../../../../../components/AdminFormFields';
import { RichTextEditor } from '../../../../../components/RichTextEditor';
import { adminApi } from '../../../../../lib/api';

export default function ArticleEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNew = params.id === 'new';
  const articleId = isNew ? 0 : Number(params.id);

  const [type, setType] = useState('news');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('J-TA Editorial');
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
      .getArticle(articleId)
      .then((a) => {
        setType(String(a.type ?? 'news').toLowerCase());
        setSlug(String(a.slug ?? ''));
        setAuthor(String(a.author ?? 'J-TA Editorial'));
        setStatus(String(a.status ?? 'draft'));
        setTitle(String(a.title ?? ''));
        setExcerpt(String(a.excerpt ?? ''));
        setBody(String(a.content ?? a.body ?? ''));
      })
      .catch((e) => setMsg(e instanceof Error ? e.message : 'Load failed'))
      .finally(() => setLoading(false));
  }, [articleId, isNew]);

  async function save() {
    setSaving(true);
    setMsg('');
    const payload = {
      type,
      slug,
      author,
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
        const created = (await adminApi.createArticle(payload)) as { id: number };
        router.push(`/dashboard/content/articles/${created.id}`);
        setMsg('Article created.');
      } else {
        await adminApi.updateArticle(articleId, payload);
        setMsg('Article saved.');
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (isNew || !confirm('Delete this article?')) return;
    await adminApi.deleteArticle(articleId);
    router.push('/dashboard/content');
  }

  if (loading) {
    return (
      <AdminShell active="/dashboard/content">
        <Muted>Loading article…</Muted>
      </AdminShell>
    );
  }

  return (
    <AdminShell active="/dashboard/content">
      <p style={{ marginBottom: 16 }}>
        <Link href="/dashboard/content" style={{ color: '#f1d99a' }}>← All articles</Link>
      </p>
      <SectionTitle>{isNew ? 'New Article' : `Edit Article #${articleId}`}</SectionTitle>

      <AdminField label="Type (news / blog)" value={type} onChange={setType} />
      <AdminField label="Slug" value={slug} onChange={setSlug} required />
      <AdminField label="Author" value={author} onChange={setAuthor} />
      <AdminField label="Status (draft / published)" value={status} onChange={setStatus} />
      <AdminField label="Title" value={title} onChange={setTitle} required />
      <AdminField label="Excerpt" value={excerpt} onChange={setExcerpt} rows={2} />
      <RichTextEditor label="Body (HTML)" value={body} onChange={setBody} />

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <Button type="button" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
        {!isNew && (
          <Button type="button" variant="ghost" onClick={remove}>
            Delete
          </Button>
        )}
      </div>
      {msg && <p style={{ marginTop: 12, color: '#4ade80' }}>{msg}</p>}
    </AdminShell>
  );
}
