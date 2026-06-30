'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

type UserProfile = {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  accountType?: string;
};

export default function AccountPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale ?? 'en';
  const [bookings, setBookings] = useState<unknown[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jta_token');
    if (!token) {
      window.location.href = `/${locale}/login`;
      return;
    }
    api.getMe(token).then(setUser).catch(() => setUser(null));
    api.getMyBookings(token).then(setBookings).catch(() => setBookings([]));
  }, [locale]);

  const displayName =
    user?.firstName || user?.lastName
      ? [user.firstName, user.lastName].filter(Boolean).join(' ')
      : user?.email;

  return (
    <main className="jb-subpage">
      <div className="jb-container jb-sub-body">
        <h1 className="jb-auth-title">My Account</h1>
        {user && (
          <div className="jb-account-card">
            <h2>Profile</h2>
            <p>{displayName}</p>
            <p className="jb-account-meta">{user.email}</p>
            {user.accountType && (
              <p className="jb-account-meta">Account type: {user.accountType}</p>
            )}
          </div>
        )}
        <div className="jb-account-card">
          <h2>My Bookings</h2>
          {bookings.length === 0 ? (
            <p className="jb-account-meta">No bookings yet.</p>
          ) : (
            <ul className="jb-bullet-list">
              {(bookings as Record<string, unknown>[]).map((b, i) => (
                <li key={i}>
                  Booking #{String(b.id)} — {String(b.status ?? b.bookingStatus)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
