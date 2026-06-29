'use client';

import { useEffect, useState } from 'react';
import { Muted, colors } from '@j-ta/ui';
import { api } from '../../../lib/api';

export default function AccountPage({ params }: { params: { locale: string } }) {
  const locale = params?.locale ?? 'en';
  const [bookings, setBookings] = useState<unknown[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('jta_token');
    if (!token) {
      window.location.href = `/${locale}/login`;
      return;
    }
    api.getMyBookings(token).then(setBookings).catch(() => setBookings([]));
  }, [locale]);

  return (
    <main className="jb-subpage">
      <div className="jb-container jb-sub-body">
        <h1 style={{ color: colors.accent, marginBottom: 24 }}>My Account</h1>
        <div className="jb-content-block">
          <h2>My Bookings</h2>
          {bookings.length === 0 ? (
            <Muted>No bookings yet.</Muted>
          ) : (
            <ul className="jb-bullet-list">
              {(bookings as Record<string, unknown>[]).map((b, i) => (
                <li key={i}>Booking #{String(b.id)} — {String(b.status ?? b.bookingStatus)}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
