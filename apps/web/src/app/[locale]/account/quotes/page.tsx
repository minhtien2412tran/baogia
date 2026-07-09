'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../../lib/api';
import { AccountShell, useAccountAuth } from '../../../../components/account/AccountShell';

type Quote = {
  id: number;
  status: string;
  tripType: string;
  createdAt: string;
  legs: { from: string; to: string; departure: string; passengers: number }[];
};

export default function AccountQuotesPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale ?? 'en-us';
  const { requireToken } = useAccountAuth(locale);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = requireToken();
    if (!token) return;
    api
      .getMyQuotes(token)
      .then(setQuotes)
      .catch(() => setQuotes([]))
      .finally(() => setLoading(false));
  }, [locale, requireToken]);

  return (
    <AccountShell locale={locale}>
      <div className="jb-account-card">
        <h2>My Quote Requests</h2>
        {loading ? (
          <p className="jb-account-meta">Loading…</p>
        ) : quotes.length === 0 ? (
          <p className="jb-account-meta">No quote requests yet.</p>
        ) : (
          <ul className="jb-bullet-list">
            {quotes.map((q) => (
              <li key={q.id} style={{ marginBottom: 12 }}>
                <strong>#{q.id}</strong> — {q.status} · {q.tripType}
                <br />
                <span className="jb-account-meta">
                  {q.legs.map((l) => `${l.from}→${l.to} (${l.departure}, ${l.passengers} pax)`).join(' · ')}
                </span>
                <br />
                <span className="jb-account-meta">Submitted {q.createdAt.slice(0, 10)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AccountShell>
  );
}
