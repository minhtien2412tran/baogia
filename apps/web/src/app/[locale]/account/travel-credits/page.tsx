'use client';

import { use } from 'react';
import Link from 'next/link';
import { useAccount } from '../../../../components/account/AccountContext';
import { AccountEmpty, AccountPanel } from '../../../../components/account/AccountUI';
import { t } from '../../../../lib/i18n';

function TravelCreditsContent({ locale }: { locale: string }) {
  const { data } = useAccount();
  if (!data) return null;
  const balance = data.travelCredits;

  return (
    <>
      <header className="jb-account-hero">
        <h1>{t(locale, 'travelCredits')}</h1>
        <p>Prepaid credits for flexible charter booking</p>
      </header>
      <AccountPanel title="Credit Balance">
        <div className="jb-account-credit-hero">
          <span className="jb-account-credit-hero__value" data-account-count={balance.credits}>
            {balance.credits.toLocaleString()}
          </span>
          <span className="jb-account-credit-hero__currency">{balance.currency}</span>
        </div>
        {balance.expirySummary.length === 0 ? (
          <AccountEmpty
            title="No credits on account"
            action={
              <Link href={`/${locale}/travel-credit`} className="jb-btn-primary">
                Buy credits
              </Link>
            }
          />
        ) : (
          <ul className="jb-account-list" style={{ marginTop: 24 }}>
            {balance.expirySummary.map((b, i) => (
              <li key={i} className="jb-account-list-item">
                <span>{b.amount.toLocaleString()} credits</span>
                <span className="jb-account-meta">expires {b.expiresAt.slice(0, 10)}</span>
              </li>
            ))}
          </ul>
        )}
      </AccountPanel>
    </>
  );
}

export default function AccountTravelCreditsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: loc } = use(params);
  const locale = loc ?? 'en-us';
  return <TravelCreditsContent locale={locale} />;
}
