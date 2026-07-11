'use client';

import { notifyAuthChanged } from '../../lib/auth-session';

export function storeAuthSession(res: {
  user: { id: number };
  tokens: { accessToken: string; refreshToken?: string };
}) {
  localStorage.setItem('jetbay_token', res.tokens.accessToken);
  localStorage.setItem('jetbay_user_id', String(res.user.id));
  if (res.tokens.refreshToken) {
    localStorage.setItem('jetbay_refresh_token', res.tokens.refreshToken);
  }
  notifyAuthChanged();
}

export type AuthMode = 'email' | 'otp';

export function AuthTabs({
  mode,
  onChange,
}: {
  mode: AuthMode;
  onChange: (m: AuthMode) => void;
}) {
  return (
    <div className="jb-auth-tabs" style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
      <button
        type="button"
        className={mode === 'email' ? 'jb-btn-primary' : 'jb-btn-ghost'}
        onClick={() => onChange('email')}
      >
        Email
      </button>
      <button
        type="button"
        className={mode === 'otp' ? 'jb-btn-primary' : 'jb-btn-ghost'}
        onClick={() => onChange('otp')}
      >
        SMS OTP
      </button>
    </div>
  );
}
