'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { AuthTabs, storeAuthSession, type AuthMode } from '../../../components/auth/auth-shared';
import { AppleSignInButton, GoogleSignInButton } from '../../../components/auth/GoogleSignInButton';

export default function RegisterPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const locale = params?.locale ?? 'en';
  const [mode, setMode] = useState<AuthMode>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function goAccount() {
    router.push(`/${locale}/account`);
  }

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.register(email, password);
      storeAuthSession(res);
      goAccount();
    } catch {
      setError('Registration failed. Email may already exist.');
    } finally {
      setLoading(false);
    }
  }

  async function sendOtp() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.sendOtp(phone, 'REGISTER');
      setOtpSent(true);
      setDevCode(res.devCode ?? null);
    } catch {
      setError('Could not send OTP.');
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.verifyOtpRegister(phone, otp, email || undefined);
      storeAuthSession(res);
      goAccount();
    } catch {
      setError('Invalid OTP or phone already registered.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="jb-subpage">
      <div className="jb-container jb-auth-wrap">
        <h1 className="jb-auth-title">Create Account</h1>
        <AuthTabs mode={mode} onChange={setMode} />

        {mode === 'email' ? (
          <form className="jb-auth-form" onSubmit={onEmailSubmit}>
            <div className="jb-field">
              <label htmlFor="register-email">Email</label>
              <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="jb-field">
              <label htmlFor="register-password">Password</label>
              <input id="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>
            <button type="submit" className="jb-btn-primary" disabled={loading}>
              {loading ? 'Creating…' : 'Register'}
            </button>
          </form>
        ) : (
          <form className="jb-auth-form" onSubmit={verifyOtp}>
            <div className="jb-field">
              <label htmlFor="register-phone">Phone</label>
              <input id="register-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+84901234567" required />
            </div>
            <div className="jb-field">
              <label htmlFor="register-email-otp">Email (optional)</label>
              <input id="register-email-otp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
            </div>
            {!otpSent ? (
              <button type="button" className="jb-btn-primary" onClick={sendOtp} disabled={loading || !phone}>
                Send OTP
              </button>
            ) : (
              <>
                <div className="jb-field">
                  <label htmlFor="register-otp">Verification code</label>
                  <input id="register-otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                </div>
                {devCode && <p className="jb-account-meta">Dev code: {devCode}</p>}
                <button type="submit" className="jb-btn-primary" disabled={loading}>
                  Verify &amp; Create account
                </button>
              </>
            )}
          </form>
        )}

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <GoogleSignInButton locale={locale} onSuccess={goAccount} onError={setError} />
          <AppleSignInButton locale={locale} onSuccess={goAccount} onError={setError} />
        </div>

        {error && <p className="jb-auth-error">{error}</p>}
        <p className="jb-auth-foot">
          Already have an account? <a href={`/${locale}/login`}>Login</a>
        </p>
      </div>
    </main>
  );
}
