'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SectionTitle, Muted, Button } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { ActionBtn } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

type MediaObject = {
  key: string;
  url: string;
  size: number;
  lastModified: string;
};

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function objectKeyFromStorageKey(key: string) {
  return key.startsWith('media/') ? key.slice('media/'.length) : key;
}

export default function MediaAdminPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [objects, setObjects] = useState<MediaObject[]>([]);
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .listMedia()
      .then((res) => {
        setConfigured(res.configured);
        setObjects(res.objects ?? []);
      })
      .catch((e: Error) => setMsg(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onUpload(file: File) {
    setUploading(true);
    setMsg('');
    try {
      await adminApi.uploadMedia(file);
      setMsg('Uploaded successfully');
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function remove(key: string) {
    if (!confirm('Delete this file?')) return;
    try {
      await adminApi.deleteMedia(objectKeyFromStorageKey(key));
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <AdminShell active="/dashboard/media">
      <SectionTitle>Media Library</SectionTitle>
      <Muted>
        Upload images and PDFs to MinIO. Set MINIO_ENDPOINT in API environment. Public URLs are served via GET /media/:objectKey.
      </Muted>

      {!configured && !loading && (
        <p style={{ color: '#c88', marginBottom: 12 }}>
          MinIO not configured — uploads will fail until MINIO_ENDPOINT is set on the API.
        </p>
      )}

      <div style={{ margin: '16px 0', display: 'flex', gap: 12, alignItems: 'center' }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void onUpload(file);
            e.target.value = '';
          }}
        />
        <Button type="button" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? 'Uploading…' : 'Upload file'}
        </Button>
        <Button type="button" variant="ghost" onClick={load}>
          Refresh
        </Button>
      </div>

      {msg && <p style={{ marginBottom: 12 }}>{msg}</p>}
      {loading && <Muted>Loading…</Muted>}

      {!loading && objects.length === 0 && <Muted>No files uploaded yet.</Muted>}

      {!loading && objects.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {objects.map((obj) => {
            const isImage = /\.(jpe?g|png|gif|webp|svg)$/i.test(obj.key);
            return (
              <div
                key={obj.key}
                style={{ border: '1px solid #333', borderRadius: 8, padding: 12, background: '#111' }}
              >
                {isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={obj.url} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 4 }} />
                ) : (
                  <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222' }}>
                    PDF
                  </div>
                )}
                <p style={{ fontSize: 12, margin: '8px 0 4px', wordBreak: 'break-all' }}>{obj.key}</p>
                <p style={{ fontSize: 11, color: '#888', margin: '0 0 8px' }}>
                  {formatBytes(obj.size)} · {obj.lastModified.slice(0, 10)}
                </p>
                <input
                  readOnly
                  value={obj.url}
                  style={{ width: '100%', fontSize: 11, marginBottom: 8 }}
                  onFocus={(e) => e.target.select()}
                />
                <ActionBtn variant="danger" onClick={() => remove(obj.key)}>
                  Delete
                </ActionBtn>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
