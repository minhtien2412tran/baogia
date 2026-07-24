'use client';

import { useState } from 'react';
import { ArrowRightLeft, PlaneLanding, PlaneTakeoff, Send } from 'lucide-react';
import { api, parseApiErrorMessage } from '@/lib/api';
import { AirportTypeahead } from '@/components/AirportTypeahead';

export function EmptyLegAlertsBox({ variant = 'home' }: { variant?: 'home' | 'page' }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      if (!from || !to) throw new Error('Select departure and destination airports');
      const res = await api.subscribeEmptyLegAlerts({
        email,
        fromAirport: from,
        toAirport: to,
        locale: 'en',
      });
      setMsg({ type: 'ok', text: res.message || 'Subscribed successfully' });
      setEmail('');
      setFrom('');
      setTo('');
    } catch (err) {
      setMsg({
        type: 'err',
        text: parseApiErrorMessage(err, err instanceof Error ? err.message : 'Subscribe failed'),
      });
    } finally {
      setLoading(false);
    }
  }

  const inputShell =
    variant === 'home'
      ? 'w-full bg-transparent outline-none text-[#0B1F3A] dark:text-white text-[14px] pl-0'
      : 'w-full h-[52px] pl-11 pr-4 bg-white dark:bg-[#152033] border border-gray-200 dark:border-gray-700 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#13B2A6]/30 text-[#0B1F3A] dark:text-white';

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full">
        {variant === 'home' ? (
          <>
            <div className="flex-1 w-full flex items-center bg-white dark:bg-[#1A263D] border border-[#E2E8F0] dark:border-gray-700 rounded-[10px] px-4 py-3.5">
              <AirportTypeahead
                id="el-from"
                value={from}
                onChange={setFrom}
                placeholder="Departure city or airport"
                inputClassName={inputShell}
              />
            </div>
            <div className="text-[#13B2A6] dark:text-[#40DACD] rotate-90 md:rotate-0 px-2">
              <ArrowRightLeft size={16} strokeWidth={2.5} />
            </div>
            <div className="flex-1 w-full flex items-center bg-white dark:bg-[#1A263D] border border-[#E2E8F0] dark:border-gray-700 rounded-[10px] px-4 py-3.5">
              <AirportTypeahead
                id="el-to"
                value={to}
                onChange={setTo}
                placeholder="Destination city or airport"
                inputClassName={inputShell}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 w-full relative">
              <AirportTypeahead
                id="el-page-from"
                value={from}
                onChange={setFrom}
                placeholder="Departure city or airport"
                icon={<PlaneTakeoff size={18} />}
                inputClassName={inputShell}
              />
            </div>
            <div className="hidden md:flex text-[#13B2A6]">
              <ArrowRightLeft size={20} strokeWidth={2.5} />
            </div>
            <div className="flex-1 w-full relative">
              <AirportTypeahead
                id="el-page-to"
                value={to}
                onChange={setTo}
                placeholder="Destination city or airport"
                icon={<PlaneLanding size={18} />}
                inputClassName={inputShell}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full">
        <div className="flex-1 w-full">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email to receive alerts"
            className={
              variant === 'home'
                ? 'w-full bg-[#F1F5F9] dark:bg-[#1A263D] rounded-[10px] px-4 py-3.5 border border-transparent outline-none text-[#0B1F3A] dark:text-white text-[14px] placeholder:text-[#94A3B8]'
                : 'w-full h-[52px] px-4 bg-white dark:bg-[#152033] border border-gray-200 dark:border-gray-700 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#13B2A6]/30 text-[#0B1F3A] dark:text-white'
            }
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={
            variant === 'home'
              ? 'w-full md:w-auto bg-[#40DACD] hover:bg-[#34C4B8] disabled:opacity-60 text-[#050505] font-semibold px-6 py-3.5 rounded-[10px] flex items-center justify-center gap-2 transition-colors text-[14px]'
              : 'w-full md:w-auto h-[52px] px-8 bg-[#13B2A6] hover:bg-[#10998f] disabled:opacity-60 text-white font-bold text-[15px] rounded-xl flex items-center justify-center gap-2 transition-colors'
          }
        >
          <Send size={variant === 'home' ? 16 : 18} strokeWidth={2.5} />
          {loading ? 'Sending…' : 'Get Alerts'}
        </button>
      </div>

      {msg ? (
        <p
          className={`text-[13px] font-medium ${msg.type === 'ok' ? 'text-[#13B2A6]' : 'text-red-500'}`}
          role="status"
        >
          {msg.text}
        </p>
      ) : null}
    </form>
  );
}
