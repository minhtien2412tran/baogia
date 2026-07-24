'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  PlaneTakeoff,
  PlaneLanding,
  Calendar,
  Minus,
  Plus,
  ArrowRightLeft,
} from 'lucide-react';
import { api, parseApiErrorMessage, type AircraftSearchOption } from '@/lib/api';
import { AirportTypeahead } from '@/components/AirportTypeahead';

type TripType = 'ONE_WAY' | 'ROUND_TRIP' | 'MULTI_CITY';

function todayIso() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function Hero() {
  const [tripType, setTripType] = useState<TripType>('ONE_WAY');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(todayIso());
  const [pax, setPax] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AircraftSearchOption[] | null>(null);
  const [searchId, setSearchId] = useState<string | null>(null);

  async function onSearch() {
    setError(null);
    setResults(null);
    setSearchId(null);
    if (!from || !to) {
      setError('Select departure and destination airports (IATA).');
      return;
    }
    if (!date) {
      setError('Pick a departure date.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.searchAircraft({
        tripType,
        locale: 'en',
        currency: 'USD',
        legs: [
          {
            fromAirport: from,
            toAirport: to,
            departureDate: date,
            passengers: pax,
          },
        ],
      });
      setResults(res.options);
      setSearchId(res.searchId);
      if (!res.options.length) setError('No aircraft options for this route yet.');
    } catch (err) {
      setError(parseApiErrorMessage(err, 'Search failed'));
    } finally {
      setLoading(false);
    }
  }

  const tabBtn = (key: TripType, label: string) => (
    <button
      type="button"
      onClick={() => setTripType(key)}
      className={
        tripType === key
          ? 'px-5 py-2 bg-[#E6F8F7] dark:bg-[#1A3B37] text-[#13B2A6] dark:text-[#40DACD] text-[14px] font-medium rounded-full'
          : 'text-gray-600 dark:text-gray-300 text-[14px] font-medium hover:text-gray-900 dark:hover:text-white transition-colors'
      }
    >
      {label}
    </button>
  );

  return (
    <div className="px-4 lg:px-6 pt-4 lg:pt-6 mb-24 w-full flex flex-col items-center">
      <section className="relative w-full h-[350px] lg:h-[460px] flex flex-col items-center justify-center rounded-[24px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://picsum.photos/seed/tropicaljet/1920/1080"
            alt="Private Jet over ocean"
            fill
            className="object-cover object-[center_70%]"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 text-center text-white px-4 w-full max-w-5xl -mt-16">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.1] mb-5">
            Global Private Jet Charter: Access to <br className="hidden md:block" />
            10,000+ Aircraft
          </h1>
          <p className="text-lg md:text-xl text-white/95 font-medium mb-10">
            Seamless, trusted access to private aviation worldwide.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8 text-[13px] lg:text-[15px] font-medium text-white">
            <div className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[#40DACD]"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Secure Payment
            </div>
            <div className="w-px h-4 bg-white/50 hidden md:block" />
            <div className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[#40DACD]"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              24/7 Global Concierge Support
            </div>
            <div className="w-px h-4 bg-white/50 hidden md:block" />
            <div className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[#40DACD]"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Premium Aircraft
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-20 w-full max-w-[1440px] -mt-12 lg:-mt-20 bg-white dark:bg-[#152033] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 lg:p-8 text-gray-900 dark:text-white">
        <div className="flex items-center gap-6 mb-8 px-2">
          {tabBtn('ONE_WAY', 'One-way')}
          {tabBtn('ROUND_TRIP', 'Round-Trip')}
          {tabBtn('MULTI_CITY', 'Multi-City')}
        </div>

        <div className="flex flex-col lg:flex-row items-end gap-3 lg:gap-4 mb-6 relative w-full">
          <div className="flex-[1.2] w-full">
            <span className="text-[13px] text-gray-800 dark:text-gray-300 font-medium block mb-2">From</span>
            <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-lg p-3.5 bg-white dark:bg-[#152033]">
              <PlaneTakeoff className="text-gray-600 dark:text-gray-400 shrink-0" size={18} strokeWidth={2} />
              <AirportTypeahead
                id="hero-from"
                value={from}
                onChange={setFrom}
                placeholder="From"
                inputClassName="outline-none text-[14px] text-gray-900 dark:text-white bg-transparent w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium"
              />
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center pb-3">
            <ArrowRightLeft size={16} className="text-[#13B2A6] dark:text-[#40DACD]" strokeWidth={2.5} />
          </div>

          <div className="flex-[1.2] w-full">
            <span className="text-[13px] text-gray-800 dark:text-gray-300 font-medium block mb-2">To</span>
            <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-lg p-3.5 bg-white dark:bg-[#152033]">
              <PlaneLanding className="text-gray-600 dark:text-gray-400 shrink-0" size={18} strokeWidth={2} />
              <AirportTypeahead
                id="hero-to"
                value={to}
                onChange={setTo}
                placeholder="To"
                inputClassName="outline-none text-[14px] text-gray-900 dark:text-white bg-transparent w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium"
              />
            </div>
          </div>

          <div className="flex-1 w-full">
            <span className="text-[13px] text-gray-800 dark:text-gray-300 font-medium block mb-2">
              Departure (Local)
            </span>
            <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-lg p-3.5 bg-white dark:bg-[#152033]">
              <Calendar className="text-gray-600 dark:text-gray-400 shrink-0" size={18} strokeWidth={2} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="outline-none text-[14px] text-gray-900 dark:text-white bg-transparent w-full font-medium"
              />
            </div>
          </div>

          <div className="flex-1 w-full">
            <span className="text-[13px] text-gray-800 dark:text-gray-300 font-medium block mb-2">
              Passengers
            </span>
            <div className="flex items-center justify-between w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3.5 bg-white dark:bg-[#152033]">
              <button
                type="button"
                aria-label="Decrease passengers"
                onClick={() => setPax((n) => Math.max(1, n - 1))}
                className="w-5 h-5 rounded-full border border-gray-900 dark:border-gray-300 flex items-center justify-center text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A364D] transition-colors"
              >
                <Minus size={12} strokeWidth={2.5} />
              </button>
              <span className="text-[14px] font-medium text-gray-900 dark:text-white">{pax}</span>
              <button
                type="button"
                aria-label="Increase passengers"
                onClick={() => setPax((n) => Math.min(16, n + 1))}
                className="w-5 h-5 rounded-full border border-gray-900 dark:border-gray-300 flex items-center justify-center text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A364D] transition-colors"
              >
                <Plus size={12} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void onSearch()}
          disabled={loading}
          className="w-full bg-[#40DACD] hover:bg-[#34C4B8] disabled:opacity-60 text-[#050505] font-medium py-3.5 rounded-lg transition-colors text-[15px] shadow-sm flex items-center justify-center"
        >
          {loading ? 'Searching…' : 'Search Available Aircraft'}
        </button>

        {error ? (
          <p className="mt-4 text-[13px] text-red-500" role="alert">
            {error}
          </p>
        ) : null}

        {results && results.length > 0 ? (
          <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-5">
            <p className="text-[13px] text-gray-500 mb-3">
              {results.length} option{results.length === 1 ? '' : 's'}
              {searchId ? ` · search ${searchId.slice(0, 8)}` : ''}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {results.slice(0, 6).map((opt) => (
                <li
                  key={`${opt.categoryId}-${opt.aircraftModel}-${opt.estimatedPrice}`}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div className="font-semibold text-[15px] text-[#0B1F3A] dark:text-white">
                    {opt.aircraftModel || opt.categoryLabel}
                  </div>
                  <div className="text-[13px] text-gray-500 mt-1">
                    {opt.categoryLabel} · up to {opt.maxPassengers} pax
                    {opt.operatorName ? ` · ${opt.operatorName}` : ''}
                  </div>
                  <div className="text-[#F5B041] font-bold text-[16px] mt-2">
                    {opt.currency || 'USD'} {Number(opt.estimatedPrice).toLocaleString('en-US')}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
