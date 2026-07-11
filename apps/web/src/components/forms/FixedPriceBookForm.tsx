'use client';

import { useState } from 'react';
import { api } from '../../lib/api';
import { t } from '../../lib/i18n';

type Tier = { category: string; categoryLabel?: string; price: number; paxLimit: number };

export function FixedPriceBookForm({
  locale,
  routeId,
  tiers,
}: {
  locale: string;
  routeId: number;
  tiers: Tier[];
}) {
  const [category, setCategory] = useState(tiers[0]?.category ?? 'LIGHT');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(2);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await api.requestFixedPriceQuote({
        routeId,
        category,
        date,
        passengers,
        email,
      });
      setResult(res.message);
      setStatus('done');
    } catch {
      setStatus('error');
      setResult(t(locale, 'quoteError'));
    }
  }

  if (tiers.length === 0) return null;

  return (
    <section className="jb-sub-section jb-booking-form">
      <h2 className="jb-section-title">{t(locale, 'bookRoute')}</h2>
      <form className={`jb-newsletter-form jb-enquiry-form jb-booking-form__form${status === 'done' ? ' jb-booking-form--success' : ''}`} onSubmit={onSubmit}>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {tiers.map((tier) => (
            <option key={tier.category} value={tier.category}>
              {t(locale, 'tierOption', {
                category: tier.categoryLabel ?? tier.category,
                price: tier.price.toLocaleString(),
                pax: t(locale, 'upToPax', { n: tier.paxLimit }),
              })}
            </option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input
          type="number"
          min={1}
          max={16}
          value={passengers}
          onChange={(e) => setPassengers(Number(e.target.value))}
          placeholder={t(locale, 'passengers')}
          required
        />
        <input
          type="email"
          placeholder={t(locale, 'emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="jb-btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? t(locale, 'processing') : t(locale, 'getFixedPriceQuote')}
        </button>
        {(status === 'done' || status === 'error') && (
          <p className={`jb-form-msg ${status === 'done' ? 'success' : 'error'}`}>{result}</p>
        )}
      </form>
    </section>
  );
}
