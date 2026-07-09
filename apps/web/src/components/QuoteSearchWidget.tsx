'use client';

import Image from 'next/image';
import { useState } from 'react';
import { api } from '../lib/api';
import { JB, localAsset } from '../config/jetbay-cdn';
import { AirportInput } from './AirportInput';

type TripType = 'ONE_WAY' | 'ROUND_TRIP' | 'MULTI_CITY';

type Leg = {
  from: string;
  to: string;
  departure: string;
};

type AircraftOption = {
  categoryId: number;
  categoryCode: string;
  categoryLabel: string;
  maxPassengers: number;
  aircraftModel: string;
  estimatedPrice: number;
  currency: string;
};

function defaultLeg(): Leg {
  return {
    from: 'LTN',
    to: 'LBG',
    departure: new Date().toISOString().slice(0, 10),
  };
}

function CdnIcon({ src, alt = '' }: { src: string; alt?: string }) {
  return (
    <Image src={localAsset(src)} alt={alt} width={20} height={20} unoptimized className="jb-field-icon" />
  );
}

export function QuoteSearchWidget({ locale = 'en-us', currency = 'USD' }: { locale?: string; currency?: string }) {
  const [tripType, setTripType] = useState<TripType>('ONE_WAY');
  const [legs, setLegs] = useState<Leg[]>([defaultLeg()]);
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  });
  const [passengers, setPassengers] = useState(4);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<AircraftOption[] | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function buildApiLegs() {
    const base = legs.map((leg) => ({
      fromAirport: leg.from,
      toAirport: leg.to,
      departureDate: new Date(leg.departure).toISOString(),
      passengers,
    }));
    if (tripType === 'ROUND_TRIP' && legs[0]) {
      base.push({
        fromAirport: legs[0].to,
        toAirport: legs[0].from,
        departureDate: new Date(returnDate).toISOString(),
        passengers,
      });
    }
    return base;
  }

  function swapLeg(idx: number) {
    setLegs((prev) =>
      prev.map((leg, i) => (i === idx ? { ...leg, from: leg.to, to: leg.from } : leg)),
    );
  }

  function updateLeg(idx: number, patch: Partial<Leg>) {
    setLegs((prev) => prev.map((leg, i) => (i === idx ? { ...leg, ...patch } : leg)));
  }

  function addLeg() {
    setLegs((prev) => [...prev, defaultLeg()]);
  }

  function removeLeg(idx: number) {
    if (legs.length <= 1) return;
    setLegs((prev) => prev.filter((_, i) => i !== idx));
  }

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setOptions(null);
    try {
      const search = await api.searchAircraft({
        tripType,
        legs: buildApiLegs(),
        locale,
        currency,
      });
      setOptions(search.options as AircraftOption[]);

      const quote = await api.requestQuote({
        firstName: 'Guest',
        lastName: 'User',
        email: email || 'guest@example.com',
        phone: phone || '+10000000000',
        isConsentAccepted: true,
        legs: buildApiLegs(),
      });
      setResult(quote.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  const tabs: { id: TripType; label: string }[] = [
    { id: 'ONE_WAY', label: 'One-way' },
    { id: 'ROUND_TRIP', label: 'Round-Trip' },
    { id: 'MULTI_CITY', label: 'Multi-City' },
  ];

  return (
    <div className="jb-quote-card">
      <form onSubmit={onSearch}>
        <div className="jb-trip-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`jb-trip-tab${tripType === t.id ? ' active' : ''}`}
              onClick={() => {
                setTripType(t.id);
                if (t.id !== 'MULTI_CITY') setLegs([legs[0] ?? defaultLeg()]);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {legs.map((leg, idx) => (
          <div key={idx} className="jb-leg-block">
            {tripType === 'MULTI_CITY' && legs.length > 1 && (
              <div className="jb-leg-header">
                <span>Leg {idx + 1}</span>
                <button type="button" className="jb-leg-remove" onClick={() => removeLeg(idx)}>
                  <CdnIcon src={JB.icons.minus} alt="Remove leg" />
                </button>
              </div>
            )}
            <div className="jb-quote-grid">
              <AirportInput
                id={`from-${idx}`}
                label="From"
                value={leg.from}
                onChange={(iata) => updateLeg(idx, { from: iata })}
                placeholder="Departure city or airport"
              />
              <button type="button" className="jb-swap-btn" onClick={() => swapLeg(idx)} aria-label="Swap airports">
                <CdnIcon src={JB.icons.swap} alt="Swap" />
              </button>
              <AirportInput
                id={`to-${idx}`}
                label="To"
                value={leg.to}
                onChange={(iata) => updateLeg(idx, { to: iata })}
                placeholder="Destination city or airport"
              />
              <div className="jb-field jb-field-icon-wrap">
                <label htmlFor={`dep-${idx}`}>Departure (Local)</label>
                <div className="jb-input-with-icon">
                  <CdnIcon src={JB.icons.calendar} alt="" />
                  <input
                    id={`dep-${idx}`}
                    type="date"
                    value={leg.departure}
                    onChange={(e) => updateLeg(idx, { departure: e.target.value })}
                    required
                  />
                </div>
              </div>
              {idx === 0 && (
                <div className="jb-field">
                  <label>Passengers</label>
                  <div className="jb-pax-control">
                    <button type="button" className="jb-pax-btn" onClick={() => setPassengers((p) => Math.max(1, p - 1))} aria-label="Decrease passengers">
                      <CdnIcon src={JB.icons.minus} alt="" />
                    </button>
                    <span className="jb-pax-value">{passengers}</span>
                    <button type="button" className="jb-pax-btn" onClick={() => setPassengers((p) => Math.min(16, p + 1))} aria-label="Increase passengers">
                      <CdnIcon src={JB.icons.plus} alt="" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {tripType === 'ROUND_TRIP' && (
          <div className="jb-field jb-field-icon-wrap" style={{ maxWidth: 260, marginTop: 12 }}>
            <label htmlFor="return">Return (Local)</label>
            <div className="jb-input-with-icon">
              <CdnIcon src={JB.icons.calendar} alt="" />
              <input
                id="return"
                type="date"
                value={returnDate}
                min={legs[0]?.departure}
                onChange={(e) => setReturnDate(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {tripType === 'MULTI_CITY' && (
          <button type="button" className="jb-add-leg-btn" onClick={addLeg}>
            <CdnIcon src={JB.icons.addLeg} alt="" />
            Add another flight leg
          </button>
        )}

        <div className="jb-contact-row">
          <div className="jb-field">
            <label htmlFor="email">Email (optional)</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="jb-field">
            <label htmlFor="phone">Phone (optional)</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1..." />
          </div>
        </div>

        <button type="submit" className="jb-search-btn" disabled={loading}>
          {loading ? 'Searching...' : 'Search Available Aircraft'}
        </button>

        {options && options.length > 0 && (
          <div className="jb-aircraft-results">
            <h4>Available Aircraft</h4>
            {options.map((o) => (
              <div key={o.categoryId} className="jb-aircraft-row">
                <div>
                  <strong>{o.categoryLabel}</strong>
                  <div className="jb-aircraft-meta">{o.aircraftModel} · up to {o.maxPassengers} pax</div>
                </div>
                <div className="jb-aircraft-price">
                  {o.currency} {o.estimatedPrice.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {result && <p className="jb-form-msg success">{result}</p>}
        {error && <p className="jb-form-msg error">{error}</p>}
      </form>
    </div>
  );
}
