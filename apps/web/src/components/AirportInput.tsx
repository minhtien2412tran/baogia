'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { api } from '../lib/api';
import { t } from '../lib/i18n';

type Airport = { iata: string; label: string; city: string; country?: string; name?: string };

function friendlyLabel(a: Pick<Airport, 'city' | 'country' | 'iata'>) {
  return `${a.city}, ${a.country ?? ''} (${a.iata})`.replace(',  ', ', ');
}

export function AirportInput({
  id: idProp,
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
  const reactId = useId();
  const id = idProp || `airport-${reactId}`;
  const listboxId = `${id}-listbox`;
  const statusId = `${id}-status`;

  const [query, setQuery] = useState('');
  const [displayLabel, setDisplayLabel] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [resolveError, setResolveError] = useState<string | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchSeq = useRef(0);
  const resolveSeq = useRef(0);
  const resolveCache = useRef<Map<string, string>>(new Map());
  const lastResolvedIata = useRef<string | null>(null);

  const resolveLabel = useCallback(async (iata: string) => {
    if (!/^[A-Z]{3}$/.test(iata)) return;
    if (lastResolvedIata.current === iata) return;
    const cached = resolveCache.current.get(iata);
    if (cached) {
      lastResolvedIata.current = iata;
      setDisplayLabel(cached);
      return;
    }

    const seq = ++resolveSeq.current;
    try {
      const res = await api.searchAirports(iata, locale);
      if (seq !== resolveSeq.current) return;
      const match = res.airports.find((a) => a.iata === iata);
      if (match) {
        const friendly = friendlyLabel(match);
        resolveCache.current.set(iata, friendly);
        lastResolvedIata.current = iata;
        setDisplayLabel(friendly);
        setResolveError(null);
      }
    } catch {
      if (seq !== resolveSeq.current) return;
      setResolveError(t(locale, 'airportNoResults'));
    }
  }, [locale]);

  useEffect(() => {
    if (!value) {
      lastResolvedIata.current = null;
      queueMicrotask(() => {
        setQuery('');
        setDisplayLabel(null);
      });
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
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      searchSeq.current += 1;
      resolveSeq.current += 1;
    };
  }, []);

  function applySearchResult(res: { airports: Airport[]; autoSelect?: string }, seq: number) {
    if (seq !== searchSeq.current) return;
    setSuggestions(res.airports);
    setOpen(res.airports.length > 0);
    setNoResults(res.airports.length === 0);
    setActiveIndex(res.airports.length > 0 ? 0 : -1);
  }

  function runSearch(q: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setSuggestions([]);
      setNoResults(false);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const seq = ++searchSeq.current;
      setLoading(true);
      setNoResults(false);
      api
        .searchAirports(q.trim(), locale)
        .then((res) => applySearchResult(res, seq))
        .catch(() => {
          if (seq !== searchSeq.current) return;
          setSuggestions([]);
          setNoResults(true);
          setOpen(false);
          setActiveIndex(-1);
        })
        .finally(() => {
          if (seq === searchSeq.current) setLoading(false);
        });
    }, 220);
  }

  function pick(a: Airport) {
    const friendly = friendlyLabel(a);
    resolveCache.current.set(a.iata, friendly);
    lastResolvedIata.current = a.iata;
    setQuery(friendly);
    setDisplayLabel(friendly);
    onChange(a.iata, a.label);
    setOpen(false);
    setSuggestions([]);
    setNoResults(false);
    setActiveIndex(-1);
    setResolveError(null);
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
      pick(res.airports[0]!);
      return true;
    }
    return false;
  }

  async function tryResolveOnBlur(currentQuery: string) {
    if (/^[A-Z]{3}$/.test(value)) return;
    const q = currentQuery.trim();
    if (q.length < 2) return;
    const seq = ++resolveSeq.current;
    try {
      const res = await api.searchAirports(q, locale);
      if (seq !== resolveSeq.current) return;
      resolveFromResponse(res);
    } catch {
      if (seq !== resolveSeq.current) return;
      setResolveError(t(locale, 'airportNoResults'));
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      if (open) {
        e.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
      }
      return;
    }
    if (!open || suggestions.length === 0) {
      if (e.key === 'ArrowDown' && suggestions.length > 0) {
        e.preventDefault();
        setOpen(true);
        setActiveIndex(0);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
      return;
    }
    if (e.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      e.preventDefault();
      pick(suggestions[activeIndex]!);
    }
  }

  const inputValue = open ? query : (displayLabel ?? query);
  const activeOptionId =
    open && activeIndex >= 0 && suggestions[activeIndex]
      ? `${id}-option-${suggestions[activeIndex]!.iata}`
      : undefined;

  return (
    <div className="jb-field jb-airport-wrap" ref={wrapRef}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        role="combobox"
        value={inputValue}
        onChange={(e) => {
          const v = e.target.value;
          setQuery(v);
          setDisplayLabel(null);
          lastResolvedIata.current = null;
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
          // Defer so option mousedown/click can run first
          window.setTimeout(() => {
            void tryResolveOnBlur(query);
          }, 180);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        required
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        aria-activedescendant={activeOptionId}
        aria-describedby={statusId}
      />
      <div id={statusId} className="jb-airport-status" aria-live="polite">
        {loading ? t(locale, 'airportSearching') : null}
        {!loading && noResults && query.length >= 2 ? t(locale, 'airportNoResults') : null}
        {resolveError && !loading ? resolveError : null}
        {!loading && !value && query.length >= 2 && suggestions.length > 0 && !open
          ? t(locale, 'airportPickHint')
          : null}
      </div>
      {open && suggestions.length > 0 ? (
        <ul className="jb-airport-list" role="listbox" id={listboxId}>
          {suggestions.map((a, idx) => {
            const optionId = `${id}-option-${a.iata}`;
            const selected = activeIndex === idx;
            return (
              <li
                key={a.iata}
                id={optionId}
                role="option"
                aria-selected={selected || value === a.iata}
                className={selected ? 'jb-airport-option--active' : undefined}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(a)}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <span className="jb-airport-option-main">
                  <strong>{a.iata}</strong>
                  <span className="jb-airport-option-city">
                    {a.city}
                    {a.country ? ` · ${a.country}` : ''}
                  </span>
                </span>
                {a.name ? <span className="jb-airport-option-sub">{a.name}</span> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
