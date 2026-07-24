'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowDownUp, Bell, ChevronDown } from 'lucide-react';
import type { UiEmptyLeg } from '@/lib/mappers';
import { REGION_CONTINENT } from '@/lib/mappers';
import { EmptyLegAlertsBox } from '@/components/EmptyLegAlertsBox';

const regions = Object.keys(REGION_CONTINENT);

export function EmptyLegsLiveDeals({
  deals,
  loadError,
}: {
  deals: UiEmptyLeg[];
  loadError?: string | null;
}) {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = useMemo(() => {
    const code = REGION_CONTINENT[activeTab];
    if (!code) return deals;
    return deals.filter((d) => (d.continent || '').toUpperCase() === code);
  }, [activeTab, deals]);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-16">
      <h2 className="text-[28px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white mb-6">
        Live Empty Leg Deals
      </h2>

      {loadError ? (
        <p className="mb-6 text-[14px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
          Could not load live empty legs: {loadError}
        </p>
      ) : null}

      <div className="w-full overflow-x-auto no-scrollbar mb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center min-w-max">
          {regions.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setActiveTab(region)}
              className={`px-4 py-3 text-[14px] font-medium transition-colors relative ${
                activeTab === region
                  ? 'text-[#13B2A6]'
                  : 'text-gray-500 hover:text-[#0B1F3A] dark:hover:text-gray-300'
              }`}
            >
              {region}
              {activeTab === region ? (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#13B2A6]" />
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="text-[14px] font-medium text-gray-500 dark:text-gray-400">
          <span className="text-[#13B2A6] font-bold">{filtered.length}</span> live deals
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 text-[14px] font-medium text-gray-500 hover:text-[#0B1F3A] dark:hover:text-white transition-colors"
        >
          <ArrowDownUp size={16} /> Sort by Price
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="mb-12 text-[14px] text-gray-500">No empty legs in this region right now.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filtered.map((deal) => (
            <div
              key={deal.id}
              className="bg-white dark:bg-[#152033] rounded-[16px] border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full h-[200px] overflow-hidden">
                <Image
                  src={deal.image}
                  alt="Aircraft"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  unoptimized
                />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6 relative">
                  <div className="flex flex-col w-[45%] text-left">
                    <span className="text-[15px] font-bold text-[#0B1F3A] dark:text-white mb-1 truncate">
                      {deal.fromCity}
                    </span>
                    <span className="text-[12px] text-gray-400 truncate">{deal.fromCountry}</span>
                  </div>

                  <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#E6F7F6] dark:bg-[#13B2A6]/10 flex items-center justify-center text-[#13B2A6]">
                    <ArrowRight size={12} strokeWidth={2.5} />
                  </div>

                  <div className="flex flex-col w-[45%] text-right">
                    <span className="text-[15px] font-bold text-[#0B1F3A] dark:text-white mb-1 truncate">
                      {deal.toCity}
                    </span>
                    <span className="text-[12px] text-gray-400 truncate">{deal.toCountry}</span>
                  </div>
                </div>

                <div className="w-full h-px bg-gray-100 dark:bg-gray-800 mb-5" />

                <div className="flex items-center justify-between">
                  <span className="text-[#F5B041] text-[15px] font-bold">
                    {deal.price === 'On request' ? 'Enquire for Price' : `USD ${deal.price}`}
                  </span>
                  <button
                    type="button"
                    className="h-[36px] px-6 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 text-[#0B1F3A] dark:text-white text-[13px] font-bold rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="w-full flex justify-center mb-16">
        <button
          type="button"
          className="h-[44px] px-8 bg-white dark:bg-[#152033] border border-gray-300 dark:border-gray-700 text-[#0B1F3A] dark:text-white text-[14px] font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
        >
          View More <ChevronDown size={16} />
        </button>
      </div>

      <div className="w-full bg-[#F8FAFC] dark:bg-[#0B1121] rounded-[24px] border border-gray-100 dark:border-gray-800 p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-[#152033] flex items-center justify-center border border-gray-100 dark:border-gray-700">
            <Bell size={20} className="text-[#13B2A6]" />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-[#0B1F3A] dark:text-white">New Deals Disappear Fast</h3>
            <p className="text-[14px] text-gray-500">
              (Get empty leg alerts for your region the moment they go live.)
            </p>
          </div>
          <span className="ml-auto text-gray-400">
            <ChevronDown size={24} className="rotate-180" />
          </span>
        </div>

        <EmptyLegAlertsBox variant="page" />
      </div>
    </div>
  );
}
