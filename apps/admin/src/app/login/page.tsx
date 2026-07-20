'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@jetbay/ui';
import { adminApi, getApiBaseUrl, setToken } from '../../lib/api';
import { PLATFORM } from '../../lib/platform';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
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
      if (!['ADMIN', 'SALES', 'CONTRACT_APPROVER'].includes(res.user?.role ?? '')) {
        throw new Error('Staff access required. Use an approved staff account.');
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
            JV
          </div>
          <h1 className="jb-login__title">JetVina Admin</h1>
        </div>
        <p className="jb-login__subtitle">Bảng quản trị chung — quotes, bookings, content, fleet.</p>

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
        <div className="jb-login__api" style={{ display: 'grid', gap: 4, fontSize: 12, opacity: 0.85 }}>
          <span>API · {apiBase}</span>
          <a href={PLATFORM.docs} target="_blank" rel="noreferrer">
            Swagger · docs.minhtien.online
          </a>
          <a href={PLATFORM.web} target="_blank" rel="noreferrer">
            Web prod · www.minhtien.online
          </a>
          <a href={PLATFORM.localWeb} target="_blank" rel="noreferrer">
            Web local · localhost:3000
          </a>
        </div>
      </div>
    </main>
  );
}
