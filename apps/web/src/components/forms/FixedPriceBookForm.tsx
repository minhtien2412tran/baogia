'use client';

import { useMemo, useState } from 'react';
import { api, parseApiErrorMessage } from '../../lib/api';
import { t } from '../../lib/i18n';
import { DateField } from '../ui/DateField';

type Tier = { category: string; categoryLabel?: string; price: number; paxLimit: number };

export function FixedPriceBookForm({
  locale,
  routeId,
  tiers,
  fromIata,
  toIata,
}: {
  locale: string;
  routeId: number;
  tiers: Tier[];
  fromIata: string;
  toIata: string;
}) {
  const [category, setCategory] = useState(tiers[0]?.category ?? 'LIGHT');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(2);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState('');

  const selectedTier = useMemo(() => tiers.find((x) => x.category === category) ?? tiers[0], [tiers, category]);

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setResult('');
    try {
      const res = await api.requestFixedPriceQuote({
        routeId,
        category,
        date,
        passengers,
        email: email.trim(),
      });
      setResult(res.message);
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setResult(parseApiErrorMessage(err, t(locale, 'quoteError')));
    }
  }

  if (tiers.length === 0) return null;

  return (
    <aside className="jb-fp-book-card">
      <div className="jb-fp-book-card__head">
        <span className="jb-fp-book-card__route">
          {fromIata} → {toIata}
        </span>
        <h2 className="jb-fp-book-card__title">{t(locale, 'bookRoute')}</h2>
        {selectedTier ? (
          <p className="jb-fp-book-card__price">
            USD {selectedTier.price.toLocaleString()}
            <span>{selectedTier.categoryLabel ?? selectedTier.category}</span>
          </p>
        ) : null}
      </div>

      <form
        className={`jb-fp-book-form${status === 'done' ? ' jb-fp-book-form--success' : ''}`}
        onSubmit={onSubmit}
      >
        <label className="jb-field">
          <span className="jb-field-label">{t(locale, 'aircraftCategory')}</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="jb-fp-select">
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
        </label>

        <DateField
          id="fp-depart-date"
          label={t(locale, 'departure')}
          value={date}
          onChange={setDate}
          required
          min={minDate}
        />

        <label className="jb-field">
          <span className="jb-field-label">{t(locale, 'passengers')}</span>
          <input
            type="number"
            className="jb-fp-input"
            min={1}
            max={selectedTier?.paxLimit ?? 16}
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            required
          />
        </label>

        <label className="jb-field">
          <span className="jb-field-label">{t(locale, 'emailAddress')}</span>
          <input
            type="email"
            className="jb-fp-input"
            placeholder={t(locale, 'emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <button type="submit" className="jb-btn-primary jb-fp-book-submit" disabled={status === 'loading'}>
          {status === 'loading' ? t(locale, 'processing') : t(locale, 'getFixedPriceQuote')}
        </button>

        {(status === 'done' || status === 'error') && (
          <p className={`jb-form-msg ${status === 'done' ? 'success' : 'error'}`} role="status">
            {result}
          </p>
        )}
      </form>
    </aside>
  );
}
