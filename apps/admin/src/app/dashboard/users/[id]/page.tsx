'use client';

import { useEffect, useState } from 'react';
import { Card, SectionTitle, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../../components/AdminShell';
import { adminApi } from '../../../../lib/api';

export default function Customer360Page({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    void adminApi
      .getCustomer360(Number(params.id))
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load customer'));
  }, [params.id]);

  return (
    <AdminShell active="/dashboard/users">
      <SectionTitle>Customer 360 #{params.id}</SectionTitle>
      {error ? <p style={{ color: '#fca5a5' }}>{error}</p> : null}
      {!data && !error ? (
        <Muted>Loading customer…</Muted>
      ) : data ? (
        <Card>
          <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </Card>
      ) : null}
    </AdminShell>
  );
}
