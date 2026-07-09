'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Muted } from '@jetbay/ui';
import { getToken } from '../lib/api';

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace(`/login?from=${encodeURIComponent(pathname ?? '/dashboard')}`);
      return;
    }
    setReady(true);
  }, [router, pathname]);

  if (!ready) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Muted>Checking authentication…</Muted>
      </div>
    );
  }

  return <>{children}</>;
}
