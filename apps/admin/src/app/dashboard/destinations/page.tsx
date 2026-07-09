'use client';

import { useCallback, useEffect, useState } from 'react';
import { SectionTitle, Muted, Button } from '@j-ta/ui';
import { AdminShell } from '../../../components/AdminShell';
import { AdminField, AdminPanel, ActionBtn } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

type DestRow = {
  id: number;
  slug: string;
  category: string;
  city: string;
  country: string;
  title?: string;
  status?: string;
  thumbnail?: string;
};

const emptyForm = (): DestRow & { titleEn: string; bodyEn: string } => ({
  id: 0,
  slug: '',
  category: 'ISLAND',
  city: '',
  country: '',
  title: '',
  status: 'draft',
  thumbnail: '',
  titleEn: '',
  bodyEn: '',
});

export default function DestinationsAdminPage() {
  const [rows, setRows] = useState<DestRow[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ReturnType<typeof emptyForm> | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .getDestinations(filter || undefined)
      .then((res) => setRows((res.data ?? []) as DestRow[]))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filter]);

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
        category: form.category,
        city: form.city,
        country: form.country,
        thumbnail: form.thumbnail || undefined,
        status: form.status ?? 'draft',
        translation: {
          locale: 'en',
          title: form.titleEn || form.city,
          body: form.bodyEn || `${form.city}, ${form.country}`,
        },
      };
      if (form.id) {
        await adminApi.updateDestination(form.id, body);
        setMsg('Destination updated');
      } else {
        await adminApi.createDestination(body);
        setMsg('Destination created');
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
    if (!confirm('Delete this destination?')) return;
    try {
      await adminApi.deleteDestination(id);
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <AdminShell active="/dashboard/destinations">
      <SectionTitle>Destinations</SectionTitle>
      <Muted>Curated island, ski, and golf destinations served via GET /content/destinations.</Muted>

      <div style={{ margin: '16px 0', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['', 'ISLAND', 'SKI', 'GOLF'].map((c) => (
          <button
            key={c || 'all'}
            type="button"
            onClick={() => setFilter(c)}
            style={{ padding: '6px 12px', cursor: 'pointer', fontWeight: filter === c ? 'bold' : 'normal' }}
          >
            {c || 'All'}
          </button>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <Button type="button" onClick={() => setForm(emptyForm())}>
            Add destination
          </Button>
        </div>
      </div>

      {loading && <Muted>Loading…</Muted>}
      {error && <p style={{ color: '#c44' }}>{error}</p>}
      {msg && <p>{msg}</p>}

      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              <th align="left">City</th>
              <th align="left">Category</th>
              <th align="left">Slug</th>
              <th align="left">Status</th>
              <th align="left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id}>
                <td>{d.title ?? d.city}</td>
                <td>{d.category}</td>
                <td>
                  <code>{d.slug}</code>
                </td>
                <td>{d.status ?? '—'}</td>
                <td>
                  <ActionBtn
                    onClick={() =>
                      setForm({
                        ...d,
                        titleEn: d.title ?? d.city,
                        bodyEn: '',
                      })
                    }
                  >
                    Edit
                  </ActionBtn>
                  {' · '}
                  <ActionBtn variant="danger" onClick={() => remove(d.id)}>
                    Delete
                  </ActionBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {form && (
        <AdminPanel title={form.id ? 'Edit destination' : 'New destination'} onClose={() => setForm(null)}>
          <AdminField label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
          <AdminField label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
          <AdminField label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
          <label style={{ display: 'block', marginBottom: 12 }}>
            Category
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{ display: 'block', width: '100%', marginTop: 4 }}
            >
              <option value="ISLAND">ISLAND</option>
              <option value="SKI">SKI</option>
              <option value="GOLF">GOLF</option>
            </select>
          </label>
          <label style={{ display: 'block', marginBottom: 12 }}>
            Status
            <select
              value={form.status ?? 'draft'}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={{ display: 'block', width: '100%', marginTop: 4 }}
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </label>
          <AdminField
            label="Thumbnail URL"
            value={form.thumbnail ?? ''}
            onChange={(v) => setForm({ ...form, thumbnail: v })}
          />
          <AdminField label="Title (EN)" value={form.titleEn} onChange={(v) => setForm({ ...form, titleEn: v })} />
          <AdminField
            label="Body (EN)"
            value={form.bodyEn}
            onChange={(v) => setForm({ ...form, bodyEn: v })}
            rows={4}
          />
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <Button type="button" disabled={saving} onClick={save}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setForm(null)}>
              Cancel
            </Button>
          </div>
        </AdminPanel>
      )}
    </AdminShell>
  );
}
