'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../../lib/api';
import { AccountShell, useAccountAuth } from '../../../../components/account/AccountShell';

type Payment = {
  id: number;
  bookingId: number;
  method: string;
  amount: number;
  currency: string;
  status: string;
  transactionRef?: string;
  createdAt: string;
};

export default function AccountPaymentsPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale ?? 'en-us';
  const { requireToken } = useAccountAuth(locale);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = requireToken();
    if (!token) return;
    api
      .getMyPayments(token)
      .then(setPayments)
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, [locale, requireToken]);

  return (
    <AccountShell locale={locale}>
      <div className="jb-account-card">
        <h2>Payment History</h2>
        {loading ? (
          <p className="jb-account-meta">Loading…</p>
        ) : payments.length === 0 ? (
          <p className="jb-account-meta">No payments yet.</p>
        ) : (
          <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th align="left">Date</th>
                <th align="left">Booking</th>
                <th align="left">Method</th>
                <th align="right">Amount</th>
                <th align="left">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{p.createdAt.slice(0, 10)}</td>
                  <td>#{p.bookingId}</td>
                  <td>{p.method}</td>
                  <td align="right">
                    {p.currency} {p.amount.toLocaleString()}
                  </td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AccountShell>
  );
}
