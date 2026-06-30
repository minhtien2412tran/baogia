'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';

export default function RegisterPage({ params }: { params: { locale: string } }) {
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
      const res = await api.register(email, password);
      localStorage.setItem('jta_token', res.tokens.accessToken);
      localStorage.setItem('jta_user_id', String(res.user.id));
      router.push(`/${locale}/account`);
    } catch {
      setError('Registration failed. Email may already exist.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="jb-subpage">
      <div className="jb-container jb-auth-wrap">
        <h1 className="jb-auth-title">Create Account</h1>
        <form className="jb-auth-form" onSubmit={onSubmit}>
          <div className="jb-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="jb-field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <button type="submit" className="jb-btn-primary" disabled={loading}>
            {loading ? 'Creating…' : 'Register'}
          </button>
        </form>
        {error && <p className="jb-auth-error">{error}</p>}
        <p className="jb-auth-foot">
          Already have an account? <a href={`/${locale}/login`}>Login</a>
        </p>
      </div>
    </main>
  );
}
