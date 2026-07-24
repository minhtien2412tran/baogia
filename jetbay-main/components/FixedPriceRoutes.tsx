import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, MoveDown } from 'lucide-react';
import type { UiFixedRoute } from '@/lib/mappers';

export function FixedPriceRoutes({
  routes,
  loadError,
}: {
  routes: UiFixedRoute[];
  loadError?: string | null;
}) {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-[32px] md:text-[38px] lg:text-[42px] font-bold text-[#0B1F3A] dark:text-white mb-2 tracking-[-0.02em] leading-[1.15]">
            Fixed-Price Charter Routes
          </h2>
          <p className="text-[#4A4A4A] dark:text-gray-400 text-[15px]">
            Experience price certainty on our most requested global routes.
          </p>
        </div>
        <Link
          href="/fixed-price-charter"
          className="flex items-center gap-1 text-[14px] font-semibold text-[#0B1F3A] dark:text-white hover:text-gray-600 transition-colors mb-2"
        >
          View All Fixed-Price Routes <ChevronRight size={18} strokeWidth={2.5} />
        </Link>
      </div>

      {loadError ? (
        <p className="mb-6 text-[14px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
          Could not load live routes: {loadError}
        </p>
      ) : null}

      {!loadError && routes.length === 0 ? (
        <p className="text-[14px] text-gray-500">No fixed-price routes available.</p>
      ) : null}

      {routes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {routes.slice(0, 6).map((route) => (
            <div
              key={route.id}
              className="group bg-white dark:bg-[#152033] rounded-[16px] border border-[#E2E8F0] dark:border-gray-800 hover:border-transparent p-5 flex flex-col sm:flex-row gap-6 lg:gap-10 relative overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {route.image ? (
                  <Image src={route.image} alt={route.to.city} fill className="object-cover" unoptimized />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-r from-[#065561]/95 via-[#065561]/80 to-transparent z-10" />
              </div>

              <div className="relative z-20 w-[80px] lg:w-[90px] flex flex-col justify-center text-left">
                <div className="text-[28px] font-bold text-[#0B1F3A] group-hover:text-white dark:text-white leading-[1.1] transition-colors">
                  {route.from.code}
                </div>
                <div className="text-[13px] text-[#64748B] group-hover:text-gray-300 mt-0.5 mb-1.5 transition-colors">
                  {route.from.city}
                </div>
                <div className="text-[#94A3B8] group-hover:text-gray-400 my-0.5 transition-colors">
                  <MoveDown size={16} strokeWidth={2} />
                </div>
                <div className="text-[28px] font-bold text-[#0B1F3A] group-hover:text-white dark:text-white leading-[1.1] mt-1.5 transition-colors">
                  {route.to.code}
                </div>
                <div className="text-[13px] text-[#64748B] group-hover:text-gray-300 mt-0.5 transition-colors">
                  {route.to.city}
                </div>
              </div>

              <div className="relative z-20 flex-1 flex flex-col justify-center gap-3 group-hover:gap-3.5 group-hover:py-1 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 px-4 border border-[#E2E8F0] group-hover:border-transparent group-hover:p-0 group-hover:pb-3.5 group-hover:border-b group-hover:border-white/20 dark:border-gray-700 rounded-[10px] group-hover:rounded-none transition-all duration-300">
                  <div className="flex flex-col mb-2 sm:mb-0">
                    <div className="text-[13px] text-[#475569] group-hover:text-white font-medium dark:text-gray-400 mb-0.5 transition-colors">
                      Light Jets
                    </div>
                    <div className="text-[14px]">
                      <span className="font-bold text-[#F5B041]">
                        {route.priceLight === 'On request' ? route.priceLight : `USD ${route.priceLight}`}
                      </span>
                      <span className="text-[#94A3B8] group-hover:text-gray-300 mx-2 transition-colors">•</span>
                      <span className="text-[#64748B] group-hover:text-white font-medium transition-colors">
                        Up to {route.paxLight ?? 8} passengers
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/fixed-price-charter"
                    className="font-bold text-[14px] text-[#13B2A6] dark:text-[#40DACD] hover:opacity-80 transition-opacity"
                  >
                    Book Now
                  </Link>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 px-4 border border-[#E2E8F0] group-hover:border-transparent group-hover:p-0 group-hover:pt-1 dark:border-gray-700 rounded-[10px] group-hover:rounded-none transition-all duration-300">
                  <div className="flex flex-col mb-2 sm:mb-0">
                    <div className="text-[13px] text-[#475569] group-hover:text-white font-medium dark:text-gray-400 mb-0.5 transition-colors">
                      Midsize to Heavy Jets
                    </div>
                    <div className="text-[14px]">
                      <span className="font-bold text-[#F5B041]">
                        {route.priceMid === 'On request' ? route.priceMid : `USD ${route.priceMid}`}
                      </span>
                      <span className="text-[#94A3B8] group-hover:text-gray-300 mx-2 transition-colors">•</span>
                      <span className="text-[#64748B] group-hover:text-white font-medium transition-colors">
                        Up to {route.paxMid ?? 16} passengers
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/fixed-price-charter"
                    className="font-bold text-[14px] text-[#13B2A6] dark:text-[#40DACD] hover:opacity-80 transition-opacity"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
