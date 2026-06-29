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
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
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
    setQuery(a.iata);
    onChange(a.iata, a.label);
    setOpen(false);
  }

  return (
    <div className="jb-field jb-airport-wrap" ref={wrapRef}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={query}
        onChange={(e) => {
          const v = e.target.value.toUpperCase();
          setQuery(v);
          onChange(v);
          setOpen(true);
        }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        required
      />
      {loading && <span className="jb-airport-hint">Searching...</span>}
      {open && suggestions.length > 0 && (
        <ul className="jb-airport-list" role="listbox">
          {suggestions.map((a) => (
            <li key={a.iata}>
              <button type="button" onClick={() => pick(a)}>
                <strong>{a.iata}</strong> — {a.city}
                <span>{a.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
