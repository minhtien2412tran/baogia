'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SectionTitle, Muted, Button, Input } from '@jetbay/ui';
import { AdminShell } from '../../../../components/AdminShell';
import { adminApi } from '../../../../lib/api';

type Step = { title: string; body: string };
type Item = { title: string; body: string };

type BookingCms = {
  heroTitle: string;
  heroSubtitle: string;
  introTitle: string;
  introBody: string;
  processTitle: string;
  processSubtitle: string;
  steps: Step[];
  whyTitle: string;
  whyItems: Item[];
  paymentTitle: string;
  paymentMethods: Item[];
  ctaLabel: string;
};

const EMPTY: BookingCms = {
  heroTitle: '',
  heroSubtitle: '',
  introTitle: '',
  introBody: '',
  processTitle: '',
  processSubtitle: '',
  steps: Array.from({ length: 4 }, () => ({ title: '', body: '' })),
  whyTitle: '',
  whyItems: Array.from({ length: 4 }, () => ({ title: '', body: '' })),
  paymentTitle: '',
  paymentMethods: Array.from({ length: 3 }, () => ({ title: '', body: '' })),
  ctaLabel: '',
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

function Field({ label, value, onChange, rows = 1 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
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

function mergeCms(parsed: Partial<BookingCms>): BookingCms {
  return {
    ...EMPTY,
    ...parsed,
    steps: EMPTY.steps.map((s, i) => ({ ...s, ...(parsed.steps?.[i] ?? {}) })),
    whyItems: EMPTY.whyItems.map((s, i) => ({ ...s, ...(parsed.whyItems?.[i] ?? {}) })),
    paymentMethods: EMPTY.paymentMethods.map((s, i) => ({ ...s, ...(parsed.paymentMethods?.[i] ?? {}) })),
  };
}

export default function EditBookingProcessPage() {
  const [pageId, setPageId] = useState<number | null>(null);
  const [cms, setCms] = useState<BookingCms>(EMPTY);
  const [pageTitle, setPageTitle] = useState('How to Charter a Flight');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'saved' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    adminApi
      .getPages()
      .then((res) => {
        const data = (res as { data: Record<string, unknown>[] }).data ?? [];
        const page = data.find((p) => p.slug === 'booking-process');
        if (!page) return;
        setPageId(Number(page.id));
        setPageTitle(String(page.title ?? 'How to Charter a Flight'));
        setExcerpt(String((page as { excerpt?: string }).excerpt ?? ''));
        const body = String((page as { body?: string }).body ?? '');
        try {
          setCms(mergeCms(JSON.parse(body) as Partial<BookingCms>));
        } catch {
          setCms({ ...EMPTY, introBody: body });
        }
      })
      .catch(console.error);
  }, []);

  function set<K extends keyof BookingCms>(key: K, value: BookingCms[K]) {
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
      setMsg('Saved. Preview at /en-us/booking-process');
    } catch (e) {
      setStatus('error');
      setMsg(e instanceof Error ? e.message : 'Save failed');
    }
  }

  return (
    <AdminShell active="/dashboard/content/booking-process">
      <SectionTitle>Edit Booking Process (CMS)</SectionTitle>
      <Muted style={{ marginBottom: 12 }}>Layout cloned from jet-bay.com/booking-process — step images from local assets.</Muted>
      <p style={{ marginBottom: 20 }}>
        <Link href="/dashboard/content/pages" style={{ color: '#f1d99a', marginRight: 16 }}>
          ← All pages
        </Link>
        <a href="http://localhost:3000/en-us/booking-process" target="_blank" rel="noreferrer" style={{ color: '#f1d99a' }}>
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

      <h3 style={{ marginTop: 24, color: '#f1d99a' }}>Process steps</h3>
      <Field label="Section title" value={cms.processTitle} onChange={(v) => set('processTitle', v)} />
      <Field label="Section subtitle" value={cms.processSubtitle} onChange={(v) => set('processSubtitle', v)} />
      {cms.steps.map((step, i) => (
        <div key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 16, paddingTop: 12 }}>
          <strong style={{ color: '#f1d99a' }}>Step {i + 1}</strong>
          <Field label="Title" value={step.title} onChange={(v) => set('steps', cms.steps.map((s, j) => (j === i ? { ...s, title: v } : s)))} />
          <Field label="Body" value={step.body} onChange={(v) => set('steps', cms.steps.map((s, j) => (j === i ? { ...s, body: v } : s)))} rows={3} />
        </div>
      ))}

      <h3 style={{ marginTop: 24, color: '#f1d99a' }}>Why JetVina</h3>
      <Field label="Section title" value={cms.whyTitle} onChange={(v) => set('whyTitle', v)} />
      {cms.whyItems.map((item, i) => (
        <div key={i} style={{ marginTop: 12 }}>
          <Field label={`Item ${i + 1} title`} value={item.title} onChange={(v) => set('whyItems', cms.whyItems.map((s, j) => (j === i ? { ...s, title: v } : s)))} />
          <Field label="Body" value={item.body} onChange={(v) => set('whyItems', cms.whyItems.map((s, j) => (j === i ? { ...s, body: v } : s)))} rows={2} />
        </div>
      ))}

      <h3 style={{ marginTop: 24, color: '#f1d99a' }}>Payment</h3>
      <Field label="Section title" value={cms.paymentTitle} onChange={(v) => set('paymentTitle', v)} />
      {cms.paymentMethods.map((m, i) => (
        <div key={i} style={{ marginTop: 12 }}>
          <Field label={`Method ${i + 1}`} value={m.title} onChange={(v) => set('paymentMethods', cms.paymentMethods.map((s, j) => (j === i ? { ...s, title: v } : s)))} />
          <Field label="Description" value={m.body} onChange={(v) => set('paymentMethods', cms.paymentMethods.map((s, j) => (j === i ? { ...s, body: v } : s)))} rows={2} />
        </div>
      ))}

      <Field label="CTA button label" value={cms.ctaLabel} onChange={(v) => set('ctaLabel', v)} />

      <div style={{ marginTop: 24 }}>
        <Button onClick={save} disabled={status === 'loading' || !pageId}>
          {status === 'loading' ? 'Saving…' : 'Save & publish'}
        </Button>
        {msg && <p style={{ marginTop: 12, color: status === 'error' ? '#c44' : '#8ee4de' }}>{msg}</p>}
      </div>
    </AdminShell>
  );
}
