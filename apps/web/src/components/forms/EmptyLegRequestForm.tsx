'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

export function EmptyLegRequestForm({ emptyLegId, label }: { emptyLegId: number; label?: string }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [passengers, setPassengers] = useState(2);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await api.requestEmptyLeg(emptyLegId, {
        firstName,
        lastName,
        email,
        phone,
        passengers,
        isConsentAccepted: true,
      });
      setResult(res.message);
      setStatus('done');
    } catch {
      setStatus('error');
      setResult('Unable to submit request. Please try again.');
    }
  }

  return (
    <div className="jb-content-block">
      <h2 className="jb-section-title">{label ?? 'Request this empty leg'}</h2>
      <form className="jb-newsletter-form jb-enquiry-form" onSubmit={onSubmit}>
        <input type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <input type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input type="number" min={1} max={16} placeholder="Passengers" value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} required />
        <button type="submit" className="jb-btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting…' : 'Request empty leg'}
        </button>
        {(status === 'done' || status === 'error') && (
          <p className={`jb-form-msg ${status === 'done' ? 'success' : 'error'}`}>{result}</p>
        )}
      </form>
    </div>
  );
}
