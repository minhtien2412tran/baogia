'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Muted } from '@jetbay/ui';
import { adminApi, clearToken, getToken } from '../lib/api';

type PermissionState = {
  ready: boolean;
  role: string | null;
  permissions: Set<string>;
  can: (permission: string) => boolean;
  refresh: () => Promise<void>;
};

const PermissionContext = createContext<PermissionState>({
  ready: false,
  role: null,
  permissions: new Set(),
  can: () => false,
  refresh: async () => undefined,
});

export function usePermissions() {
  return useContext(PermissionContext);
}

export function PermissionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Set<string>>(new Set());
  const loadedRef = useRef(false);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setReady(true);
      setRole(null);
      setPermissions(new Set());
      return;
    }
    try {
      const data = await adminApi.getMyPermissions();
      setRole(data.role);
      setPermissions(new Set(data.permissions ?? []));
    } catch {
      clearToken();
      setRole(null);
      setPermissions(new Set());
      router.replace(
        `/login?from=${encodeURIComponent(pathnameRef.current ?? '/dashboard')}`,
      );
    } finally {
      setReady(true);
    }
  }, [router]);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const can = useCallback(
    (permission: string) => role === 'ADMIN' || permissions.has(permission),
    [role, permissions],
  );

  const value = useMemo<PermissionState>(
    () => ({
      ready,
      role,
      permissions,
      can,
      refresh,
    }),
    [ready, role, permissions, can, refresh],
  );

  if (!ready) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Muted>Checking permissions…</Muted>
      </div>
    );
  }

  if (!role) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Muted>Unable to load staff permissions. Please sign in again.</Muted>
      </div>
    );
  }

  return (
    <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>
  );
}
