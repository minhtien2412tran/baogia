'use client';

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Muted } from '@jetbay/ui';
import { getToken } from '../lib/api';

function subscribe() {
  return () => undefined;
}
function getClientToken() {
  return Boolean(getToken());
}
function getServerToken() {
  return false;
}

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hasToken = useSyncExternalStore(subscribe, getClientToken, getServerToken);

  useEffect(() => {
    if (!hasToken) {
      router.replace(`/login?from=${encodeURIComponent(pathname ?? '/dashboard')}`);
    }
  }, [hasToken, router, pathname]);

  if (!hasToken) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Muted>Checking authentication…</Muted>
      </div>
    );
  }

  return <>{children}</>;
}
