'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

type Tier = { category: string; price: number; paxLimit: number };

export function FixedPriceBookForm({
  routeId,
  tiers,
}: {
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
      setResult('Unable to generate quote. Please try again.');
    }
  }

  if (tiers.length === 0) return null;

  return (
    <section className="jb-sub-section jb-booking-form">
      <h2 className="jb-section-title">Book this route</h2>
      <form className={`jb-newsletter-form jb-enquiry-form jb-booking-form__form${status === 'done' ? ' jb-booking-form--success' : ''}`} onSubmit={onSubmit}>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {tiers.map((t) => (
            <option key={t.category} value={t.category}>
              {t.category} — USD {t.price.toLocaleString()} (up to {t.paxLimit} pax)
            </option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="number" min={1} max={16} value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} placeholder="Passengers" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit" className="jb-btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Processing…' : 'Get fixed-price quote'}
        </button>
        {(status === 'done' || status === 'error') && (
          <p className={`jb-form-msg ${status === 'done' ? 'success' : 'error'}`}>{result}</p>
        )}
      </form>
    </section>
  );
}
