'use client';

import { useRef, useState } from 'react';
import { api, parseApiErrorMessage } from '../../lib/api';

type Pkg = { id: number; name: string };

export function TravelCreditEnquiryForm({ packages }: { packages: Pkg[] }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [packageId, setPackageId] = useState(packages[0]?.id ?? 1);
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setResult('');
    try {
      let attachmentUrls: string[] | undefined;
      if (attachment) {
        const uploaded = await api.uploadEnquiryAttachment(attachment);
        attachmentUrls = [uploaded.url];
      }

      const res = await api.submitTravelCreditEnquiry({
        firstName,
        lastName,
        email,
        phone,
        packageId,
        message,
        attachmentUrls,
        isConsentAccepted: true,
      });
      setResult(res.message);
      setStatus('done');
      setAttachment(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      setStatus('error');
      setResult(parseApiErrorMessage(err, 'Unable to submit enquiry. Please try again.'));
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
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <textarea
            placeholder="Message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
          />
          <label className="jb-enquiry-file">
            <span>Attach file (PDF or image, max 5MB)</span>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,application/pdf,image/*"
              onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
            />
            {attachment && <em>{attachment.name}</em>}
          </label>
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
