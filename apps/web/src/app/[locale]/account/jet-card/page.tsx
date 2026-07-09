'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../../lib/api';
import { AccountShell, useAccountAuth } from '../../../../components/account/AccountShell';

type JetCardAccount = {
  accountId: number;
  planName: string;
  remainingHours: number;
  expiryDate: string;
  purchasedAt: string;
  recentTransactions: { txnType: string; hoursDelta: number; date: string }[];
};

export default function AccountJetCardPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale ?? 'en-us';
  const { requireToken } = useAccountAuth(locale);
  const [accounts, setAccounts] = useState<JetCardAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = requireToken();
    if (!token) return;
    api
      .getMyJetCardAccounts(token)
      .then(setAccounts)
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false));
  }, [locale, requireToken]);

  return (
    <AccountShell locale={locale}>
      <div className="jb-account-card">
        <h2>Jet Card Balance</h2>
        {loading ? (
          <p className="jb-account-meta">Loading…</p>
        ) : accounts.length === 0 ? (
          <p className="jb-account-meta">No active Jet Card membership. <a href={`/${locale}/jet-card`}>Explore plans</a></p>
        ) : (
          accounts.map((a) => (
            <div key={a.accountId} style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <p><strong>{a.planName}</strong></p>
              <p>{a.remainingHours} hours remaining</p>
              <p className="jb-account-meta">Expires {a.expiryDate.slice(0, 10)}</p>
              {a.recentTransactions.length > 0 && (
                <>
                  <p className="jb-account-meta" style={{ marginTop: 8 }}>Recent activity:</p>
                  <ul className="jb-bullet-list">
                    {a.recentTransactions.map((t, i) => (
                      <li key={i}>{t.date}: {t.txnType} {t.hoursDelta > 0 ? '+' : ''}{t.hoursDelta}h</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </AccountShell>
  );
}
