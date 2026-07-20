'use client';

import { useEffect, useState } from 'react';
import { Card, SectionTitle, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../../components/AdminShell';
import { adminApi } from '../../../../lib/api';

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    void adminApi
      .getBooking(Number(params.id))
      .then(setBooking)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load booking'));
  }, [params.id]);

  return (
    <AdminShell active="/dashboard/bookings">
      <SectionTitle>Booking #{params.id}</SectionTitle>
      {error ? <p style={{ color: '#fca5a5' }}>{error}</p> : null}
      {!booking && !error ? (
        <Muted>Loading booking…</Muted>
      ) : booking ? (
        <Card>
          <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
            {JSON.stringify(booking, null, 2)}
          </pre>
        </Card>
      ) : null}
    </AdminShell>
  );
}
