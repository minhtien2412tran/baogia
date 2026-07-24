'use client';

import { useEffect, useRef, useState } from 'react';
import { api, type AirportHit } from '@/lib/api';

function friendlyLabel(a: Pick<AirportHit, 'city' | 'country' | 'iata'>) {
  return `${a.city}${a.country ? `, ${a.country}` : ''} (${a.iata})`;
}

export function AirportTypeahead({
  id,
  value,
  onChange,
  placeholder,
  icon,
  className = '',
  inputClassName = '',
}: {
  id: string;
  value: string;
  onChange: (iata: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  inputClassName?: string;
}) {
  const [query, setQuery] = useState('');
  const [display, setDisplay] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AirportHit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!value) {
      setQuery('');
      setDisplay(null);
    }
  }, [value]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  function runSearch(q: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.searchAirports(q.trim());
        setSuggestions(res.airports);
        setOpen(res.airports.length > 0);
        if (res.autoSelect) {
          const hit = res.airports.find((a) => a.iata === res.autoSelect);
          if (hit) {
            onChange(hit.iata);
            setDisplay(friendlyLabel(hit));
            setQuery('');
            setOpen(false);
          }
        }
      } catch {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 280);
  }

  return (
    <div ref={wrapRef} className={`relative w-full ${className}`}>
      {icon ? <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">{icon}</div> : null}
      <input
        id={id}
        type="text"
        autoComplete="off"
        value={display ?? query}
        placeholder={placeholder}
        onChange={(e) => {
          setDisplay(null);
          onChange('');
          setQuery(e.target.value);
          runSearch(e.target.value);
        }}
        onFocus={() => {
          if (suggestions.length) setOpen(true);
        }}
        className={inputClassName}
      />
      {loading ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">…</span>
      ) : null}
      {open && suggestions.length > 0 ? (
        <ul className="absolute left-0 right-0 top-full mt-1 z-50 max-h-56 overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#152033] shadow-lg">
          {suggestions.map((a) => (
            <li key={a.iata}>
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 text-[13px] text-[#0B1F3A] dark:text-white hover:bg-[#E6F8F7] dark:hover:bg-[#1A3B37]"
                onClick={() => {
                  onChange(a.iata);
                  setDisplay(friendlyLabel(a));
                  setQuery('');
                  setOpen(false);
                }}
              >
                <span className="font-semibold">{a.iata}</span>
                <span className="text-gray-500 dark:text-gray-400"> — {friendlyLabel(a)}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
