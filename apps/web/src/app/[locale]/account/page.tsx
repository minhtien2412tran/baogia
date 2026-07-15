'use client';

import Link from 'next/link';
import { use } from 'react';
import { api } from '../../../lib/api';
import { useAccount } from '../../../components/account/AccountContext';
import {
  AccountEmpty,
  AccountPanel,
  AccountStatGrid,
  StatusBadge,
} from '../../../components/account/AccountUI';
import { t } from '../../../lib/i18n';
import { navHref } from '../../../config/navigation';
import { navigateExternal } from '../../../lib/browser';

function OverviewContent({ locale }: { locale: string }) {
  const { data, token } = useAccount();
  if (!data) return null;

  async function payBooking(bookingId: number, gateway: 'onepay' | '9pay') {
    if (!token) return;
    const returnUrl = `${window.location.origin}/${locale}/account`;
    const res = await api.createGatewayPayment(token, { bookingId, gateway, returnUrl });
    navigateExternal(res.redirectUrl);
  }

  return (
    <>
      <header className="jb-account-hero">
        <h1>{t(locale, 'myAccount')}</h1>
        <p>Welcome back, {data.profile.firstName || data.profile.email}</p>
      </header>

      <AccountStatGrid stats={data.stats} />

      <div className="jb-account-grid-2">
        <AccountPanel title="Recent Quotes" subtitle={`${data.quotes.length} total requests`}>
          {data.quotes.length === 0 ? (
            <AccountEmpty
              title={t(locale, 'noQuotesTitle')}
              hint={t(locale, 'noQuotesHint')}
              action={
                <Link href={navHref(locale, '/')} className="jb-btn-primary">
                  {t(locale, 'searchFlights')}
                </Link>
              }
            />
          ) : (
            <ul className="jb-account-list">
              {data.quotes.slice(0, 5).map((q) => (
                <li key={q.id} className="jb-account-list-item">
                  <div>
                    <strong>#{q.id}</strong> · {q.tripType}
                    <div className="jb-account-meta">
                      {q.legs.map((l) => `${l.from}→${l.to}`).join(' · ')}
                    </div>
                  </div>
                  <StatusBadge status={q.status} />
                </li>
              ))}
            </ul>
          )}
        </AccountPanel>

        <AccountPanel title="Active Bookings" subtitle={`${data.bookings.length} bookings`}>
          {data.bookings.length === 0 ? (
            <AccountEmpty title={t(locale, 'noBookingsTitle')} hint={t(locale, 'noBookingsHint')} />
          ) : (
            <ul className="jb-account-list">
              {data.bookings.slice(0, 5).map((b) => {
                const leg = b.itinerary?.legs?.[0];
                const canPay = ['pending', 'confirmed'].includes(String(b.status).toLowerCase());
                return (
                  <li key={b.id} className="jb-account-list-item jb-account-list-item--stack">
                    <div className="jb-account-list-item__row">
                      <div>
                        <strong>Booking #{b.id}</strong>
                        {leg && (
                          <div className="jb-account-meta">
                            {leg.fromAirport} → {leg.toAirport}
                          </div>
                        )}
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                    {canPay && (
                      <div className="jb-account-actions">
                        <button type="button" className="jb-btn-ghost" onClick={() => payBooking(b.id, 'onepay')}>
                          OnePay
                        </button>
                        <button type="button" className="jb-btn-ghost" onClick={() => payBooking(b.id, '9pay')}>
                          9Pay
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </AccountPanel>
      </div>

      {(data.jetCards.length > 0 || data.travelCredits.credits > 0) && (
        <AccountPanel title="Membership & Credits">
          <div className="jb-account-membership-row">
            {data.jetCards.map((c) => (
              <div key={c.accountId} className="jb-account-mini-card">
                <span className="jb-account-mini-card__label">{c.planName}</span>
                <strong>{c.remainingHours}h</strong>
              </div>
            ))}
            {data.travelCredits.credits > 0 && (
              <div className="jb-account-mini-card">
                <span className="jb-account-mini-card__label">{t(locale, 'travelCredits')}</span>
                <strong>
                  {data.travelCredits.credits.toLocaleString()} {data.travelCredits.currency}
                </strong>
              </div>
            )}
          </div>
        </AccountPanel>
      )}
    </>
  );
}

export default function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: loc } = use(params);
  const locale = loc ?? 'en-us';
  return <OverviewContent locale={locale} />;
}
