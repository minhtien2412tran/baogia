'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
      setError('Login failed. Use demo@j-ta.local / Demo123!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="jb-subpage">
      <div className="jb-container jb-auth-wrap">
        <h1 className="jb-auth-title">Login</h1>
        <form className="jb-auth-form" onSubmit={onSubmit}>
          <div className="jb-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="jb-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="jb-btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        {error && <p className="jb-auth-error">{error}</p>}
        <p className="jb-auth-foot">
          No account? <a href={`/${locale}/register`}>Register</a>
        </p>
      </div>
    </main>
  );
}
