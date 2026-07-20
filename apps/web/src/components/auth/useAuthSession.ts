'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import {
  AUTH_CHANGED_EVENT,
  clearAuthSession,
  getAuthToken,
} from '../../lib/auth-session';
import { scheduleUi } from '../../lib/browser';

export type AuthUser = {
  publicId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  accountType?: string;
};

export function useAuthSession() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setLoggedIn(false);
      setUser(null);
      setLoading(false);
      return;
    }
    setLoggedIn(true);
    try {
      const me = await api.getMe(token);
      setUser({
        publicId: me.publicId,
        email: me.email,
        firstName: me.firstName ?? undefined,
        lastName: me.lastName ?? undefined,
        avatarUrl: me.avatarUrl ?? undefined,
        accountType: me.accountType ?? undefined,
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    scheduleUi(() => {
      void refresh();
    });
    const onChange = () => void refresh();
    window.addEventListener(AUTH_CHANGED_EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, [refresh]);

  return { loggedIn, user, loading, refresh };
}

export function useLogout(locale: string) {
  const router = useRouter();

  return async function logout() {
    const refreshToken = localStorage.getItem('jetbay_refresh_token');
    await clearAuthSession(async () => {
      if (refreshToken) await api.logout(refreshToken);
    });
    router.push(`/${locale}`);
  };
}

export function userDisplayName(user: AuthUser | null): string {
  if (!user) return '';
  if (user.firstName || user.lastName) {
    return [user.firstName, user.lastName].filter(Boolean).join(' ');
  }
  return user.email.split('@')[0] ?? user.email;
}

export function userInitials(user: AuthUser | null): string {
  const name = userDisplayName(user);
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}
