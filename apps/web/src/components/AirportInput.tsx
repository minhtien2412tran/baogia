'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
import { t } from '../lib/i18n';

type Airport = { iata: string; label: string; city: string; country?: string; name?: string };

function friendlyLabel(a: Pick<Airport, 'city' | 'country' | 'iata'>) {
  return `${a.city}, ${a.country ?? ''} (${a.iata})`.replace(',  ', ', ');
}

export function AirportInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  locale = 'en-us',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (iata: string, label?: string) => void;
  placeholder?: string;
  locale?: string;
}) {
  const [query, setQuery] = useState('');
  const [displayLabel, setDisplayLabel] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resolveLabel = useCallback(
    async (iata: string) => {
      if (!/^[A-Z]{3}$/.test(iata)) return;
      try {
        const res = await api.searchAirports(iata, locale);
        const match = res.airports.find((a) => a.iata === iata);
        if (match) {
          setDisplayLabel(friendlyLabel(match));
        }
      } catch {
        /* ignore */
      }
    },
    [locale],
  );

  useEffect(() => {
    if (!value) {
      setQuery('');
      setDisplayLabel(null);
      return;
    }
    if (/^[A-Z]{3}$/.test(value)) {
      void resolveLabel(value);
    }
  }, [value, resolveLabel]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  function applySearchResult(res: { airports: Airport[]; autoSelect?: string }) {
    setSuggestions(res.airports);
    setOpen(res.airports.length > 0);
    setNoResults(res.airports.length === 0);
    return res;
  }

  function runSearch(q: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setSuggestions([]);
      setNoResults(false);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      setNoResults(false);
      api
        .searchAirports(q.trim(), locale)
        .then(applySearchResult)
        .catch(() => {
          setSuggestions([]);
          setNoResults(true);
        })
        .finally(() => setLoading(false));
    }, 220);
  }

  function pick(a: Airport) {
    const friendly = friendlyLabel(a);
    setQuery(friendly);
    setDisplayLabel(friendly);
    onChange(a.iata, a.label);
    setOpen(false);
    setSuggestions([]);
    setNoResults(false);
  }

  function resolveFromResponse(res: { airports: Airport[]; autoSelect?: string }) {
    if (res.autoSelect) {
      const match = res.airports.find((a) => a.iata === res.autoSelect);
      if (match) {
        pick(match);
        return true;
      }
    }
    if (res.airports.length === 1) {
      pick(res.airports[0]);
      return true;
    }
    return false;
  }

  async function tryResolveOnBlur(currentQuery: string) {
    if (/^[A-Z]{3}$/.test(value)) return;
    const q = currentQuery.trim();
    if (q.length < 2) return;
    try {
      const res = await api.searchAirports(q, locale);
      resolveFromResponse(res);
    } catch {
      /* ignore */
    }
  }

  const inputValue = open ? query : (displayLabel ?? query);

  return (
    <div className="jb-field jb-airport-wrap" ref={wrapRef}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={inputValue}
        onChange={(e) => {
          const v = e.target.value;
          setQuery(v);
          setDisplayLabel(null);
          onChange('');
          runSearch(v);
        }}
        onFocus={() => {
          if (displayLabel) {
            setQuery(displayLabel);
            setDisplayLabel(null);
          }
          if (suggestions.length > 0) setOpen(true);
          else if (query.length >= 2) runSearch(query);
        }}
        onBlur={() => {
          window.setTimeout(() => {
            void tryResolveOnBlur(query);
          }, 180);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && open && suggestions.length > 0) {
            e.preventDefault();
            pick(suggestions[0]);
          }
        }}
        placeholder={placeholder}
        autoComplete="off"
        required
        aria-autocomplete="list"
        aria-controls={`${id}-listbox`}
        aria-expanded={open}
      />
      {loading && <span className="jb-airport-hint">{t(locale, 'airportSearching')}</span>}
      {!loading && noResults && query.length >= 2 && (
        <p className="jb-airport-empty">{t(locale, 'airportNoResults')}</p>
      )}
      {!loading && !value && query.length >= 2 && suggestions.length > 0 && !open && (
        <p className="jb-airport-hint jb-airport-hint--pick">{t(locale, 'airportPickHint')}</p>
      )}
      {open && suggestions.length > 0 && (
        <ul className="jb-airport-list" role="listbox" id={`${id}-listbox`}>
          {suggestions.map((a) => (
            <li key={a.iata} role="option">
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => pick(a)}>
                <span className="jb-airport-option-main">
                  <strong>{a.iata}</strong>
                  <span className="jb-airport-option-city">
                    {a.city}
                    {a.country ? ` · ${a.country}` : ''}
                  </span>
                </span>
                {a.name ? <span className="jb-airport-option-sub">{a.name}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
