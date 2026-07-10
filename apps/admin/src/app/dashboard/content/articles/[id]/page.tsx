'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { SectionTitle, Button, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../../../components/AdminShell';
import { AdminField } from '../../../../../components/AdminFormFields';
import { RichTextEditor } from '../../../../../components/RichTextEditor';
import { adminApi } from '../../../../../lib/api';

export default function ArticleEditorPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const rawId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const isNew = rawId === 'new';
  const articleId = isNew ? 0 : Number(rawId);
  const idValid = isNew || (Number.isFinite(articleId) && articleId > 0);

  const [type, setType] = useState('news');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('JetBay Editorial');
  const [status, setStatus] = useState('draft');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(!isNew && idValid);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew || !idValid) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    adminApi
      .getArticle(articleId)
      .then((a) => {
        if (cancelled) return;
        setType(String(a.type ?? 'news').toLowerCase());
        setSlug(String(a.slug ?? ''));
        setAuthor(String(a.author ?? 'JetBay Editorial'));
        setStatus(String(a.status ?? 'draft'));
        setTitle(String(a.title ?? ''));
        setExcerpt(String(a.excerpt ?? ''));
        setBody(String(a.content ?? a.body ?? ''));
      })
      .catch((e) => {
        if (!cancelled) setMsg(e instanceof Error ? e.message : 'Load failed');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [articleId, isNew, idValid]);

  async function save() {
    if (!idValid) {
      setMsg('Invalid article id');
      return;
    }
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
    if (isNew || !idValid || !confirm('Delete this article?')) return;
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
        <Link href="/dashboard/content" style={{ color: 'var(--jb-accent)' }}>
          ← All articles
        </Link>
      </p>
      <SectionTitle>
        {isNew ? 'New Article' : idValid ? `Edit Article #${articleId}` : 'Edit Article'}
      </SectionTitle>

      {!idValid && (
        <p className="jb-form-error" style={{ marginBottom: 16 }}>
          Invalid article id in URL.
        </p>
      )}

      <AdminField label="Type (news / blog)" value={type} onChange={setType} />
      <AdminField label="Slug" value={slug} onChange={setSlug} required />
      <AdminField label="Author" value={author} onChange={setAuthor} />
      <AdminField label="Status (draft / published)" value={status} onChange={setStatus} />
      <AdminField label="Title" value={title} onChange={setTitle} required />
      <AdminField label="Excerpt" value={excerpt} onChange={setExcerpt} rows={2} />
      <RichTextEditor label="Body (HTML)" value={body} onChange={setBody} />

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <Button type="button" onClick={save} disabled={saving || !idValid}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
        {!isNew && idValid && (
          <Button type="button" variant="ghost" onClick={remove}>
            Delete
          </Button>
        )}
      </div>
      {msg && (
        <p
          className={
            /^(400|401|403|404|500)|fail|error|invalid/i.test(msg) ? 'jb-form-error' : 'jb-form-ok'
          }
          style={{ marginTop: 12 }}
        >
          {msg}
        </p>
      )}
    </AdminShell>
  );
}
