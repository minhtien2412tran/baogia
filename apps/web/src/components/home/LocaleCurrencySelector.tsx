'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'vi', label: 'VI' },
];

const CURRENCIES = ['USD', 'EUR', 'GBP'] as const;

export function LocaleCurrencySelector({
  locale,
  currency,
}: {
  locale: string;
  currency: string;
}) {
  const router = useRouter();
  const [cur, setCur] = useState(currency);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jta_currency', cur);
    }
  }, [cur]);

  function changeLocale(code: string) {
    if (code === locale) return;
    const path = window.location.pathname.replace(/^\/[^/]+/, `/${code}`);
    router.push(path + window.location.search);
  }

  return (
    <div className="jb-locale-currency jb-hide-mobile">
      <select
        className="jb-select-mini"
        value={locale}
        onChange={(e) => changeLocale(e.target.value)}
        aria-label="Language"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
      <span className="jb-lc-sep">·</span>
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
    </div>
  );
}
