'use client';

import Image from 'next/image';
import { useState } from 'react';
import { api, parseApiErrorMessage, type AircraftSearchOption } from '../lib/api';
import { t } from '../lib/i18n';
import { JB, localAsset } from '../config/jetbay-cdn';
import { AircraftRowSkeleton } from './ui/Skeleton';
import { AirportInput } from './AirportInput';
import { DateField } from './ui/DateField';
import { FlightScrollRail } from './ui/FlightScrollRail';

type TripType = 'ONE_WAY' | 'ROUND_TRIP' | 'MULTI_CITY';

type Leg = {
  from: string;
  to: string;
  departure: string;
};

function defaultLeg(): Leg {
  return {
    from: '',
    to: '',
    departure: new Date().toISOString().slice(0, 10),
  };
}

function CdnIcon({ src, alt = '' }: { src: string; alt?: string }) {
  return (
    <Image src={localAsset(src)} alt={alt} width={20} height={20} unoptimized className="jb-field-icon" />
  );
}

function splitNameFromEmail(email: string): { firstName: string; lastName: string } {
  const local = email.split('@')[0] ?? 'Guest';
  const parts = local.replace(/[._+-]/g, ' ').trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
  }
  return { firstName: parts[0] || 'Guest', lastName: 'User' };
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
  const [consent, setConsent] = useState(false);
  const [searching, setSearching] = useState(false);
  const [quoting, setQuoting] = useState(false);
  const [searchId, setSearchId] = useState<string | null>(null);
  const [options, setOptions] = useState<AircraftSearchOption[] | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function buildApiLegs() {
    const base = legs.map((leg) => ({
      fromAirport: leg.from.toUpperCase(),
      toAirport: leg.to.toUpperCase(),
      departureDate: new Date(leg.departure).toISOString(),
      passengers,
    }));
    if (tripType === 'ROUND_TRIP' && legs[0]) {
      base.push({
        fromAirport: legs[0].to.toUpperCase(),
        toAirport: legs[0].from.toUpperCase(),
        departureDate: new Date(returnDate).toISOString(),
        passengers,
      });
    }
    return base;
  }

  function validateLegs(): string | null {
    for (const leg of buildApiLegs()) {
      if (!/^[A-Z]{3}$/.test(leg.fromAirport) || !/^[A-Z]{3}$/.test(leg.toAirport)) {
        return t(locale, 'airportSelectRequired');
      }
    }
    return null;
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
    setError(null);
    setResult(null);
    const legError = validateLegs();
    if (legError) {
      setError(legError);
      return;
    }

    setSearching(true);
    setOptions(null);
    setSelectedId(null);
    setSearchId(null);
    try {
      const search = await api.searchAircraft({
        tripType,
        legs: buildApiLegs(),
        locale,
        currency,
      });
      setSearchId(search.searchId);
      setOptions(search.options);
      if (search.options.length > 0) {
        setSelectedId(search.options[0].categoryId);
      }
    } catch (err) {
      setError(parseApiErrorMessage(err, t(locale, 'quoteError')));
    } finally {
      setSearching(false);
    }
  }

  async function onRequestQuote() {
    setError(null);
    setResult(null);

    if (!options?.length || selectedId == null) {
      setError(t(locale, 'quoteSearchFirst'));
      return;
    }
    if (!email.trim()) {
      setError(t(locale, 'quoteEmailRequired'));
      return;
    }
    if (!consent) {
      setError(t(locale, 'quoteConsentLabel'));
      return;
    }

    const selected = options.find((o) => o.categoryId === selectedId);
    const { firstName, lastName } = splitNameFromEmail(email.trim());

    setQuoting(true);
    try {
      const quote = await api.requestQuote({
        firstName,
        lastName,
        email: email.trim(),
        phone: phone.trim() || '+10000000000',
        tripType,
        legs: buildApiLegs(),
        isConsentAccepted: true,
        message: selected
          ? `Selected aircraft: ${selected.categoryLabel} (${selected.aircraftModel}) — ${selected.currency} ${selected.estimatedPrice.toLocaleString()}${searchId ? ` · searchId=${searchId}` : ''}`
          : searchId
            ? `searchId=${searchId}`
            : undefined,
      });
      setResult(quote.message);
    } catch (err) {
      setError(parseApiErrorMessage(err, t(locale, 'quoteError')));
    } finally {
      setQuoting(false);
    }
  }

  const tabs: { id: TripType; label: string }[] = [
    { id: 'ONE_WAY', label: t(locale, 'oneWay') },
    { id: 'ROUND_TRIP', label: t(locale, 'roundTrip') },
    { id: 'MULTI_CITY', label: t(locale, 'multiCity') },
  ];

  const loading = searching || quoting;

  return (
    <div className={`jb-quote-card jb-booking-widget${searching ? ' jb-booking-widget--searching' : ''}`}>
      <form onSubmit={onSearch}>
        <FlightScrollRail compact className="jb-trip-tabs-rail" trackClassName="jb-trip-tabs" ariaLabel="Trip type">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`jb-trip-tab${tripType === tab.id ? ' active' : ''}`}
              onClick={() => {
                setTripType(tab.id);
                if (tab.id !== 'MULTI_CITY') setLegs([legs[0] ?? defaultLeg()]);
              }}
            >
              {tab.label}
            </button>
          ))}
        </FlightScrollRail>

        {legs.map((leg, idx) => (
          <div key={idx} className="jb-leg-block">
            {tripType === 'MULTI_CITY' && legs.length > 1 && (
              <div className="jb-leg-header">
                <span>{t(locale, 'leg')} {idx + 1}</span>
                <button type="button" className="jb-leg-remove" onClick={() => removeLeg(idx)}>
                  <CdnIcon src={JB.icons.minus} alt="Remove leg" />
                </button>
              </div>
            )}
            <div className="jb-quote-grid">
              <AirportInput
                id={`from-${idx}`}
                label={t(locale, 'from')}
                value={leg.from}
                onChange={(iata) => updateLeg(idx, { from: iata })}
                placeholder={t(locale, 'departurePlaceholder')}
                locale={locale}
              />
              <button type="button" className="jb-swap-btn" onClick={() => swapLeg(idx)} aria-label={t(locale, 'swapAirports')}>
                <CdnIcon src={JB.icons.swap} alt="Swap" />
              </button>
              <AirportInput
                id={`to-${idx}`}
                label={t(locale, 'to')}
                value={leg.to}
                onChange={(iata) => updateLeg(idx, { to: iata })}
                placeholder={t(locale, 'destinationPlaceholder')}
                locale={locale}
              />
              <DateField
                id={`dep-${idx}`}
                label={t(locale, 'departure')}
                value={leg.departure}
                onChange={(v) => updateLeg(idx, { departure: v })}
                required
              />
              {idx === 0 && (
                <div className="jb-field">
                  <label>{t(locale, 'passengers')}</label>
                  <div className="jb-pax-control">
                    <button type="button" className="jb-pax-btn" onClick={() => setPassengers((p) => Math.max(1, p - 1))} aria-label={t(locale, 'decreasePax')}>
                      <CdnIcon src={JB.icons.minus} alt="" />
                    </button>
                    <span className="jb-pax-value">{passengers}</span>
                    <button type="button" className="jb-pax-btn" onClick={() => setPassengers((p) => Math.min(16, p + 1))} aria-label={t(locale, 'increasePax')}>
                      <CdnIcon src={JB.icons.plus} alt="" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {tripType === 'ROUND_TRIP' && (
          <div style={{ maxWidth: 260, marginTop: 12 }}>
            <DateField
              id="return"
              label={t(locale, 'returnDate')}
              value={returnDate}
              onChange={setReturnDate}
              min={legs[0]?.departure}
              required
            />
          </div>
        )}

        {tripType === 'MULTI_CITY' && (
          <button type="button" className="jb-add-leg-btn" onClick={addLeg}>
            <CdnIcon src={JB.icons.addLeg} alt="" />
            {t(locale, 'addLeg')}
          </button>
        )}

        <button type="submit" className="jb-search-btn" disabled={loading}>
          {searching ? (
            <span className="jb-search-btn__label">
              <span className="jb-search-radar" aria-hidden />
              {t(locale, 'searching')}
            </span>
          ) : (
            t(locale, 'searchAircraft')
          )}
        </button>

        {searching && (
          <div className="jb-aircraft-results jb-booking-results" aria-busy="true" aria-live="polite">
            <h4>{t(locale, 'availableAircraft')}</h4>
            <AircraftRowSkeleton />
            <AircraftRowSkeleton />
            <AircraftRowSkeleton />
          </div>
        )}

        {!searching && options && options.length === 0 && (
          <p className="jb-form-msg error">{t(locale, 'noAircraftFound')}</p>
        )}

        {!searching && options && options.length > 0 && (
          <div className="jb-aircraft-results jb-booking-results">
            <h4>{t(locale, 'availableAircraft')}</h4>
            {options.map((o, i) => (
              <button
                key={o.categoryId}
                type="button"
                className={`jb-aircraft-row jb-booking-result-row jb-tilt-card${selectedId === o.categoryId ? ' jb-aircraft-row--selected' : ''}`}
                data-tilt-max="6"
                style={{ animationDelay: `${i * 0.08}s` }}
                onClick={() => setSelectedId(o.categoryId)}
                aria-pressed={selectedId === o.categoryId}
              >
                <div className="jb-tilt-card__inner jb-aircraft-row-inner">
                  <div>
                    <strong>{o.categoryLabel}</strong>
                    <div className="jb-aircraft-meta">
                      {o.aircraftModel} · {t(locale, 'upToPax', { n: o.maxPassengers })}
                    </div>
                  </div>
                  <div className="jb-aircraft-price">
                    {o.currency} {o.estimatedPrice.toLocaleString()}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {options && options.length > 0 && (
          <div className="jb-quote-request-block">
            <div className="jb-contact-row">
              <div className="jb-field">
                <label htmlFor="email">{t(locale, 'emailPlaceholder')}</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="jb-field">
                <label htmlFor="phone">{t(locale, 'phoneOptional')}</label>
                <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1..." />
              </div>
            </div>
            <label className="jb-consent-row">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>{t(locale, 'quoteConsentLabel')}</span>
            </label>
            <button
              type="button"
              className="jb-search-btn jb-search-btn--secondary"
              disabled={loading}
              onClick={onRequestQuote}
            >
              {quoting ? t(locale, 'processing') : t(locale, 'requestQuoteBtn')}
            </button>
          </div>
        )}

        {result && <p className="jb-form-msg success jb-booking-success">{result}</p>}
        {error && <p className="jb-form-msg error">{error}</p>}
      </form>
    </div>
  );
}
