'use client';

import { useState } from 'react';
import { api, parseApiErrorMessage } from '../../lib/api';
import { t } from '../../lib/i18n';
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
      setMsg({
        type: 'err',
        text: parseApiErrorMessage(err, t(locale, 'subscribeFailed')),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="jb-subscribe-box" onSubmit={onSubmit}>
      <p className="jb-subscribe-title">{t(locale, 'emptyLegSubscribeTitle')}</p>
      <div className="jb-subscribe-row">
        <div className="jb-field">
          <label htmlFor="el-email">{t(locale, 'emailAriaLabel')}</label>
          <input
            id="el-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t(locale, 'emailPlaceholder')}
            required
          />
        </div>
        <AirportInput
          id="el-from"
          label={t(locale, 'departurePlaceholder')}
          value={from}
          onChange={setFrom}
          placeholder={t(locale, 'from')}
        />
        <AirportInput
          id="el-to"
          label={t(locale, 'destinationPlaceholder')}
          value={to}
          onChange={setTo}
          placeholder={t(locale, 'to')}
        />
        <button type="submit" className="jb-btn-primary" disabled={loading}>
          {loading ? t(locale, 'saving') : t(locale, 'getAlerts')}
        </button>
      </div>
      {msg && (
        <p className={`jb-form-msg ${msg.type === 'ok' ? 'success' : 'error'}`} style={{ marginTop: 12 }}>
          {msg.text}
        </p>
      )}
    </form>
  );
}
