'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../../lib/api';
import { AccountShell, useAccountAuth } from '../../../../components/account/AccountShell';

type CreditBalance = {
  credits: number;
  currency: string;
  expirySummary: { amount: number; expiresAt: string }[];
};

export default function AccountTravelCreditsPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale ?? 'en-us';
  const { requireToken } = useAccountAuth(locale);
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = requireToken();
    if (!token) return;
    api
      .getTravelCreditBalance(token)
      .then(setBalance)
      .catch(() => setBalance(null))
      .finally(() => setLoading(false));
  }, [locale, requireToken]);

  return (
    <AccountShell locale={locale}>
      <div className="jb-account-card">
        <h2>Travel Credits</h2>
        {loading ? (
          <p className="jb-account-meta">Loading…</p>
        ) : !balance ? (
          <p className="jb-account-meta">Unable to load balance.</p>
        ) : (
          <>
            <p style={{ fontSize: 28, fontWeight: 600, color: '#c9a84c' }}>
              {balance.credits.toLocaleString()} {balance.currency}
            </p>
            {balance.expirySummary.length > 0 ? (
              <>
                <p className="jb-account-meta" style={{ marginTop: 16 }}>Credit buckets:</p>
                <ul className="jb-bullet-list">
                  {balance.expirySummary.map((b, i) => (
                    <li key={i}>
                      {b.amount.toLocaleString()} credits — expires {b.expiresAt.slice(0, 10)}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="jb-account-meta">No credits on account. <a href={`/${locale}/travel-credit`}>Buy credits</a></p>
            )}
          </>
        )}
      </div>
    </AccountShell>
  );
}
