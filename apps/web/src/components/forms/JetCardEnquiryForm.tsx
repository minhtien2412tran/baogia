'use client';

import { useRef, useState } from 'react';
import { api, parseApiErrorMessage } from '../../lib/api';

export function JetCardEnquiryForm({
  planName,
  locale,
}: {
  planName?: string;
  locale?: string;
}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(planName ? `Interested in ${planName}` : '');
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

      const res = await api.submitJetCardEnquiry({
        firstName,
        lastName,
        email,
        phone,
        message,
        attachmentUrls,
        isConsentAccepted: true,
        locale,
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

  return (
    <section className="jb-sub-section jb-light-band">
      <div className="jb-container">
        <h2 className="jb-section-title">Apply for Jet Card</h2>
        <p className="jb-section-desc">Our team will contact you within one business day.</p>
        <form className="jb-newsletter-form jb-enquiry-form" onSubmit={onSubmit}>
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
            rows={3}
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
