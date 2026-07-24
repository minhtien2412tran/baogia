'use client';

import { useState } from 'react';
import { api, parseApiErrorMessage } from '../../lib/api';
import { apiLocale } from '../../config/locales';
import { t } from '../../lib/i18n';

/**
 * General contact / sales enquiry → POST /quotes/request
 * (persists QuoteRequest; mail ACK depends on SMTP — page works without SMTP)
 */
export function ContactEnquiryForm({ locale }: { locale: string }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setStatus('error');
      setResult(t(locale, 'quoteConsentLabel'));
      return;
    }
    if (!phone.trim()) {
      setStatus('error');
      setResult(t(locale, 'quotePhoneRequired'));
      return;
    }
    setStatus('loading');
    setResult('');
    try {
      const departure = new Date();
      departure.setUTCDate(departure.getUTCDate() + 30);
      const res = await api.requestQuote({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        isConsentAccepted: true,
        locale: apiLocale(locale),
        tripType: 'ONE_WAY',
        message: `[Website Contact] ${message.trim() || 'General enquiry'}`,
        legs: [
          {
            fromAirport: 'SGN',
            toAirport: 'HAN',
            departureDate: departure.toISOString(),
            passengers: 2,
          },
        ],
      });
      setResult(
        res.message ||
          `${t(locale, 'contactSuccess')} #${res.requestId ?? ''}`.trim(),
      );
      setStatus('done');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setResult(parseApiErrorMessage(err, t(locale, 'contactError')));
    }
  }

  if (status === 'done') {
    return (
      <div className="jb-contact-form jb-contact-form--success" role="status">
        <p className="jb-section-desc">{result || t(locale, 'contactSuccess')}</p>
        <button type="button" className="jb-btn-primary" onClick={() => setStatus('idle')}>
          {t(locale, 'contactSendAnother')}
        </button>
      </div>
    );
  }

  return (
    <form className="jb-newsletter-form jb-enquiry-form jb-contact-form" onSubmit={onSubmit} noValidate>
      <div className="jb-contact-row">
        <label className="jb-sr-only" htmlFor="contact-first">
          {t(locale, 'contactFirstName')}
        </label>
        <input
          id="contact-first"
          type="text"
          name="firstName"
          autoComplete="given-name"
          placeholder={t(locale, 'contactFirstName')}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <label className="jb-sr-only" htmlFor="contact-last">
          {t(locale, 'contactLastName')}
        </label>
        <input
          id="contact-last"
          type="text"
          name="lastName"
          autoComplete="family-name"
          placeholder={t(locale, 'contactLastName')}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <div className="jb-contact-row">
        <label className="jb-sr-only" htmlFor="contact-email">
          {t(locale, 'contactEmail')}
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder={t(locale, 'contactEmail')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="jb-sr-only" htmlFor="contact-phone">
          {t(locale, 'contactPhone')}
        </label>
        <input
          id="contact-phone"
          type="tel"
          name="phone"
          autoComplete="tel"
          placeholder={t(locale, 'contactPhone')}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <label className="jb-sr-only" htmlFor="contact-message">
        {t(locale, 'contactMessage')}
      </label>
      <textarea
        id="contact-message"
        name="message"
        placeholder={t(locale, 'contactMessage')}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
      />
      <label className="jb-enquiry-consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
        />
        <span>{t(locale, 'quoteConsentLabel')}</span>
      </label>
      {status === 'error' ? (
        <p className="jb-form-error" role="alert">
          {result}
        </p>
      ) : null}
      <p className="jb-footer-newsletter-hint">{t(locale, 'contactSmtpHint')}</p>
      <button type="submit" className="jb-btn-primary" disabled={status === 'loading'}>
        {status === 'loading' ? t(locale, 'loading') : t(locale, 'contactSubmit')}
      </button>
    </form>
  );
}
