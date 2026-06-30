'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

export function WorldCupQuoteForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fromAirport, setFromAirport] = useState('');
  const [toAirport, setToAirport] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [passengers, setPassengers] = useState(4);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await api.requestWorldCupQuote({
        firstName,
        lastName,
        email,
        phone,
        legs: [{ fromAirport, toAirport, departureDate, passengers }],
        message: 'World Cup 2026 charter enquiry',
        isConsentAccepted: true,
      });
      setResult(res.message);
      setStatus('done');
    } catch {
      setStatus('error');
      setResult('Unable to submit quote request. Please try again.');
    }
  }

  return (
    <section className="jb-sub-section jb-light-band">
      <div className="jb-container">
        <h2 className="jb-section-title">Request World Cup charter quote</h2>
        <form className="jb-newsletter-form jb-enquiry-form" onSubmit={onSubmit}>
          <input type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <input type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <div className="jb-form-row">
            <input type="text" placeholder="From (IATA)" value={fromAirport} onChange={(e) => setFromAirport(e.target.value.toUpperCase())} maxLength={3} required />
            <input type="text" placeholder="To (IATA)" value={toAirport} onChange={(e) => setToAirport(e.target.value.toUpperCase())} maxLength={3} required />
          </div>
          <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required />
          <input type="number" min={1} max={16} value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} placeholder="Passengers" required />
          <button type="submit" className="jb-btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? 'Submitting…' : 'Request quote'}
          </button>
          {(status === 'done' || status === 'error') && (
            <p className={`jb-form-msg ${status === 'done' ? 'success' : 'error'}`}>{result}</p>
          )}
        </form>
      </div>
    </section>
  );
}
