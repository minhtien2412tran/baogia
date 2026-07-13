'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { DEFAULT_LOCALE } from '../../../config/locales';
import { AuthTabs, storeAuthSession, type AuthMode } from '../../../components/auth/auth-shared';
import { AppleSignInButton, GoogleSignInButton } from '../../../components/auth/GoogleSignInButton';
import { AppIcon } from '../../../components/ui/AppIcon';
import { BrandLogo } from '../../../components/brand/BrandLogo';
import { JETVINA_OFFICIAL_LOGO_ENABLED } from '../../../lib/brand';

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const { locale: loc } = use(params);
  const locale = loc ?? DEFAULT_LOCALE;
  const [mode, setMode] = useState<AuthMode>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      const res = await api.login(email, password);
      storeAuthSession(res);
      goAccount();
    } catch {
      setError('Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  }

  async function sendOtp() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.sendOtp(phone, 'LOGIN');
      setOtpSent(true);
      setDevCode(res.devCode ?? null);
    } catch {
      setError('Could not send OTP. Use format +84901234567');
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.verifyOtpLogin(phone, otp);
      storeAuthSession(res);
      goAccount();
    } catch {
      setError('Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="jb-subpage">
      <div className="jb-container jb-auth-wrap">
        <div style={{ marginBottom: 20 }}>
          <BrandLogo context="header" officialLogoEnabled={JETVINA_OFFICIAL_LOGO_ENABLED} />
        </div>
        <h1 className="jb-auth-title">Login</h1>
        <AuthTabs mode={mode} onChange={setMode} />

        {mode === 'email' ? (
          <form className="jb-auth-form" onSubmit={onEmailSubmit}>
            <div className="jb-field">
              <label htmlFor="login-email">
                <AppIcon name="mail" size="sm" aria-hidden /> Email
              </label>
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
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <AppIcon name="eye" size="md" aria-hidden />
                </button>
              </div>
            </div>
            <button type="submit" className="jb-btn-primary" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        ) : (
          <form className="jb-auth-form" onSubmit={verifyOtp}>
            <div className="jb-field">
              <label htmlFor="login-phone">
                <AppIcon name="phone" size="sm" aria-hidden /> Phone
              </label>
              <input
                id="login-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+84901234567"
                required
              />
            </div>
            {!otpSent ? (
              <button type="button" className="jb-btn-primary" onClick={sendOtp} disabled={loading || !phone}>
                Send OTP
              </button>
            ) : (
              <>
                <div className="jb-field">
                  <label htmlFor="login-otp">Verification code</label>
                  <input
                    id="login-otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                {process.env.NODE_ENV !== 'production' && devCode ? (
                  <p className="jb-account-meta">Dev code: {devCode}</p>
                ) : null}
                <button type="submit" className="jb-btn-primary" disabled={loading}>
                  Verify &amp; Sign in
                </button>
              </>
            )}
          </form>
        )}

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <GoogleSignInButton locale={locale} onSuccess={goAccount} onError={setError} />
          <AppleSignInButton locale={locale} onSuccess={goAccount} onError={setError} />
        </div>

        {error && (
          <p className="jb-auth-error">
            <AppIcon name="alert" size="sm" aria-hidden /> {error}
          </p>
        )}
        <p className="jb-auth-foot">
          No account? <a href={`/${locale}/register`}>Register</a>
        </p>
      </div>
    </main>
  );
}
