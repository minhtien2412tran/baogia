'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '../../lib/api';
import type { AccountDashboard } from '../../lib/account-types';
import { useLogout, userDisplayName, userInitials, type AuthUser } from '../auth/useAuthSession';
import { scheduleUi } from '../../lib/browser';

type AccountContextValue = {
  locale: string;
  token: string | null;
  data: AccountDashboard | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  user: AuthUser | null;
  displayName: string;
  initials: string;
  logout: () => Promise<void>;
};

const AccountContext = createContext<AccountContextValue | null>(null);

function formatAccountError(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.status === 401 || e.status === 403) {
      return 'SESSION_EXPIRED';
    }
    if (e.status === 429) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    try {
      const parsed = JSON.parse(e.message) as { message?: string };
      if (parsed.message) {
        return parsed.message.replace(/^ThrottlerException:\s*/i, '');
      }
    } catch {
      /* plain text body */
    }
    return e.message;
  }
  return e instanceof Error ? e.message : 'Failed to load account';
}

export function AccountProvider({ locale, children }: { locale: string; children: ReactNode }) {
  const router = useRouter();
  const logoutAction = useLogout(locale);
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<AccountDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const t = localStorage.getItem('jetbay_token');
    if (!t) {
      router.push(`/${locale}/login`);
      return;
    }
    setToken(t);
    setLoading(true);
    setError(null);
    try {
      const dash = await api.getAccountDashboard(t);
      setData(dash);
    } catch (e) {
      const msg = formatAccountError(e);
      if (msg === 'SESSION_EXPIRED') {
        localStorage.removeItem('jetbay_token');
        localStorage.removeItem('jetbay_refresh_token');
        router.push(`/${locale}/login`);
        return;
      }
      setError(msg);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [locale, router]);

  useEffect(() => {
    scheduleUi(() => {
      void refresh();
    });
  }, [refresh]);

  const user = useMemo<AuthUser | null>(() => {
    if (!data?.profile) return null;
    const p = data.profile;
    return {
      id: p.id,
      email: p.email,
      firstName: p.firstName ?? undefined,
      lastName: p.lastName ?? undefined,
      avatarUrl: p.avatarUrl ?? undefined,
      accountType: p.accountType ?? undefined,
    };
  }, [data?.profile]);

  const value = useMemo(
    () => ({
      locale,
      token,
      data,
      loading,
      error,
      refresh,
      user,
      displayName: userDisplayName(user),
      initials: userInitials(user),
      logout: logoutAction,
    }),
    [locale, token, data, loading, error, refresh, user, logoutAction],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used within AccountProvider');
  return ctx;
}
