'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SectionTitle, Muted, Button, Input } from '@jetbay/ui';
import { AdminShell } from '../../../../components/AdminShell';
import { adminApi } from '../../../../lib/api';

type Pillar = { title: string; subtitle?: string; body: string };
type Card = { title: string; body: string };

type AboutCms = {
  heroTitle: string;
  heroSubtitle: string;
  introTitle: string;
  introBody: string;
  pillarsTitle: string;
  pillars: Pillar[];
  flyAnywhereTitle: string;
  flyAnywhereBody: string;
  teamTitle: string;
  teamCards: Card[];
  awardsTitle: string;
  awardsSubtitle: string;
  whyTitle: string;
  whyIntro: string;
  whyItems: Card[];
  officesTitle: string;
};

const EMPTY: AboutCms = {
  heroTitle: '',
  heroSubtitle: '',
  introTitle: '',
  introBody: '',
  pillarsTitle: '',
  pillars: [
    { title: '', subtitle: '', body: '' },
    { title: '', subtitle: '', body: '' },
    { title: '', body: '' },
  ],
  flyAnywhereTitle: '',
  flyAnywhereBody: '',
  teamTitle: '',
  teamCards: [
    { title: '', body: '' },
    { title: '', body: '' },
    { title: '', body: '' },
  ],
  awardsTitle: '',
  awardsSubtitle: '',
  whyTitle: '',
  whyIntro: '',
  whyItems: [
    { title: '', body: '' },
    { title: '', body: '' },
    { title: '', body: '' },
    { title: '', body: '' },
  ],
  officesTitle: '',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: 10,
  borderRadius: 8,
  background: '#0d1a24',
  color: '#f6efe2',
  border: '1px solid rgba(255,255,255,0.1)',
  fontFamily: 'inherit',
};

function Field({
  label,
  value,
  onChange,
  rows = 1,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label style={{ display: 'block', margin: '10px 0' }}>
      <span style={{ display: 'block', marginBottom: 4, fontSize: 13, opacity: 0.7 }}>{label}</span>
      {rows > 1 ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} style={textareaStyle} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} style={textareaStyle} />
      )}
    </label>
  );
}

function mergeCms(parsed: Partial<AboutCms>): AboutCms {
  return {
    ...EMPTY,
    ...parsed,
    pillars: EMPTY.pillars.map((p, i) => ({ ...p, ...(parsed.pillars?.[i] ?? {}) })),
    teamCards: EMPTY.teamCards.map((p, i) => ({ ...p, ...(parsed.teamCards?.[i] ?? {}) })),
    whyItems: EMPTY.whyItems.map((p, i) => ({ ...p, ...(parsed.whyItems?.[i] ?? {}) })),
  };
}

export default function EditAboutUsPage() {
  const [pageId, setPageId] = useState<number | null>(null);
  const [cms, setCms] = useState<AboutCms>(EMPTY);
  const [pageTitle, setPageTitle] = useState('About JetVina');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'saved' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    adminApi.getPages().then((res) => {
      const data = (res as { data: Record<string, unknown>[] }).data ?? [];
      const page = data.find((p) => p.slug === 'about-us');
      if (!page) return;
      setPageId(Number(page.id));
      setPageTitle(String(page.title ?? 'About JetVina'));
      setExcerpt(String((page as { excerpt?: string }).excerpt ?? ''));
      const body = String((page as { body?: string }).body ?? '');
      try {
        setCms(mergeCms(JSON.parse(body) as Partial<AboutCms>));
      } catch {
        setCms({ ...EMPTY, introBody: body });
      }
    }).catch(console.error);
  }, []);

  function set<K extends keyof AboutCms>(key: K, value: AboutCms[K]) {
    setCms((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (!pageId) return;
    setStatus('loading');
    setMsg('');
    try {
      await adminApi.updatePage(pageId, {
        status: 'published',
        translation: {
          locale: 'en',
          title: pageTitle,
          excerpt,
          body: JSON.stringify(cms, null, 2),
          seoTitle: `${pageTitle} - JetVina`,
          seoDescription: excerpt || cms.heroSubtitle,
        },
      });
      setStatus('saved');
      setMsg('Saved. Preview at /en-us/about-us');
    } catch (e) {
      setStatus('error');
      setMsg(e instanceof Error ? e.message : 'Save failed');
    }
  }

  return (
    <AdminShell active="/dashboard/content">
      <SectionTitle>Edit About Us (CMS)</SectionTitle>
      <Muted style={{ marginBottom: 12 }}>
        Full page copy from scratch HTML clone. Images stay on the web layout (local assets).
      </Muted>
      <p style={{ marginBottom: 20 }}>
        <Link href="/dashboard/content/pages" style={{ color: '#f1d99a', marginRight: 16 }}>← All pages</Link>
        <a href="http://localhost:3000/en-us/about-us" target="_blank" rel="noreferrer" style={{ color: '#f1d99a' }}>
          Preview web page ↗
        </a>
      </p>

      <Input label="Page title" value={pageTitle} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPageTitle(e.target.value)} />
      <Field label="Excerpt / SEO description" value={excerpt} onChange={(v) => setExcerpt(v)} rows={2} />

      <h3 style={{ marginTop: 24, color: '#f1d99a' }}>Hero</h3>
      <Field label="Hero title" value={cms.heroTitle} onChange={(v) => set('heroTitle', v)} />
      <Field label="Hero subtitle" value={cms.heroSubtitle} onChange={(v) => set('heroSubtitle', v)} rows={3} />

      <h3 style={{ marginTop: 24, color: '#f1d99a' }}>Intro</h3>
      <Field label="Intro title" value={cms.introTitle} onChange={(v) => set('introTitle', v)} />
      <Field label="Intro body" value={cms.introBody} onChange={(v) => set('introBody', v)} rows={4} />

      <h3 style={{ marginTop: 24, color: '#f1d99a' }}>Pillars</h3>
      <Field label="Section title" value={cms.pillarsTitle} onChange={(v) => set('pillarsTitle', v)} />
      {cms.pillars.map((p, i) => (
        <div key={i} style={{ padding: 12, marginBottom: 12, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}>
          <Muted>Pillar {i + 1}</Muted>
          <Field label="Title" value={p.title} onChange={(v) => {
            const next = [...cms.pillars];
            next[i] = { ...next[i], title: v };
            set('pillars', next);
          }} />
          {i === 0 && (
            <Field label="Subtitle" value={p.subtitle ?? ''} onChange={(v) => {
              const next = [...cms.pillars];
              next[i] = { ...next[i], subtitle: v };
              set('pillars', next);
            }} />
          )}
          <Field label="Body" value={p.body} onChange={(v) => {
            const next = [...cms.pillars];
            next[i] = { ...next[i], body: v };
            set('pillars', next);
          }} rows={3} />
        </div>
      ))}

      <h3 style={{ marginTop: 24, color: '#f1d99a' }}>Fly anywhere</h3>
      <Field label="Title" value={cms.flyAnywhereTitle} onChange={(v) => set('flyAnywhereTitle', v)} />
      <Field label="Body" value={cms.flyAnywhereBody} onChange={(v) => set('flyAnywhereBody', v)} rows={3} />

      <h3 style={{ marginTop: 24, color: '#f1d99a' }}>Team</h3>
      <Field label="Section title" value={cms.teamTitle} onChange={(v) => set('teamTitle', v)} />
      {cms.teamCards.map((c, i) => (
        <div key={i} style={{ padding: 12, marginBottom: 12, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}>
          <Muted>Team card {i + 1}</Muted>
          <Field label="Title" value={c.title} onChange={(v) => {
            const next = [...cms.teamCards];
            next[i] = { ...next[i], title: v };
            set('teamCards', next);
          }} />
          <Field label="Body" value={c.body} onChange={(v) => {
            const next = [...cms.teamCards];
            next[i] = { ...next[i], body: v };
            set('teamCards', next);
          }} rows={3} />
        </div>
      ))}

      <h3 style={{ marginTop: 24, color: '#f1d99a' }}>Awards</h3>
      <Field label="Title" value={cms.awardsTitle} onChange={(v) => set('awardsTitle', v)} />
      <Field label="Subtitle" value={cms.awardsSubtitle} onChange={(v) => set('awardsSubtitle', v)} />

      <h3 style={{ marginTop: 24, color: '#f1d99a' }}>Why charter</h3>
      <Field label="Title" value={cms.whyTitle} onChange={(v) => set('whyTitle', v)} />
      <Field label="Intro" value={cms.whyIntro} onChange={(v) => set('whyIntro', v)} rows={2} />
      {cms.whyItems.map((c, i) => (
        <div key={i} style={{ padding: 12, marginBottom: 12, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}>
          <Muted>Item {i + 1}</Muted>
          <Field label="Title" value={c.title} onChange={(v) => {
            const next = [...cms.whyItems];
            next[i] = { ...next[i], title: v };
            set('whyItems', next);
          }} />
          <Field label="Body" value={c.body} onChange={(v) => {
            const next = [...cms.whyItems];
            next[i] = { ...next[i], body: v };
            set('whyItems', next);
          }} rows={2} />
        </div>
      ))}

      <h3 style={{ marginTop: 24, color: '#f1d99a' }}>Offices</h3>
      <Field label="Section title" value={cms.officesTitle} onChange={(v) => set('officesTitle', v)} />

      <div style={{ marginTop: 24 }}>
        <Button type="button" onClick={save} disabled={status === 'loading' || !pageId}>
          {status === 'loading' ? 'Saving…' : 'Save About Us'}
        </Button>
      </div>
      {msg && <p style={{ marginTop: 12, color: status === 'error' ? '#f87171' : '#4ade80' }}>{msg}</p>}
    </AdminShell>
  );
}
