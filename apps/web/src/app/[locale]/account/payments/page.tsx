'use client';

import { use } from 'react';
import { useAccount } from '../../../../components/account/AccountContext';
import { AccountEmpty, AccountPanel, StatusBadge } from '../../../../components/account/AccountUI';
import { t } from '../../../../lib/i18n';

function PaymentsContent({ locale }: { locale: string }) {
  const { data } = useAccount();
  if (!data) return null;

  return (
    <>
      <header className="jb-account-hero">
        <h1>{t(locale, 'payments')}</h1>
        <p>{data.payments.length} transactions</p>
      </header>
      <AccountPanel title="Payment History" subtitle={t(locale, 'paymentGatewaysNote')}>
        {data.payments.length === 0 ? (
          <AccountEmpty title={t(locale, 'noPaymentsTitle')} hint={t(locale, 'noPaymentsHint')} />
        ) : (
          <div className="jb-account-table-wrap">
            <table className="jb-account-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Booking</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map((p) => (
                  <tr key={p.id}>
                    <td>{p.createdAt.slice(0, 10)}</td>
                    <td>#{p.bookingId}</td>
                    <td>{p.method}</td>
                    <td>
                      {p.currency} {p.amount.toLocaleString()}
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AccountPanel>
    </>
  );
}

export default function AccountPaymentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: loc } = use(params);
  const locale = loc ?? 'en-us';
  return <PaymentsContent locale={locale} />;
}
