'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { SectionTitle, Button, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../../../components/AdminShell';
import { AdminField } from '../../../../../components/AdminFormFields';
import { RichTextEditor } from '../../../../../components/RichTextEditor';
import { adminApi } from '../../../../../lib/api';

export default function CmsPageEditor() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const rawId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const isNew = rawId === 'new';
  const pageId = isNew ? 0 : Number(rawId);
  const idValid = isNew || (Number.isFinite(pageId) && pageId > 0);

  const [slug, setSlug] = useState('');
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
      .getPage(pageId)
      .then((p) => {
        if (cancelled) return;
        setSlug(String(p.slug ?? ''));
        setStatus(String(p.status ?? 'draft'));
        setTitle(String(p.title ?? ''));
        setExcerpt(String(p.excerpt ?? ''));
        setBody(String(p.content ?? p.body ?? ''));
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
  }, [pageId, isNew, idValid]);

  async function save() {
    if (!idValid) {
      setMsg('Invalid page id');
      return;
    }
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
    if (isNew || !idValid || !confirm('Delete this page?')) return;
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
        <Link href="/dashboard/content/pages" style={{ color: 'var(--jb-accent)' }}>
          ← All pages
        </Link>
      </p>
      <SectionTitle>{isNew ? 'New CMS Page' : idValid ? `Edit Page #${pageId}` : 'Edit Page'}</SectionTitle>

      {!idValid && (
        <p className="jb-form-error" style={{ marginBottom: 16 }}>
          Invalid page id in URL.
        </p>
      )}

      <AdminField label="Slug" value={slug} onChange={setSlug} required />
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
