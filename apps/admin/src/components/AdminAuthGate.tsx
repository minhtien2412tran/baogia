'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Muted } from '@jetbay/ui';
import { getToken } from '../lib/api';
import { PermissionProvider } from './PermissionContext';

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHasToken(Boolean(getToken()));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasToken === false) {
      router.replace(`/login?from=${encodeURIComponent(pathname ?? '/dashboard')}`);
    }
  }, [hasToken, router, pathname]);

  if (hasToken !== true) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Muted>Checking authentication…</Muted>
      </div>
    );
  }

  return <PermissionProvider>{children}</PermissionProvider>;
}
