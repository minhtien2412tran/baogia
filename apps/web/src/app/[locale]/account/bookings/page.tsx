'use client';

import Link from 'next/link';
import { use } from 'react';
import { AccountEmpty, AccountPanel, StatusBadge } from '../../../../components/account/AccountUI';
import { useAccount } from '../../../../components/account/AccountContext';
import { navHref } from '../../../../config/navigation';
import { t } from '../../../../lib/i18n';

export default function AccountBookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: loc } = use(params);
  const locale = loc ?? 'en-us';
  const { data } = useAccount();

  if (!data) return null;

  return (
    <>
      <header className="jb-account-hero jb-account-hero--dashboard">
        <div>
          <span className="jb-account-kicker">JetVina trip desk</span>
          <h1>Manage your trips</h1>
          <p>Review itineraries, passengers, documents and payment status in one place.</p>
        </div>
        <Link href={navHref(locale, '/')} className="jb-btn-primary">
          {t(locale, 'searchFlights')}
        </Link>
      </header>

      <AccountPanel title="Your bookings" subtitle={`${data.bookings.length} total bookings`}>
        {data.bookings.length === 0 ? (
          <AccountEmpty
            title={t(locale, 'noBookingsTitle')}
            hint={t(locale, 'noBookingsHint')}
            action={
              <Link href={navHref(locale, '/')} className="jb-btn-primary">
                {t(locale, 'searchFlights')}
              </Link>
            }
          />
        ) : (
          <div className="jb-trip-dashboard-list">
            {data.bookings.map((booking) => {
              const leg = booking.itinerary?.legs?.[0];
              return (
                <article key={booking.id} className="jb-trip-card">
                  <div className="jb-trip-card__route">
                    <span className="jb-account-kicker">Booking #{booking.id}</span>
                    <strong>{leg ? `${leg.fromAirport} → ${leg.toAirport}` : 'Managed itinerary'}</strong>
                    {leg?.departureAt && (
                      <time dateTime={leg.departureAt}>
                        {new Date(leg.departureAt).toLocaleString(locale)}
                      </time>
                    )}
                  </div>
                  <div className="jb-trip-card__meta">
                    <StatusBadge status={booking.status} />
                    <span>{booking.bookingType ?? 'CHARTER'}</span>
                    {booking.paymentStatus && <span>Payment: {booking.paymentStatus}</span>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </AccountPanel>
    </>
  );
}
