'use client';

import Link from 'next/link';
import { useAccount } from '../../../../components/account/AccountContext';
import { AccountEmpty, AccountPanel, StatusBadge } from '../../../../components/account/AccountUI';
import { t } from '../../../../lib/i18n';

function QuotesContent({ locale }: { locale: string }) {
  const { data } = useAccount();
  if (!data) return null;

  return (
    <>
      <header className="jb-account-hero">
        <h1>{t(locale, 'myQuotes')}</h1>
        <p>{data.quotes.length} quote requests on your account</p>
      </header>
      <AccountPanel title="All Quote Requests">
        {data.quotes.length === 0 ? (
          <AccountEmpty title="No quote requests yet" hint="Use the search widget to request a charter quote." />
        ) : (
          <ul className="jb-account-list">
            {data.quotes.map((q) => (
              <li key={q.id} className="jb-account-list-item jb-account-list-item--stack">
                <div className="jb-account-list-item__row">
                  <div>
                    <strong>Quote #{q.id}</strong> · {q.tripType}
                    <div className="jb-account-meta">Submitted {q.createdAt.slice(0, 10)}</div>
                  </div>
                  <StatusBadge status={q.status} />
                </div>
                <div className="jb-account-meta">
                  {q.legs.map((l) => `${l.from}→${l.to} (${l.departure}, ${l.passengers} pax)`).join(' · ')}
                </div>
              </li>
            ))}
          </ul>
        )}
      </AccountPanel>
    </>
  );
}

export default function AccountQuotesPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale ?? 'en-us';
  return <QuotesContent locale={locale} />;
}
