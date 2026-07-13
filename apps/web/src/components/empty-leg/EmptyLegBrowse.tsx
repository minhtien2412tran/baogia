'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { t } from '@jetbay/i18n';
import { api } from '../../lib/api';
import { navHref } from '../../config/navigation';
import { AppIcon } from '../ui/AppIcon';

type Continent = { code: string; name: string };
type Country = { code: string; name: string };

export function EmptyLegBrowse({ locale }: { locale: string }) {
  const [continentCode, setContinentCode] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [continents, setContinents] = useState<Continent[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [legs, setLegs] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getAirportContinents()
      .then((r) => setContinents(r.continents ?? []))
      .catch(() => setContinents([]));
  }, []);

  useEffect(() => {
    if (!continentCode) {
      setCountries([]);
      return;
    }
    api
      .getAirportCountries(continentCode)
      .then((r) => setCountries(r.countries ?? []))
      .catch(() => setCountries([]));
  }, [continentCode]);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .getEmptyLegs({
        continentCode: continentCode || undefined,
        countryCode: countryCode || undefined,
      })
      .then((r) => setLegs(r.emptyLegs ?? []))
      .catch((e: Error) => {
        setError(e.message);
        setLegs([]);
      })
      .finally(() => setLoading(false));
  }, [continentCode, countryCode]);

  const filterLabel = useMemo(() => {
    if (countryCode) return countryCode;
    if (continentCode) return continentCode;
    return 'ALL';
  }, [continentCode, countryCode]);

  return (
    <section className="jb-sub-section">
      <h2 className="jb-section-title">{t(locale, 'availableEmptyLegs')}</h2>
      <div
        className="jb-empty-filters"
        style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}
      >
        <label className="jb-empty-filter-label">
          <AppIcon name="filter" size="sm" aria-hidden /> Continent{' '}
          <select
            value={continentCode}
            onChange={(e) => {
              setContinentCode(e.target.value);
              setCountryCode('');
            }}
          >
            <option value="">All</option>
            {continents.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </label>
        <label className="jb-empty-filter-label">
          <AppIcon name="mapPin" size="sm" aria-hidden /> Country{' '}
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            disabled={!continentCode}
          >
            <option value="">All</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </label>
        <span className="jb-muted" style={{ alignSelf: 'center', opacity: 0.75 }}>
          Filter: {filterLabel}
        </span>
      </div>

      {loading ? <p className="jb-section-desc">Loading…</p> : null}
      {error ? <p className="jb-section-desc">{error}</p> : null}
      {!loading && legs.length === 0 ? (
        <p className="jb-section-desc">{t(locale, 'emptyLegsEmptyDesc')}</p>
      ) : null}

      <div className="jb-empty-grid">
        {legs.map((el) => {
          const from = el.fromAirport as { city?: string; iata?: string };
          const to = el.toAirport as { city?: string; iata?: string };
          return (
            <Link
              key={String(el.slug)}
              href={navHref(locale, `/empty-leg-recommendation/${el.slug}`)}
              className="jb-empty-card"
            >
              <span className="jb-discount-badge">
                {t(locale, 'discountOff', { n: String(el.discountPct) })}
              </span>
              <div className="jb-route-line" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AppIcon name="planeTakeoff" size="sm" aria-hidden />
                <span>{from?.city ?? from?.iata}</span>
                <AppIcon name="arrowRight" size="sm" aria-hidden />
                <AppIcon name="planeLanding" size="sm" aria-hidden />
                <span>{to?.city ?? to?.iata}</span>
              </div>
              <div className="jb-price">
                <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.8 }}>
                  {String(el.estimatedPriceLabel ?? 'Giá ước tính')}
                </span>
                USD {Number(el.price).toLocaleString()}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
