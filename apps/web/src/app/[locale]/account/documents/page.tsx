'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../../lib/api';
import { AccountShell, useAccountAuth } from '../../../../components/account/AccountShell';

type DocRow = {
  id: number;
  documentType: string;
  status: string;
  fileUrl?: string;
  htmlUrl?: string;
  bookingId?: number;
};

export default function AccountDocumentsPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale ?? 'en-us';
  const { requireToken } = useAccountAuth(locale);
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = requireToken();
    if (!token) return;
    api
      .getMyBookings(token)
      .then((bookings) => {
        const rows: DocRow[] = [];
        for (const b of bookings as { id: number; documents?: DocRow[] }[]) {
          for (const d of b.documents ?? []) {
            rows.push({ ...d, bookingId: b.id });
          }
        }
        setDocs(rows);
      })
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
  }, [locale, requireToken]);

  return (
    <AccountShell locale={locale}>
      <div className="jb-account-card">
        <h2>Charter Documents</h2>
        {loading ? (
          <p className="jb-account-meta">Loading…</p>
        ) : docs.length === 0 ? (
          <p className="jb-account-meta">No documents yet. Documents appear when you have an active booking.</p>
        ) : (
          <ul className="jb-bullet-list">
            {docs.map((d) => (
              <li key={d.id} style={{ marginBottom: 12 }}>
                <strong>{d.documentType.replace(/_/g, ' ')}</strong> — Booking #{d.bookingId} · {d.status}
                <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {d.fileUrl && (
                    <a href={d.fileUrl} className="jb-btn-ghost" target="_blank" rel="noreferrer">
                      Download PDF
                    </a>
                  )}
                  {d.htmlUrl && (
                    <a href={d.htmlUrl} className="jb-btn-ghost" target="_blank" rel="noreferrer">
                      View HTML
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AccountShell>
  );
}
