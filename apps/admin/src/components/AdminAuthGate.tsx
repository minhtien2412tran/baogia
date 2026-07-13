'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Muted } from '@jetbay/ui';
import { getToken } from '../lib/api';

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(Boolean(getToken()));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!hasToken) {
      router.replace(`/login?from=${encodeURIComponent(pathname ?? '/dashboard')}`);
    }
  }, [ready, hasToken, router, pathname]);

  if (!ready || !hasToken) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Muted>Checking authentication…</Muted>
      </div>
    );
  }

  return <>{children}</>;
}
