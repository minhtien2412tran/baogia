'use client';

import { useEffect, useState } from 'react';
import { api, parseApiErrorMessage, type AircraftSearchOption } from '../lib/api';
import { formatNumber } from '../config/locales';
import { t } from '../lib/i18n';
import { AircraftRowSkeleton } from './ui/Skeleton';
import { AirportInput } from './AirportInput';
import { FlightScrollRail } from './ui/FlightScrollRail';
import { AviationMotionIcon } from './ui/AviationMotionIcon';
import { getAuthToken } from '../lib/auth-session';

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [searching, setSearching] = useState(false);
  const [quoting, setQuoting] = useState(false);
  const [searchId, setSearchId] = useState<string | null>(null);
  const [options, setOptions] = useState<AircraftSearchOption[] | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    setAuthToken(token);
    if (!token) return;
    void api.getMe(token).then((profile) => {
      setEmail((value) => value || profile.email);
      setPhone((value) => value || profile.phone || '');
      setFirstName((value) => value || profile.firstName || '');
      setLastName((value) => value || profile.lastName || '');
    }).catch(() => {
      /* Guest form remains usable when the session is stale. */
    });
  }, []);

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
    if (!phone.trim()) {
      setError(t(locale, 'quotePhoneRequired'));
      return;
    }
    if (!consent) {
      setError(t(locale, 'quoteConsentLabel'));
      return;
    }

    const selected = options.find((o) => o.categoryId === selectedId);
    const inferred = splitNameFromEmail(email.trim());

    setQuoting(true);
    try {
      const quote = await api.requestQuote({
        firstName: firstName.trim() || inferred.firstName,
        lastName: lastName.trim() || inferred.lastName,
        email: email.trim(),
        phone: phone.trim(),
        tripType,
        legs: buildApiLegs(),
        isConsentAccepted: true,
        locale,
        message: selected
          ? `Selected aircraft: ${selected.categoryLabel} (${selected.aircraftModel}) — ${selected.currency} ${formatNumber(selected.estimatedPrice, locale)}${searchId ? ` · searchId=${searchId}` : ''}`
          : searchId
            ? `searchId=${searchId}`
            : undefined,
      }, authToken ?? undefined);
      setResult(
        t(locale, 'quoteSuccessWithId', {
          message: quote.message,
          id: quote.requestId,
        }),
      );
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
                <button type="button" className="jb-leg-remove" onClick={() => removeLeg(idx)} aria-label="Remove leg">
                  <AviationMotionIcon name="minus" size="sm" />
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
                showNearMe={idx === 0}
                variant="from"
              />
              <button type="button" className="jb-swap-btn" onClick={() => swapLeg(idx)} aria-label={t(locale, 'swapAirports')}>
                <AviationMotionIcon name="swapRoute" size="lg" motion="swap" />
              </button>
              <AirportInput
                id={`to-${idx}`}
                label={t(locale, 'to')}
                value={leg.to}
                onChange={(iata) => updateLeg(idx, { to: iata })}
                placeholder={t(locale, 'destinationPlaceholder')}
                locale={locale}
                variant="to"
              />
              <div className="jb-field jb-field-icon-wrap">
                <label htmlFor={`dep-${idx}`}>{t(locale, 'departure')}</label>
                <div className="jb-input-with-icon">
                  <AviationMotionIcon name="calendar" size="md" motion="float" className="jb-field-icon" />
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
                  <label>{t(locale, 'passengers')}</label>
                  <div className="jb-pax-control">
                    <button type="button" className="jb-pax-btn" onClick={() => setPassengers((p) => Math.max(1, p - 1))} aria-label={t(locale, 'decreasePax')}>
                      <AviationMotionIcon name="minus" size="sm" />
                    </button>
                    <span className="jb-pax-value">
                      <AviationMotionIcon name="passengers" size="xs" motion="pulse" />
                      {passengers}
                    </span>
                    <button type="button" className="jb-pax-btn" onClick={() => setPassengers((p) => Math.min(16, p + 1))} aria-label={t(locale, 'increasePax')}>
                      <AviationMotionIcon name="plus" size="sm" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {tripType === 'ROUND_TRIP' && (
          <div className="jb-field jb-field-icon-wrap" style={{ maxWidth: 260, marginTop: 12 }}>
            <label htmlFor="return">{t(locale, 'returnDate')}</label>
            <div className="jb-input-with-icon">
              <AviationMotionIcon name="calendar" size="md" motion="float" className="jb-field-icon" />
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
            <AviationMotionIcon name="addLeg" size="md" motion="pulse" />
            {t(locale, 'addLeg')}
          </button>
        )}

        <button type="submit" className="jb-search-btn" disabled={loading}>
          {searching ? (
            <span className="jb-search-btn__label jb-search-btn__inner">
              <AviationMotionIcon name="radar" size="md" motion="radar-sweep" />
              {t(locale, 'searching')}
            </span>
          ) : (
            <span className="jb-search-btn__inner">
              <span className="jb-search-btn__plane" aria-hidden>
                <AviationMotionIcon name="plane" size="md" />
              </span>
              {t(locale, 'searchAircraft')}
            </span>
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
                    {o.operatorName && o.tailNumber ? (
                      <div className="jb-aircraft-meta jb-aircraft-meta--ops">
                        {t(locale, 'pricedWithOperator', {
                          operator: o.operatorName,
                          tail: o.tailNumber,
                          base: o.baseAirport ?? '—',
                        })}
                        {o.baseDistanceKm != null && o.baseDistanceKm < 99999 ? (
                          <span className="jb-aircraft-meta--dist">
                            {' '}
                            · {o.baseDistanceKm} km
                          </span>
                        ) : null}
                      </div>
                    ) : o.baseAirport ? (
                      <div className="jb-aircraft-meta jb-aircraft-meta--ops">
                        base {o.baseAirport}
                      </div>
                    ) : null}
                    {o.pricingBreakdown?.segments?.length ? (
                      <div className="jb-aircraft-breakdown">
                        {o.pricingBreakdown.segments
                          .map((s) => {
                            const label =
                              s.type === 'POSITIONING'
                                ? 'Pos'
                                : s.type === 'PASSENGER' || s.type === 'REVENUE'
                                  ? 'Fly'
                                  : s.type === 'RETURN'
                                    ? 'Return'
                                    : 'Home';
                            return `${label} ${s.from}→${s.to}`;
                          })
                          .join(' · ')}
                      </div>
                    ) : null}
                  </div>
                  <div className="jb-aircraft-price">
                    {o.currency} {formatNumber(o.estimatedPrice, locale)}
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
                <label htmlFor="first-name">First name</label>
                <input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="jb-field">
                <label htmlFor="last-name">Last name</label>
                <input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
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
                <label htmlFor="phone">{t(locale, 'phoneRequired')}</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8490..."
                  required
                  autoComplete="tel"
                />
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
