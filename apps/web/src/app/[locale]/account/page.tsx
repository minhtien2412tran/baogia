'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { AccountShell, useAccountAuth } from '../../../components/account/AccountShell';

type UserProfile = {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  accountType?: string;
};

type Booking = {
  id: number;
  status?: string;
  bookingStatus?: string;
};

export default function AccountPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale ?? 'en-us';
  const { requireToken } = useAccountAuth(locale);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [payMsg, setPayMsg] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<number | null>(null);

  useEffect(() => {
    const token = requireToken();
    if (!token) return;
    api.getMe(token).then(setUser).catch(() => setUser(null));
    api.getMyBookings(token).then((b) => setBookings(b as Booking[])).catch(() => setBookings([]));
  }, [locale, requireToken]);

  async function payBooking(bookingId: number, gateway: 'onepay' | '9pay') {
    const token = requireToken();
    if (!token) return;
    setPayingId(bookingId);
    setPayMsg(null);
    try {
      const returnUrl = `${window.location.origin}/${locale}/account`;
      const res = await api.createGatewayPayment(token, { bookingId, gateway, returnUrl });
      window.location.href = res.redirectUrl;
    } catch (e) {
      setPayMsg(e instanceof Error ? e.message : 'Payment could not be started');
      setPayingId(null);
    }
  }

  const displayName =
    user?.firstName || user?.lastName
      ? [user.firstName, user.lastName].filter(Boolean).join(' ')
      : user?.email;

  return (
    <AccountShell locale={locale}>
      {user && (
        <div className="jb-account-card">
          <h2>Profile</h2>
          <p>{displayName}</p>
          <p className="jb-account-meta">{user.email}</p>
          {user.accountType && <p className="jb-account-meta">Account type: {user.accountType}</p>}
        </div>
      )}
      <div className="jb-account-card">
        <h2>My Bookings</h2>
        {payMsg && <p className="jb-auth-error">{payMsg}</p>}
        {bookings.length === 0 ? (
          <p className="jb-account-meta">No bookings yet.</p>
        ) : (
          <ul className="jb-bullet-list">
            {bookings.map((b) => {
              const status = String(b.status ?? b.bookingStatus ?? 'pending');
              const canPay = ['pending', 'confirmed', 'PENDING', 'CONFIRMED'].includes(status);
              return (
                <li key={b.id} style={{ marginBottom: 12 }}>
                  Booking #{b.id} — {status}
                  {canPay && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="jb-btn-ghost"
                        disabled={payingId === b.id}
                        onClick={() => payBooking(b.id, 'onepay')}
                      >
                        Pay with OnePay
                      </button>
                      <button
                        type="button"
                        className="jb-btn-ghost"
                        disabled={payingId === b.id}
                        onClick={() => payBooking(b.id, '9pay')}
                      >
                        Pay with 9Pay
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AccountShell>
  );
}
