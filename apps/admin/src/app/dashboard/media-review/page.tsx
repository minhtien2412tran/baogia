'use client';

import { useEffect, useState } from 'react';
import { SectionTitle, Muted, Button } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';
import { scheduleUi } from '../../../lib/browser';

type MediaRow = {
  id: number;
  storageKey: string;
  sourceUrl?: string | null;
  wordpressMediaId?: number | null;
  width?: number | null;
  height?: number | null;
  checksum?: string | null;
  usageContexts?: unknown;
  rightsStatus: string;
  approvedForStaging?: boolean;
  approvedForPublish?: boolean;
  altText?: string | null;
  focalPointX?: number | null;
  focalPointY?: number | null;
};

export default function MediaReviewPage() {
  const [assets, setAssets] = useState<MediaRow[]>([]);
  const [filter, setFilter] = useState('UNVERIFIED');
  const [msg, setMsg] = useState('');
  const [selected, setSelected] = useState<MediaRow | null>(null);
  const [altText, setAltText] = useState('');
  const [fx, setFx] = useState('0.5');
  const [fy, setFy] = useState('0.5');
  const [busy, setBusy] = useState(false);

  async function load(status = filter) {
    setMsg('');
    try {
      const r = await adminApi.listMediaAssets(status || undefined);
      scheduleUi(() => setAssets((r.assets as MediaRow[]) ?? []));
    } catch (e) {
      scheduleUi(() => setMsg(e instanceof Error ? e.message : 'Load failed'));
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openDetail(row: MediaRow) {
    setSelected(row);
    setAltText(row.altText ?? '');
    setFx(String(row.focalPointX ?? 0.5));
    setFy(String(row.focalPointY ?? 0.5));
  }

  async function saveMeta() {
    if (!selected) return;
    setBusy(true);
    setMsg('');
    try {
      await adminApi.upsertMediaAsset({
        id: selected.id,
        storageKey: selected.storageKey,
        altText,
        focalPointX: Number(fx),
        focalPointY: Number(fy),
        rightsStatus: selected.rightsStatus,
      });
      setMsg('Saved alt/focal');
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  async function approveStaging() {
    if (!selected) return;
    setBusy(true);
    try {
      await adminApi.approveMediaStaging(selected.id);
      setMsg('Staging approved');
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Staging approve failed');
    } finally {
      setBusy(false);
    }
  }

  async function approveProduction() {
    if (!selected) return;
    setBusy(true);
    try {
      await adminApi.approveMediaProduction(selected.id);
      setMsg('Production approved');
      await load();
    } catch (e) {
      setMsg(
        e instanceof Error
          ? e.message
          : 'Production approve rejected (expected for UNVERIFIED)',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell active="/dashboard/media-review">
      <SectionTitle>Media review</SectionTitle>
      <Muted>
        Staging approve is allowed for review. Production approve requires OWNED / LICENSED /
        CLIENT_PROVIDED / PUBLIC_DOMAIN. UNVERIFIED JetVina mirrors stay blocked for production.
      </Muted>
      <div style={{ display: 'flex', gap: 8, margin: '12px 0', flexWrap: 'wrap' }}>
        <label>
          Rights filter{' '}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter rights status"
          >
            <option value="">All</option>
            <option value="UNVERIFIED">UNVERIFIED</option>
            <option value="CLIENT_PROVIDED">CLIENT_PROVIDED</option>
            <option value="OWNED">OWNED</option>
            <option value="LICENSED">LICENSED</option>
            <option value="PROHIBITED">PROHIBITED</option>
          </select>
        </label>
        <Button type="button" onClick={() => void load(filter)} disabled={busy}>
          Refresh
        </Button>
      </div>
      {msg ? <p role="status">{msg}</p> : null}
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">File</th>
              <th scope="col">Rights</th>
              <th scope="col">Staging</th>
              <th scope="col">Prod</th>
              <th scope="col">Size</th>
              <th scope="col">Checksum</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.storageKey.split('/').pop()}</td>
                <td>{a.rightsStatus}</td>
                <td>{String(a.approvedForStaging ?? false)}</td>
                <td>{String(a.approvedForPublish ?? false)}</td>
                <td>
                  {a.width ?? '—'}×{a.height ?? '—'}
                </td>
                <td>{(a.checksum ?? '—').slice(0, 12)}</td>
                <td>
                  <Button type="button" onClick={() => openDetail(a)}>
                    Open
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected ? (
        <section style={{ marginTop: 24 }} aria-label="Media detail">
          <h2>Detail #{selected.id}</h2>
          <p>
            WP id: {selected.wordpressMediaId ?? '—'} · checksum: {selected.checksum ?? '—'} · source:{' '}
            {selected.sourceUrl ?? '—'}
          </p>
          <label>
            Alt text{' '}
            <input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              aria-label="Alt text"
            />
          </label>
          <label>
            Focal X{' '}
            <input value={fx} onChange={(e) => setFx(e.target.value)} aria-label="Focal point X" />
          </label>
          <label>
            Focal Y{' '}
            <input value={fy} onChange={(e) => setFy(e.target.value)} aria-label="Focal point Y" />
          </label>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <Button type="button" onClick={() => void saveMeta()} disabled={busy}>
              Save meta
            </Button>
            <Button type="button" onClick={() => void approveStaging()} disabled={busy}>
              Approve staging
            </Button>
            <Button type="button" onClick={() => void approveProduction()} disabled={busy}>
              Approve production
            </Button>
          </div>
        </section>
      ) : null}
    </AdminShell>
  );
}
