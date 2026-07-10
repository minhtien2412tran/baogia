'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@jetbay/ui';
import { adminApi, getApiBaseUrl, setToken } from '../../lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@jetbay.local');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const apiBase = useMemo(() => getApiBaseUrl(), []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.login(email, password);
      if (!res.tokens?.accessToken) {
        throw new Error(res.message ?? 'Login failed');
      }
      if (res.user?.role !== 'ADMIN') {
        throw new Error('Admin access required. Use an ADMIN account.');
      }
      setToken(res.tokens.accessToken);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="jb-login">
      <div className="jb-login__orb jb-login__orb--a" aria-hidden />
      <div className="jb-login__orb jb-login__orb--b" aria-hidden />

      <div className="jb-login__card">
        <div className="jb-login__brand">
          <div className="jb-login__mark" aria-hidden>
            JB
          </div>
          <h1 className="jb-login__title">JetBay Admin</h1>
        </div>
        <p className="jb-login__subtitle">Sign in to manage quotes, bookings, and content.</p>

        <form className="jb-login__form" onSubmit={onSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        {error && <div className="jb-login__error">{error}</div>}

        {process.env.NODE_ENV !== 'production' && (
          <p className="jb-login__hint">Dev: admin@jetbay.local / Admin123!</p>
        )}
        <p className="jb-login__api">API · {apiBase}</p>
      </div>
    </main>
  );
}
