'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlaneTakeoff, PlaneLanding, Users, Activity, Award, Tag, Trophy, Palmtree, Flag, Snowflake, CreditCard, Handshake, Smartphone, Briefcase } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, href, badge, active }: { icon: React.ElementType, label: string, href: string, badge?: string, active?: boolean }) => (
  <li>
    <Link href={href} className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#152033] hover:text-gray-900 dark:hover:text-white'}`}>
      <div className="flex items-center gap-3">
        <Icon size={18} strokeWidth={2.5} className={active ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'} />
        <span className={active ? 'font-semibold text-gray-900 dark:text-white' : ''}>{label}</span>
      </div>
      {badge && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wider ${badge === 'New' ? 'bg-[#FEF3C7] dark:bg-[#4A330A] text-[#D97706] dark:text-[#FBBF24]' : 'bg-[#FEE2E2] dark:bg-[#4A1515] text-[#DC2626] dark:text-[#F87171]'}`}>
          {badge}
        </span>
      )}
    </Link>
  </li>
);

export const Sidebar = () => {
  const pathname = usePathname();
  const isOnDemandActive = pathname === '/on-demand-charter';

  return (
    <aside className="w-[260px] bg-white dark:bg-[#0B1121] border-r border-gray-100 dark:border-gray-800 flex-col z-10 hidden xl:flex shadow-[2px_0_20px_rgba(0,0,0,0.02)] transition-colors py-6 sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto">
      <div className="px-4 pb-8 space-y-8 flex-1">
        <div>
          <h3 className="px-3 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Private Jet Charter</h3>
          <ul className="space-y-1">
            <SidebarItem icon={PlaneTakeoff} label="On-Demand Charter" href="/on-demand-charter" active={isOnDemandActive} />
            <SidebarItem icon={Activity} label="Jetbay SOS" href="/" badge="New" />
            <SidebarItem icon={Tag} label="Fixed Price Charter" href="/fixed-price-charter" active={pathname === '/fixed-price-charter'} />
            <SidebarItem icon={PlaneLanding} label="Empty Legs" href="/empty-legs" active={pathname === '/empty-legs'} />
            <SidebarItem icon={Users} label="Group Charter" href="/group-charter" active={pathname === '/group-charter'} />
            <SidebarItem icon={Briefcase} label="Corporate Charter" href="/corporate-charter" active={pathname === '/corporate-charter'} />
          </ul>
        </div>

        <div>
          <h3 className="px-3 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Private Jet Getaways</h3>
          <ul className="space-y-1">
            <SidebarItem icon={Trophy} label="World Cup Flights" href="/" badge="Hot" />
            <SidebarItem icon={Palmtree} label="Island Getaways" href="/island-getaways" active={pathname === '/island-getaways'} />
            <SidebarItem icon={Flag} label="Golf Getaways" href="/golf-getaways" active={pathname === '/golf-getaways'} />
            <SidebarItem icon={Snowflake} label="Ski Getaways" href="/" />
          </ul>
        </div>

        <div>
          <h3 className="px-3 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Programs & Platform</h3>
          <ul className="space-y-1">
            <SidebarItem icon={Award} label="Memberships" href="/memberships" active={pathname === '/memberships'} badge="New" />
            <SidebarItem icon={CreditCard} label="JETBAY Travel Credit" href="/" />
            <SidebarItem icon={CreditCard} label="JETBAY Jet Card" href="/jet-card" active={pathname === '/jet-card'} />
            <SidebarItem icon={Handshake} label="Partnership Program" href="/" />
            <SidebarItem icon={Smartphone} label="JETBAY App" href="/jetbay-app" active={pathname === '/jetbay-app'} />
          </ul>
        </div>
      </div>
    </aside>
  );
};

