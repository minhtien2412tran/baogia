'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

type Pkg = { id: number; name: string };

export function TravelCreditEnquiryForm({ packages }: { packages: Pkg[] }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [packageId, setPackageId] = useState(packages[0]?.id ?? 1);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await api.submitTravelCreditEnquiry({
        firstName,
        lastName,
        email,
        phone,
        packageId,
        message,
        isConsentAccepted: true,
      });
      setResult(res.message);
      setStatus('done');
    } catch {
      setStatus('error');
      setResult('Unable to submit enquiry. Please try again.');
    }
  }

  if (packages.length === 0) return null;

  return (
    <section className="jb-sub-section">
      <div className="jb-container">
        <h2 className="jb-section-title">Purchase Travel Credits</h2>
        <form className="jb-newsletter-form jb-enquiry-form" onSubmit={onSubmit}>
          {packages.length > 1 && (
            <select value={packageId} onChange={(e) => setPackageId(Number(e.target.value))}>
              {packages.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}
          <input type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <input type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <textarea placeholder="Message (optional)" value={message} onChange={(e) => setMessage(e.target.value)} rows={2} />
          <button type="submit" className="jb-btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? 'Submitting…' : 'Request package'}
          </button>
          {(status === 'done' || status === 'error') && (
            <p className={`jb-form-msg ${status === 'done' ? 'success' : 'error'}`}>{result}</p>
          )}
        </form>
      </div>
    </section>
  );
}
