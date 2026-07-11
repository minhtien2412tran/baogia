'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAccount } from '../../../../components/account/AccountContext';
import { AccountEmpty, AccountPanel } from '../../../../components/account/AccountUI';
import { t } from '../../../../lib/i18n';

function JetCardContent({ locale }: { locale: string }) {
  const { data } = useAccount();
  if (!data) return null;

  return (
    <>
      <header className="jb-account-hero">
        <h1>{t(locale, 'jetCard')}</h1>
        <p>{data.stats.jetCardHours} hours across {data.jetCards.length} account(s)</p>
      </header>
      <AccountPanel title="Jet Card Balance">
        {data.jetCards.length === 0 ? (
          <AccountEmpty
            title="No active Jet Card membership"
            action={
              <Link href={`/${locale}/jet-card`} className="jb-btn-primary">
                Explore plans
              </Link>
            }
          />
        ) : (
          <div className="jb-account-doc-grid">
            {data.jetCards.map((a) => (
              <article key={a.accountId} className="jb-account-doc-card jb-account-doc-card--gold">
                <div>
                  <h3>{a.planName}</h3>
                  <p className="jb-account-stat__value" style={{ fontSize: 32, margin: '8px 0' }}>
                    {a.remainingHours}h
                  </p>
                  <p className="jb-account-meta">Expires {a.expiryDate.slice(0, 10)}</p>
                </div>
                {a.recentTransactions.length > 0 && (
                  <ul className="jb-account-list" style={{ marginTop: 12 }}>
                    {a.recentTransactions.map((tx, i) => (
                      <li key={i} className="jb-account-meta">
                        {tx.date}: {tx.txnType} {tx.hoursDelta > 0 ? '+' : ''}
                        {tx.hoursDelta}h
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        )}
      </AccountPanel>
    </>
  );
}

export default function AccountJetCardPage() {
  const params = useParams();
  const locale = (params.locale as string | undefined) ?? 'en-us';
  return <JetCardContent locale={locale} />;
}
