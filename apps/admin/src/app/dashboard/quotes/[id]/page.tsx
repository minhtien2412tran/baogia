'use client';

import { useEffect, useState } from 'react';
import { Card, SectionTitle, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../../components/AdminShell';
import { adminApi } from '../../../../lib/api';

export default function QuoteDetailPage({ params }: { params: { id: string } }) {
  const [quote, setQuote] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    void adminApi
      .getQuote(Number(params.id))
      .then(setQuote)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load quote'));
  }, [params.id]);

  return (
    <AdminShell active="/dashboard/quotes">
      <SectionTitle>Quote #{params.id}</SectionTitle>
      {error ? <p style={{ color: '#fca5a5' }}>{error}</p> : null}
      {!quote && !error ? (
        <Muted>Loading quote…</Muted>
      ) : quote ? (
        <Card>
          <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
            {JSON.stringify(quote, null, 2)}
          </pre>
        </Card>
      ) : null}
    </AdminShell>
  );
}
