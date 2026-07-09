'use client';

import { useCallback, useEffect, useState } from 'react';
import { SectionTitle, DataTable, Muted, Button } from '@jetbay/ui';
import { AdminShell } from '../../../../components/AdminShell';
import { AdminField, AdminPanel, ActionBtn } from '../../../../components/AdminFormFields';
import { adminApi } from '../../../../lib/api';

type VideoForm = {
  id: number;
  slug: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  status: string;
};

const emptyForm = (): VideoForm => ({
  id: 0,
  slug: '',
  title: '',
  videoUrl: '',
  thumbnail: '',
  duration: 0,
  status: 'draft',
});

export default function VideosAdminPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<VideoForm | null>(null);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .getVideos()
      .then((res) => {
        const data = (res as { data: Record<string, unknown>[] }).data ?? [];
        setRows(
          data.map((v) => ({
            id: String(v.id),
            title: String(v.title ?? v.slug),
            slug: String(v.slug),
            status: String(v.status ?? 'draft'),
            duration: String(v.duration ?? 0),
            actions: (
              <span>
                <ActionBtn
                  onClick={() =>
                    setForm({
                      id: Number(v.id),
                      slug: String(v.slug ?? ''),
                      title: String(v.title ?? ''),
                      videoUrl: String(v.videoUrl ?? ''),
                      thumbnail: String(v.thumbnail ?? ''),
                      duration: Number(v.duration ?? 0),
                      status: String(v.status ?? 'draft'),
                    })
                  }
                >
                  Edit
                </ActionBtn>
                {' · '}
                <ActionBtn variant="danger" onClick={() => remove(Number(v.id))}>
                  Delete
                </ActionBtn>
              </span>
            ),
          })),
        );
      })
      .catch((e) => setMsg(e instanceof Error ? e.message : 'Load failed'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    if (!form) return;
    setSaving(true);
    setMsg('');
    try {
      const body = {
        slug: form.slug,
        videoUrl: form.videoUrl,
        thumbnail: form.thumbnail || undefined,
        duration: form.duration,
        status: form.status,
        translation: {
          locale: 'en',
          title: form.title,
          body: form.title,
          excerpt: form.title,
        },
      };
      if (form.id) {
        await adminApi.updateVideo(form.id, body);
        setMsg('Video updated.');
      } else {
        await adminApi.createVideo(body);
        setMsg('Video created.');
      }
      setForm(null);
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm('Delete this video?')) return;
    try {
      await adminApi.deleteVideo(id);
      setMsg('Video deleted.');
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <AdminShell active="/dashboard/content/videos">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <SectionTitle>Videos</SectionTitle>
        <Button type="button" onClick={() => setForm(emptyForm())}>
          + New Video
        </Button>
      </div>

      {form && (
        <AdminPanel title={form.id ? `Edit #${form.id}` : 'New Video'} onClose={() => setForm(null)}>
          <AdminField label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
          <AdminField label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
          <AdminField label="Video URL" value={form.videoUrl} onChange={(v) => setForm({ ...form, videoUrl: v })} required />
          <AdminField label="Thumbnail URL" value={form.thumbnail} onChange={(v) => setForm({ ...form, thumbnail: v })} />
          <AdminField
            label="Duration (seconds)"
            value={String(form.duration)}
            onChange={(v) => setForm({ ...form, duration: Number(v) })}
            type="number"
          />
          <AdminField label="Status (draft / published)" value={form.status} onChange={(v) => setForm({ ...form, status: v })} />
          <Button type="button" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </AdminPanel>
      )}

      {loading ? (
        <Muted>Loading videos…</Muted>
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'title', label: 'Title' },
            { key: 'slug', label: 'Slug' },
            { key: 'duration', label: 'Duration' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' },
          ]}
          rows={rows}
        />
      )}
      {msg && <p style={{ marginTop: 12, color: '#4ade80' }}>{msg}</p>}
    </AdminShell>
  );
}
