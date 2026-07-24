import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, CreditCard } from 'lucide-react';
import type { UiJetPlan } from '@/lib/mappers';

const SlantedShape = ({ className }: { className?: string }) => (
  <svg width="26" height="14" viewBox="0 0 26 14" fill="none" className={className}>
    <path d="M5 0h6l-5 14H0l5-14z" fill="currentColor" fillOpacity="0.5" />
    <path d="M15 0h8l-5 14h-8l5-14z" fill="currentColor" />
  </svg>
);

const ACCENT: Record<
  UiJetPlan['accent'],
  { card: string; curve: string; shape: string; highlight: string }
> = {
  white: {
    card: 'bg-[#1A1A1C]',
    curve: 'bg-[#0A0A0A]',
    shape: 'text-white opacity-95',
    highlight: 'from-white/[0.05]',
  },
  gold: {
    card: 'bg-[#1C1A16]',
    curve: 'bg-[#0C0B09]',
    shape: 'text-[#E4B351]',
    highlight: 'from-[#E4B351]/[0.08]',
  },
  blue: {
    card: 'bg-[#181920]',
    curve: 'bg-[#0B0C10]',
    shape: 'text-[#D8DFEE]',
    highlight: 'from-[#A6BCED]/[0.08]',
  },
};

export function JetCard({
  plans,
  loadError,
}: {
  plans: UiJetPlan[];
  loadError?: string | null;
}) {
  const display =
    plans.length > 0
      ? plans.slice(0, 3)
      : ([
          {
            id: 'fallback-10',
            name: '10 Hour Jet Card',
            hours: 10,
            bullets: ['Occasional private flyers', 'Flexibility without long-term commitment'],
            accent: 'white',
          },
          {
            id: 'fallback-25',
            name: '25 Hour Jet Card',
            hours: 25,
            bullets: ['Business travellers & executives', 'Lower hourly rates, priority booking'],
            accent: 'gold',
          },
          {
            id: 'fallback-50',
            name: '50 Hour Jet Card',
            hours: 50,
            bullets: ['Frequent global travellers', 'Best value, ultimate convenience'],
            accent: 'blue',
          },
        ] as UiJetPlan[]);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-24 font-sans">
      {loadError ? (
        <p className="mb-4 text-[13px] text-amber-700 dark:text-amber-400">
          Live Jet Card plans unavailable ({loadError}). Showing membership overview.
        </p>
      ) : null}
      <div className="relative rounded-[16px] overflow-hidden bg-[#050505] min-h-[480px] flex flex-col lg:flex-row shadow-2xl">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=1400&auto=format&fit=crop"
            alt="Jet Card Background"
            fill
            className="object-cover opacity-[0.55]"
            unoptimized
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/80 to-transparent w-[65%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#000000]/20 to-transparent" />

        <div className="relative z-10 w-full lg:w-[35%] p-8 lg:p-10 xl:p-12 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-[#1C150D]/60 border border-[#8C7454]/60 text-[#DAB059] px-3.5 py-1.5 rounded-full text-[12px] font-medium w-max mb-5">
            <CreditCard size={14} strokeWidth={1.5} />
            Jet Card
          </div>

          <h2 className="text-[28px] md:text-[34px] lg:text-[36px] font-bold text-white mb-6 leading-[1.08] tracking-[-0.02em]">
            Elevate Your Travel
            <br />
            with The Jetbay Jet
            <br />
            Card
          </h2>

          <Link
            href="/jet-card"
            className="bg-[#E4B351] hover:bg-[#D1A649] text-[#000000] px-6 py-2.5 rounded-[4px] font-bold text-[14px] transition-colors w-max mb-5 shadow-sm"
          >
            Apply for Jet Card
          </Link>

          <Link
            href="/jet-card"
            className="text-white hover:text-gray-300 text-[12px] font-medium transition-colors underline underline-offset-[3px] decoration-white/70 hover:decoration-white w-max"
          >
            More information about Jet Card
          </Link>
        </div>

        <div className="relative z-10 w-full lg:w-[65%] p-8 lg:p-10 xl:p-12 flex items-center justify-end">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 w-full">
            {display.map((plan) => {
              const a = ACCENT[plan.accent] ?? ACCENT.white;
              return (
                <div
                  key={plan.id}
                  className={`${a.card} rounded-[12px] p-5 lg:p-6 border border-white/[0.04] transition-all group flex flex-col shadow-2xl relative overflow-hidden h-[230px]`}
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-[40%] bg-gradient-to-br ${a.highlight} to-transparent pointer-events-none`}
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-[85%] h-[80%] ${a.curve} rounded-tl-[130px] pointer-events-none`}
                  />

                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="mb-4 mt-1">
                      <SlantedShape className={`${a.shape} w-[20px] h-[12px]`} />
                    </div>
                    <h3 className="text-[#F5F2E9] font-bold text-[16px] lg:text-[17px] mb-4 tracking-tight">
                      {plan.name}
                    </h3>
                    <ul className="space-y-3">
                      {plan.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2.5 text-[12px] lg:text-[12.5px] text-[#E8E2D2] leading-snug font-medium"
                        >
                          <span className="w-[4px] h-[4px] rounded-full bg-[#E8E2D2] mt-1.5 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href="/jet-card"
                    className="mt-auto pt-2 flex items-center gap-1.5 text-[#F5F2E9] text-[13px] font-bold transition-colors relative z-10 group-hover:text-white"
                  >
                    Unlock Now <ChevronRight size={14} strokeWidth={3} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
