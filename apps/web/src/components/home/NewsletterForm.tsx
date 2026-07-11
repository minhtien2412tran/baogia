'use client';

import { useState } from 'react';
import { api } from '../../lib/api';
import { t } from '../../lib/i18n';

export function NewsletterForm({ locale }: { locale: string }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await api.subscribeNewsletter(email, locale);
      setMsg(res.message);
      setEmail('');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : t(locale, 'subscriptionFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="jb-newsletter-form" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder={t(locale, 'emailPlaceholder')}
          aria-label={t(locale, 'emailAriaLabel')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? t(locale, 'subscribing') : t(locale, 'subscribe')}
        </button>
      </form>
      {msg && <p className="jb-form-msg success" style={{ marginTop: 8, fontSize: 13 }}>{msg}</p>}
    </>
  );
}
