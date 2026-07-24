import React from 'react';
import Image from 'next/image';
import { ArrowRight, Plane, Tag } from 'lucide-react';

const europeRoutes = [
  {
    id: 1,
    from: { code: 'LTN', city: 'London' },
    to: { code: 'LBG', city: 'Paris' },
    classes: [
      { name: 'Light Jets', price: 'USD 15,500', pax: 'Up to 8 passengers' },
      { name: 'Midsize to Heavy Jets', price: 'USD 32,000', pax: 'Up to 16 passengers' }
    ],
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    from: { code: 'LBG', city: 'Paris' },
    to: { code: 'LTN', city: 'London' },
    classes: [
      { name: 'Light Jets', price: 'USD 15,500', pax: 'Up to 8 passengers' },
      { name: 'Midsize to Heavy Jets', price: 'USD 32,000', pax: 'Up to 16 passengers' }
    ],
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    from: { code: 'LTN', city: 'London' },
    to: { code: 'NCE', city: 'Nice' },
    classes: [
      { name: 'Light Jets', price: 'USD 17,300', pax: 'Up to 8 passengers' },
      { name: 'Midsize to Heavy Jets', price: 'USD 40,250', pax: 'Up to 16 passengers' }
    ],
    image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 4,
    from: { code: 'NCE', city: 'Nice' },
    to: { code: 'LTN', city: 'London' },
    classes: [
      { name: 'Light Jets', price: 'USD 17,300', pax: 'Up to 8 passengers' },
      { name: 'Midsize to Heavy Jets', price: 'USD 40,250', pax: 'Up to 16 passengers' }
    ],
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 5,
    from: { code: 'LBG', city: 'Paris' },
    to: { code: 'NCE', city: 'Nice' },
    classes: [
      { name: 'Light Jets', price: 'USD 15,000', pax: 'Up to 8 passengers' },
      { name: 'Midsize to Heavy Jets', price: 'USD 38,000', pax: 'Up to 16 passengers' }
    ],
    image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 6,
    from: { code: 'NCE', city: 'Nice' },
    to: { code: 'LBG', city: 'Paris' },
    classes: [
      { name: 'Light Jets', price: 'USD 15,000', pax: 'Up to 8 passengers' },
      { name: 'Midsize to Heavy Jets', price: 'USD 38,000', pax: 'Up to 16 passengers' }
    ],
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop'
  }
];

const naRoutes = [
  {
    id: 7,
    from: { code: 'VNY', city: 'Los Angeles' },
    to: { code: 'LAS', city: 'Las Vegas' },
    classes: [
      { name: 'Light Jets', price: 'USD 13,800', pax: 'Up to 8 passengers' },
      { name: 'Midsize to Heavy Jets', price: 'USD 24,200', pax: 'Up to 16 passengers' }
    ],
    image: 'https://images.unsplash.com/photo-1470076892663-af684e5e15af?q=80&w=800&auto=format&fit=crop',
    tag: { label: 'Trending', color: 'bg-red-50 text-red-500' }
  },
  {
    id: 8,
    from: { code: 'LAS', city: 'Las Vegas' },
    to: { code: 'VNY', city: 'Los Angeles' },
    classes: [
      { name: 'Light Jets', price: 'USD 13,800', pax: 'Up to 8 passengers' },
      { name: 'Midsize to Heavy Jets', price: 'USD 24,200', pax: 'Up to 16 passengers' }
    ],
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop',
    tag: { label: 'Popular', color: 'bg-orange-50 text-orange-500' }
  },
  {
    id: 9,
    from: { code: 'TEB', city: 'New York' },
    to: { code: 'OPF', city: 'Miami' },
    classes: [
      { name: 'Light Jets', price: 'USD 19,550', pax: 'Up to 8 passengers' },
      { name: 'Midsize to Ultra-Long-Range Jets', price: 'USD 40,300', pax: 'Up to 16 passengers' }
    ],
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 10,
    from: { code: 'OPF', city: 'Miami' },
    to: { code: 'TEB', city: 'New York' },
    classes: [
      { name: 'Light Jets', price: 'USD 19,550', pax: 'Up to 8 passengers' },
      { name: 'Midsize to Ultra-Long-Range Jets', price: 'USD 40,300', pax: 'Up to 16 passengers' }
    ],
    image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 11,
    from: { code: 'TEB', city: 'New York' },
    to: { code: 'IAD', city: 'Washington' },
    classes: [
      { name: 'Light Jets', price: 'USD 12,000', pax: 'Up to 8 passengers' },
      { name: 'Midsize to Heavy Jets', price: 'USD 19,000', pax: 'Up to 16 passengers' }
    ],
    image: 'https://images.unsplash.com/photo-1617342938481-997870a4401a?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 12,
    from: { code: 'IAD', city: 'Washington' },
    to: { code: 'TEB', city: 'New York' },
    classes: [
      { name: 'Light Jets', price: 'USD 12,000', pax: 'Up to 8 passengers' },
      { name: 'Midsize to Heavy Jets', price: 'USD 19,000', pax: 'Up to 16 passengers' }
    ],
    image: 'https://images.unsplash.com/photo-1590053404758-c0b949bc546f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 13,
    from: { code: 'VNY', city: 'Los Angeles' },
    to: { code: 'SFO', city: 'San Francisco' },
    classes: [
      { name: 'Light Jets', price: 'USD 14,300', pax: 'Up to 8 passengers' },
      { name: 'Midsize to Heavy Jets', price: 'USD 27,600', pax: 'Up to 16 passengers' }
    ],
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 14,
    from: { code: 'SFO', city: 'San Francisco' },
    to: { code: 'VNY', city: 'Los Angeles' },
    classes: [
      { name: 'Light Jets', price: 'USD 14,300', pax: 'Up to 8 passengers' },
      { name: 'Midsize to Heavy Jets', price: 'USD 27,600', pax: 'Up to 16 passengers' }
    ],
    image: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 15,
    from: { code: 'HOU', city: 'Houston' },
    to: { code: 'DAL', city: 'Dallas' },
    classes: [
      { name: 'Light Jets', price: 'USD 14,800', pax: 'Up to 8 passengers' },
      { name: 'Midsize to Heavy Jets', price: 'USD 31,000', pax: 'Up to 16 passengers' }
    ],
    image: 'https://images.unsplash.com/photo-1531218150217-545f4bfcbb8a?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 16,
    from: { code: 'DAL', city: 'Dallas' },
    to: { code: 'HOU', city: 'Houston' },
    classes: [
      { name: 'Light Jets', price: 'USD 14,800', pax: 'Up to 8 passengers' },
      { name: 'Midsize to Heavy Jets', price: 'USD 31,000', pax: 'Up to 16 passengers' }
    ],
    image: 'https://images.unsplash.com/photo-1500645672807-7cb942eb1b9b?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 17,
    from: { code: 'AUS', city: 'Austin' },
    to: { code: 'DAL', city: 'Dallas' },
    classes: [
      { name: 'Light Jets', price: 'USD 13,000', pax: 'Up to 8 passengers' },
      { name: 'Midsize to Heavy Jets', price: 'USD 28,000', pax: 'Up to 16 passengers' }
    ],
    image: 'https://images.unsplash.com/photo-1531218150217-545f4bfcbb8a?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 18,
    from: { code: 'DAL', city: 'Dallas' },
    to: { code: 'AUS', city: 'Austin' },
    classes: [
      { name: 'Light Jets', price: 'USD 13,000', pax: 'Up to 8 passengers' },
      { name: 'Midsize to Heavy Jets', price: 'USD 28,000', pax: 'Up to 16 passengers' }
    ],
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop'
  }
];

const RouteCard = ({ route }: { route: any }) => {
  return (
    <div className="bg-white dark:bg-[#152033] rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_-12px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image Container */}
      <div className="relative w-full h-[220px] overflow-hidden">
        <Image src={route.image} alt={`${route.from.city} to ${route.to.city}`} fill className="object-cover" referrerPolicy="no-referrer" />
        {route.tag && (
          <div className={`absolute top-4 right-4 px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${route.tag.color}`}>
            {route.tag.label}
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Route Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col text-left">
            <span className="text-[24px] font-bold text-[#0B1F3A] dark:text-white leading-none mb-1">{route.from.code}</span>
            <span className="text-[12px] text-gray-500 font-medium">{route.from.city}</span>
          </div>
          
          <div className="flex-1 flex justify-center items-center px-4">
            <div className="w-6 h-6 rounded-full bg-[#E6F7F6] dark:bg-[#13B2A6]/10 flex items-center justify-center text-[#13B2A6]">
              <ArrowRight size={14} strokeWidth={2.5} />
            </div>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-[24px] font-bold text-[#0B1F3A] dark:text-white leading-none mb-1">{route.to.code}</span>
            <span className="text-[12px] text-gray-500 font-medium">{route.to.city}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 dark:bg-gray-800 mb-5"></div>

        {/* Classes */}
        <div className="flex flex-col gap-4">
          {route.classes.map((cls: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  {idx === 0 ? (
                    <div className="w-4 h-4 rounded-full bg-[#E6F7F6] text-[#13B2A6] text-[9px] flex items-center justify-center font-bold">L</div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-orange-50 text-orange-500 text-[9px] flex items-center justify-center font-bold">M</div>
                  )}
                  <span className="text-[12px] text-[#0B1F3A] dark:text-gray-300 font-medium">{cls.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-[#13B2A6]">{cls.price}</span>
                  <span className="text-[12px] text-gray-400">{cls.pax}</span>
                </div>
              </div>
              
              <button className="h-8 px-4 bg-[#E6F7F6] hover:bg-[#D5EFEB] dark:bg-[#13B2A6]/10 dark:hover:bg-[#13B2A6]/20 text-[#13B2A6] text-[12px] font-bold rounded transition-colors whitespace-nowrap">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import type { UiFixedRoute } from '@/lib/mappers';

function toCardRoute(r: UiFixedRoute) {
  return {
    id: r.id,
    from: r.from,
    to: r.to,
    image: r.image,
    classes: r.classes ?? [
      { name: 'Light Jets', price: `USD ${r.priceLight}`, pax: `Up to ${r.paxLight ?? 8} passengers` },
      {
        name: 'Midsize to Heavy Jets',
        price: `USD ${r.priceMid}`,
        pax: `Up to ${r.paxMid ?? 16} passengers`,
      },
    ],
  };
}

function regionMatch(region: string | undefined, needle: string) {
  if (!region) return false;
  return region.toLowerCase().includes(needle.toLowerCase());
}

export function FixedPriceRoutesGrid({
  routes,
  loadError,
}: {
  routes?: UiFixedRoute[];
  loadError?: string | null;
}) {
  const live = routes && routes.length > 0;
  const eu = live
    ? routes.filter((r) => regionMatch(r.region, 'europe') || regionMatch(r.region, 'eu')).map(toCardRoute)
    : europeRoutes;
  const na = live
    ? routes.filter((r) => regionMatch(r.region, 'america') || regionMatch(r.region, 'na')).map(toCardRoute)
    : naRoutes;
  const other = live
    ? routes
        .filter(
          (r) =>
            !regionMatch(r.region, 'europe') &&
            !regionMatch(r.region, 'eu') &&
            !regionMatch(r.region, 'america') &&
            !regionMatch(r.region, 'na'),
        )
        .map(toCardRoute)
    : [];

  const euList = eu.length ? eu : live ? [] : europeRoutes;
  const naList = na.length ? na : live ? [] : naRoutes;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-16 flex flex-col items-center">
      {loadError ? (
        <p className="mb-8 w-full text-[14px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
          Could not load live routes: {loadError}. Showing sample corridors.
        </p>
      ) : null}

      {live ? (
        <p className="mb-8 text-[13px] text-[#13B2A6] font-medium">Live from JetBay API · {routes.length} routes</p>
      ) : null}

      {(euList.length > 0 || !live) && (
        <div className="w-full flex flex-col items-center mb-24">
          <div className="px-4 py-1.5 bg-gray-50 border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 rounded-full flex items-center gap-2 mb-6">
            <Tag size={14} className="text-gray-500" />
            <span className="text-[12px] font-bold text-gray-600 dark:text-gray-300 tracking-wide uppercase">
              Premium Corridors
            </span>
          </div>
          <h2 className="text-[36px] md:text-[42px] font-bold text-[#0B1F3A] dark:text-white mb-4 tracking-[-0.02em]">
            Europe
          </h2>
          <p className="text-[16px] text-gray-500 text-center max-w-2xl mb-12">
            Linking financial capitals, cultural centers, and Mediterranean leisure destinations with seamless private
            access.
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(euList.length ? euList : europeRoutes).map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </div>
      )}

      {(naList.length > 0 || !live) && (
        <div className="w-full flex flex-col items-center mb-16">
          <div className="px-4 py-1.5 bg-[#E6F7F6]/50 border border-[#13B2A6]/20 dark:bg-[#13B2A6]/10 dark:border-[#13B2A6]/20 rounded-full flex items-center gap-2 mb-6">
            <Plane size={14} className="text-[#13B2A6]" />
            <span className="text-[12px] font-bold text-[#13B2A6] tracking-wide uppercase">Popular Routes</span>
          </div>
          <h2 className="text-[36px] md:text-[42px] font-bold text-[#0B1F3A] dark:text-white mb-4 tracking-[-0.02em]">
            North America
          </h2>
          <p className="text-[16px] text-gray-500 text-center max-w-2xl mb-12">
            Connecting major business hubs and high-demand executive corridors across the United States and Canada.
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(naList.length ? naList : naRoutes).map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </div>
      )}

      {other.length > 0 ? (
        <div className="w-full flex flex-col items-center mb-16">
          <h2 className="text-[36px] md:text-[42px] font-bold text-[#0B1F3A] dark:text-white mb-4 tracking-[-0.02em]">
            More Routes
          </h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {other.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
