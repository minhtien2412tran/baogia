'use client';

import { useState } from 'react';
import { api } from '../../lib/api';
import { AirportInput } from '../AirportInput';

export function EmptyLegAlertsForm({ locale }: { locale: string }) {
  const [email, setEmail] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await api.subscribeEmptyLegAlerts({ email, fromAirport: from, toAirport: to, locale });
      setMsg({ type: 'ok', text: res.message });
      setEmail('');
      setFrom('');
      setTo('');
    } catch (err) {
      setMsg({ type: 'err', text: err instanceof Error ? err.message : 'Failed to subscribe' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="jb-subscribe-box" onSubmit={onSubmit}>
      <p className="jb-subscribe-title">Not seeing your route? Subscribe for matching empty legs</p>
      <div className="jb-subscribe-row">
        <div className="jb-field">
          <label htmlFor="el-email">Email</label>
          <input id="el-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <AirportInput id="el-from" label="Departure city or airport" value={from} onChange={setFrom} placeholder="From" />
        <AirportInput id="el-to" label="Destination city or airport" value={to} onChange={setTo} placeholder="To" />
        <button type="submit" className="jb-btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Get Alerts'}
        </button>
      </div>
      {msg && <p className={`jb-form-msg ${msg.type === 'ok' ? 'success' : 'error'}`} style={{ marginTop: 12 }}>{msg.text}</p>}
    </form>
  );
}
