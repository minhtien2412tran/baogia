'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

export function JetCardEnquiryForm({ planName }: { planName?: string }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(planName ? `Interested in ${planName}` : '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await api.submitJetCardEnquiry({
        firstName,
        lastName,
        email,
        phone,
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

  return (
    <section className="jb-sub-section jb-light-band">
      <div className="jb-container">
        <h2 className="jb-section-title">Apply for Jet Card</h2>
        <p className="jb-section-desc">Our team will contact you within one business day.</p>
        <form className="jb-newsletter-form jb-enquiry-form" onSubmit={onSubmit}>
          <input type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <input type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <textarea placeholder="Message (optional)" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
          <button type="submit" className="jb-btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? 'Submitting…' : 'Submit enquiry'}
          </button>
          {(status === 'done' || status === 'error') && (
            <p className={`jb-form-msg ${status === 'done' ? 'success' : 'error'}`}>{result}</p>
          )}
        </form>
      </div>
    </section>
  );
}
