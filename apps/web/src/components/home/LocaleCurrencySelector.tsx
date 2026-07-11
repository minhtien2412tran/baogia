'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LOCALES, LOCALE_COOKIE } from '../../config/locales';
import { tn } from '@jetbay/i18n';

export function LanguagePicker({ locale, className = '' }: { locale: string; className?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LOCALES;
    return LOCALES.filter(
      (l) =>
        l.label.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        l.htmlLang.toLowerCase().includes(q) ||
        l.dbLocale.includes(q),
    );
  }, [query]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  function changeLocale(code: string) {
    if (code === locale) {
      setOpen(false);
      return;
    }
    document.cookie = `${LOCALE_COOKIE}=${code};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    const path = window.location.pathname.replace(/^\/[^/]+/, `/${code}`);
    router.push(path + window.location.search);
    setOpen(false);
    setQuery('');
  }

  return (
    <div className={`jb-lang-picker ${className}${open ? ' open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="jb-lang-picker__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={tn(locale, 'selectLanguage')}
      >
        <span className="jb-lang-picker__globe" aria-hidden>🌐</span>
        <span className="jb-lang-picker__label">{current.label}</span>
        <span className="jb-lang-picker__chev" aria-hidden>▾</span>
      </button>

      {open && (
        <div className="jb-lang-picker__panel" role="listbox">
          <input
            type="search"
            className="jb-lang-picker__search"
            placeholder={tn(locale, 'searchLanguage')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <ul className="jb-lang-picker__list">
            {filtered.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={l.code === locale}
                  className={`jb-lang-picker__option${l.code === locale ? ' active' : ''}`}
                  onClick={() => changeLocale(l.code)}
                >
                  <span className="jb-lang-picker__option-label">{l.label}</span>
                  <span className="jb-lang-picker__option-meta">{l.htmlLang} · {l.currency}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="jb-lang-picker__empty">{tn(locale, 'noLanguageMatch')}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CNY', 'HKD'] as const;

export function CurrencySelector({ locale, currency }: { locale: string; currency: string }) {
  const [cur, setCur] = useState(currency);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jta_currency');
      if (saved) setCur(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('jta_currency', cur);
  }, [cur]);

  return (
    <select
      className="jb-select-mini"
      value={cur}
      onChange={(e) => setCur(e.target.value)}
      aria-label="Currency"
    >
      {CURRENCIES.map((c) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  );
}

export function LocaleCurrencySelector({
  locale,
  currency,
}: {
  locale: string;
  currency: string;
}) {
  return (
    <div className="jb-locale-currency">
      <LanguagePicker locale={locale} />
      <span className="jb-lc-sep">·</span>
      <CurrencySelector locale={locale} currency={currency} />
    </div>
  );
}
