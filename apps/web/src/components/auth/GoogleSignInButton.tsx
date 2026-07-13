'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '../../lib/api';
import { storeAuthSession } from './auth-shared';
import { scheduleUi } from '../../lib/browser';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: Record<string, unknown>) => void;
          renderButton: (el: HTMLElement, cfg: Record<string, unknown>) => void;
          prompt: () => void;
        };
      };
    };
    AppleID?: {
      auth: {
        init: (cfg: Record<string, unknown>) => void;
        signIn: () => Promise<{ authorization: { id_token: string } }>;
      };
    };
  }
}

export function GoogleSignInButton({
  locale,
  onSuccess,
  onError,
}: {
  locale: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const btnRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    const scriptId = 'google-gsi';
    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script');
      s.id = scriptId;
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.onload = () => setReady(true);
      document.body.appendChild(s);
    } else {
      scheduleUi(() => setReady(true));
    }
  }, [clientId]);

  useEffect(() => {
    if (!ready || !clientId || !btnRef.current || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: { credential: string }) => {
        try {
          const res = await api.oauthGoogle(response.credential);
          storeAuthSession(res);
          onSuccess();
        } catch {
          onError('Google sign-in failed. Check GOOGLE_CLIENT_ID on API.');
        }
      },
    });

    btnRef.current.innerHTML = '';
    window.google.accounts.id.renderButton(btnRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      width: 320,
      text: 'continue_with',
    });
  }, [ready, clientId, locale, onSuccess, onError]);

  if (!clientId) {
    return (
      <button type="button" className="jb-btn-ghost" disabled title="Set NEXT_PUBLIC_GOOGLE_CLIENT_ID">
        Continue with Google
      </button>
    );
  }

  return <div ref={btnRef} style={{ minHeight: 44 }} />;
}

export function AppleSignInButton({
  locale,
  onSuccess,
  onError,
}: {
  locale: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;
    const scriptId = 'apple-auth-js';
    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script');
      s.id = scriptId;
      s.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
      s.async = true;
      s.defer = true;
      s.onload = () => setReady(true);
      document.body.appendChild(s);
    } else {
      scheduleUi(() => setReady(true));
    }
  }, [clientId]);

  useEffect(() => {
    if (!ready || !clientId || !window.AppleID) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    window.AppleID.auth.init({
      clientId,
      scope: 'name email',
      redirectURI: `${origin}/${locale}/login`,
      usePopup: true,
    });
  }, [ready, clientId, locale]);

  async function handleClick() {
    if (!window.AppleID) return;
    setLoading(true);
    try {
      const result = await window.AppleID.auth.signIn();
      const res = await api.oauthApple(result.authorization.id_token);
      storeAuthSession(res);
      onSuccess();
    } catch {
      onError('Apple sign-in failed. Check APPLE_CLIENT_ID on API and web.');
    } finally {
      setLoading(false);
    }
  }

  if (!clientId) {
    return (
      <button type="button" className="jb-btn-ghost" disabled title="Set NEXT_PUBLIC_APPLE_CLIENT_ID">
        Continue with Apple
      </button>
    );
  }

  return (
    <button type="button" className="jb-btn-ghost" onClick={handleClick} disabled={!ready || loading}>
      {loading ? 'Signing in…' : 'Continue with Apple'}
    </button>
  );
}

/** @deprecated Use AppleSignInButton */
export function AppleSignInPlaceholder() {
  return (
    <button type="button" className="jb-btn-ghost" disabled>
      Continue with Apple (configure APPLE_CLIENT_ID)
    </button>
  );
}
