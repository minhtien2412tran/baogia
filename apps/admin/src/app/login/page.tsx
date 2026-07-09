'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Muted, colors } from '@jetbay/ui';
import { adminApi, setToken } from '../../lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@jetbay.local');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        throw new Error('Admin access required. Use admin@jetbay.local');
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
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <h1 style={{ color: colors.accent, marginTop: 0 }}>JetBay Admin</h1>
        <Muted style={{ marginBottom: 24, display: 'block' }}>Sign in with an admin account</Muted>
        <form onSubmit={onSubmit}>
          <Input label="Email" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
          <Button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
        </form>
        {error && <p style={{ color: colors.error, marginTop: 12 }}>{error}</p>}
        <Muted style={{ marginTop: 16, display: 'block', fontSize: 13 }}>
          Dev: admin@jetbay.local / Admin123!
        </Muted>
      </div>
    </main>
  );
}
