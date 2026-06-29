'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Muted, colors } from '@j-ta/ui';
import { api } from '../../../lib/api';

export default function LoginPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const locale = params?.locale ?? 'en';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(email, password);
      localStorage.setItem('jta_token', res.tokens.accessToken);
      localStorage.setItem('jta_user_id', String(res.user.id));
      router.push(`/${locale}/account`);
    } catch {
      setError('Login failed. Try demo@j-ta.local with any password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="jb-subpage">
      <div className="jb-container" style={{ maxWidth: 440, padding: '48px 24px' }}>
        <h1 style={{ color: colors.accent, marginTop: 0 }}>Login</h1>
        <form onSubmit={onSubmit}>
          <Input label="Email" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
          <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
        </form>
        {error && <p style={{ color: colors.error }}>{error}</p>}
        <Muted>No account? <a href={`/${locale}/register`} style={{ color: colors.link }}>Register</a></Muted>
      </div>
    </main>
  );
}
