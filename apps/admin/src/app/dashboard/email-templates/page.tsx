'use client';

import { useCallback, useEffect, useState } from 'react';
import { SectionTitle, Muted, Button } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';

type Tpl = {
  id: number;
  key: string;
  locale: string;
  subject: string;
  htmlBody: string;
  textBody?: string | null;
};

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<Tpl[]>([]);
  const [fallbackKeys, setFallbackKeys] = useState<string[]>([]);
  const [selected, setSelected] = useState<Tpl | null>(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .listEmailTemplates()
      .then((r) => {
        setTemplates((r.templates as Tpl[]) ?? []);
        setFallbackKeys(r.fallbackKeys ?? []);
      })
      .catch((e) => setMsg(e instanceof Error ? e.message : 'Load failed'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function openKey(key: string) {
    setMsg('');
    try {
      const t = (await adminApi.getEmailTemplate(key)) as Tpl;
      setSelected({
        id: t.id ?? 0,
        key,
        locale: t.locale ?? 'en',
        subject: t.subject,
        htmlBody: t.htmlBody,
        textBody: t.textBody,
      });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Open failed');
    }
  }

  async function save() {
    if (!selected) return;
    try {
      await adminApi.upsertEmailTemplate(selected.key, {
        locale: selected.locale,
        subject: selected.subject,
        htmlBody: selected.htmlBody,
        textBody: selected.textBody ?? undefined,
      });
      setMsg('Template saved');
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Save failed');
    }
  }

  const keys = Array.from(
    new Set([...templates.map((t) => t.key), ...fallbackKeys]),
  ).sort();

  return (
    <AdminShell active="/dashboard/email-templates">
      <SectionTitle>Email templates</SectionTitle>
      <Muted>
        Variables: {'{{bookingId}}'} {'{{operatorName}}'} {'{{customerName}}'}{' '}
        {'{{customerEmail}}'} {'{{bookingStatus}}'} {'{{itinerary}}'}
      </Muted>

      {loading ? <Muted>Loading…</Muted> : null}
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {keys.map((k) => (
          <li key={k}>
            <Button type="button" onClick={() => void openKey(k)}>
              {k}
            </Button>
          </li>
        ))}
      </ul>

      {selected ? (
        <section aria-label="Edit template" style={{ marginTop: 24, display: 'grid', gap: 12 }}>
          <h2>{selected.key}</h2>
          <label>
            Subject
            <input
              style={{ width: '100%', display: 'block' }}
              value={selected.subject}
              onChange={(e) => setSelected({ ...selected, subject: e.target.value })}
              aria-label="Email subject"
            />
          </label>
          <label>
            HTML body
            <textarea
              style={{ width: '100%', minHeight: 220, fontFamily: 'monospace' }}
              value={selected.htmlBody}
              onChange={(e) => setSelected({ ...selected, htmlBody: e.target.value })}
              aria-label="Email HTML body"
            />
          </label>
          <Button type="button" onClick={() => void save()}>
            Save template
          </Button>
          <div>
            <Muted>Preview</Muted>
            <div
              style={{ border: '1px solid #333', padding: 12, marginTop: 8 }}
              dangerouslySetInnerHTML={{ __html: selected.htmlBody }}
            />
          </div>
        </section>
      ) : null}
      {msg ? <p role="status">{msg}</p> : null}
    </AdminShell>
  );
}
