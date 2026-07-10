'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';

type Airport = { iata: string; label: string; city: string };

export function AirportInput({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (iata: string, label?: string) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState(value);
  const [displayLabel, setDisplayLabel] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
    if (!value) {
      setDisplayLabel(null);
      return;
    }
    if (value.length === 3 && /^[A-Z]{3}$/.test(value)) {
      api
        .searchAirports(value)
        .then((res) => {
          const match = res.airports.find((a) => a.iata === value);
          if (match) setDisplayLabel(`${match.city} (${match.iata})`);
        })
        .catch(() => undefined);
    }
  }, [value]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(() => {
      setLoading(true);
      api
        .searchAirports(query)
        .then((res) => {
          setSuggestions(res.airports);
          setOpen(res.airports.length > 0);
        })
        .catch(() => setSuggestions([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  function pick(a: Airport) {
    const friendly = `${a.city} (${a.iata})`;
    setQuery(friendly);
    setDisplayLabel(friendly);
    onChange(a.iata, a.label);
    setOpen(false);
    setSuggestions([]);
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
          const iataOnly = v.toUpperCase().replace(/[^A-Z]/g, '');
          if (!v.trim()) {
            onChange('');
          } else if (iataOnly.length === 3 && v.trim().length === 3) {
            onChange(iataOnly);
          }
          setOpen(true);
        }}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true);
          if (displayLabel) {
            setQuery(displayLabel);
            setDisplayLabel(null);
          }
        }}
        placeholder={placeholder}
        autoComplete="off"
        required
      />
      {loading && <span className="jb-airport-hint">Searching...</span>}
      {open && suggestions.length > 0 && (
        <ul className="jb-airport-list" role="listbox" id={`${id}-listbox`}>
          {suggestions.map((a) => (
            <li key={a.iata} role="option">
              <button type="button" onClick={() => pick(a)}>
                <span className="jb-airport-option-main">
                  <strong>{a.iata}</strong>
                  <span className="jb-airport-option-city">{a.city}</span>
                </span>
                <span className="jb-airport-option-sub">{a.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
