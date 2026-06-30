'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

export function PartnerApplicationForm() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [partnerType, setPartnerType] = useState('REFERRAL');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await api.submitPartnerApplication({ partnerType, email, phone });
      setResult(res.message);
      setStatus('done');
    } catch {
      setStatus('error');
      setResult('Unable to submit application. Please try again.');
    }
  }

  return (
    <section className="jb-sub-section">
      <div className="jb-container">
        <h2 className="jb-section-title">Apply to become a partner</h2>
        <form className="jb-newsletter-form" onSubmit={onSubmit} style={{ maxWidth: 480 }}>
          <select value={partnerType} onChange={(e) => setPartnerType(e.target.value)}>
            <option value="REFERRAL">Referral Partner</option>
            <option value="SERVICE">Service Partner</option>
            <option value="OFFICIAL">Official Partner</option>
          </select>
          <input
            type="email"
            placeholder="Contact email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button type="submit" className="jb-btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? 'Submitting…' : 'Submit application'}
          </button>
          {(status === 'done' || status === 'error') && (
            <p style={{ marginTop: 8, fontSize: 14 }}>{result}</p>
          )}
        </form>
      </div>
    </section>
  );
}
