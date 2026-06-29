'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

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
      setMsg(err instanceof Error ? err.message : 'Subscription failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="jb-newsletter-form" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Your email"
          aria-label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>{loading ? '...' : 'Subscribe'}</button>
      </form>
      {msg && <p className="jb-form-msg success" style={{ marginTop: 8, fontSize: 13 }}>{msg}</p>}
    </>
  );
}
