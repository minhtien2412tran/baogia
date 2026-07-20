'use client';

import Link from 'next/link';
import Image from 'next/image';
import { use, useState } from 'react';
import { api } from '../../../lib/api';
import { useAccount } from '../../../components/account/AccountContext';
import {
  AccountEmpty,
  AccountPanel,
  AccountStatGrid,
  StatusBadge,
} from '../../../components/account/AccountUI';
import { t } from '../../../lib/i18n';
import { navHref } from '../../../config/navigation';
import { navigateExternal } from '../../../lib/browser';

function OverviewContent({ locale }: { locale: string }) {
  const { data, token, refresh } = useAccount();
  if (!data) return null;

  async function payBooking(bookingId: number, gateway: 'onepay' | '9pay') {
    if (!token) return;
    const returnUrl = `${window.location.origin}/${locale}/account`;
    const res = await api.createGatewayPayment(token, { bookingId, gateway, returnUrl });
    navigateExternal(res.redirectUrl);
  }

  return (
    <>
      <header className="jb-account-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {data.profile.avatarUrl ? (
            <Image
              src={data.profile.avatarUrl}
              alt=""
              width={64}
              height={64}
              unoptimized
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : null}
          <div>
        <h1>{t(locale, 'myAccount')}</h1>
        <p>Welcome back, {data.profile.firstName || data.profile.email}</p>
        <span className="jb-profile-public-id">
          JetVina ID · {data.profile.publicId}
        </span>
          </div>
        </div>
      </header>

      <ProfileEditor token={token} profile={data.profile} onSaved={refresh} />

      <AccountStatGrid stats={data.stats} />

      <div className="jb-account-grid-2">
        <AccountPanel title="Recent Quotes" subtitle={`${data.quotes.length} total requests`}>
          {data.quotes.length === 0 ? (
            <AccountEmpty
              title={t(locale, 'noQuotesTitle')}
              hint={t(locale, 'noQuotesHint')}
              action={
                <Link href={navHref(locale, '/')} className="jb-btn-primary">
                  {t(locale, 'searchFlights')}
                </Link>
              }
            />
          ) : (
            <ul className="jb-account-list">
              {data.quotes.slice(0, 5).map((q) => (
                <li key={q.id} className="jb-account-list-item">
                  <div>
                    <strong>#{q.id}</strong> · {q.tripType}
                    <div className="jb-account-meta">
                      {q.legs.map((l) => `${l.from}→${l.to}`).join(' · ')}
                    </div>
                  </div>
                  <StatusBadge status={q.status} />
                </li>
              ))}
            </ul>
          )}
        </AccountPanel>

        <AccountPanel title="Active Bookings" subtitle={`${data.bookings.length} bookings`}>
          {data.bookings.length === 0 ? (
            <AccountEmpty title={t(locale, 'noBookingsTitle')} hint={t(locale, 'noBookingsHint')} />
          ) : (
            <ul className="jb-account-list">
              {data.bookings.slice(0, 5).map((b) => {
                const leg = b.itinerary?.legs?.[0];
                const canPay = ['pending', 'confirmed'].includes(String(b.status).toLowerCase());
                return (
                  <li key={b.id} className="jb-account-list-item jb-account-list-item--stack">
                    <div className="jb-account-list-item__row">
                      <div>
                        <strong>Booking #{b.id}</strong>
                        {leg && (
                          <div className="jb-account-meta">
                            {leg.fromAirport} → {leg.toAirport}
                          </div>
                        )}
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                    {canPay && (
                      <div className="jb-account-actions">
                        <button type="button" className="jb-btn-ghost" onClick={() => payBooking(b.id, 'onepay')}>
                          OnePay
                        </button>
                        <button type="button" className="jb-btn-ghost" onClick={() => payBooking(b.id, '9pay')}>
                          9Pay
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </AccountPanel>
      </div>

      {(data.jetCards.length > 0 || data.travelCredits.credits > 0) && (
        <AccountPanel title="Membership & Credits">
          <div className="jb-account-membership-row">
            {data.jetCards.map((c) => (
              <div key={c.accountId} className="jb-account-mini-card">
                <span className="jb-account-mini-card__label">{c.planName}</span>
                <strong>{c.remainingHours}h</strong>
              </div>
            ))}
            {data.travelCredits.credits > 0 && (
              <div className="jb-account-mini-card">
                <span className="jb-account-mini-card__label">{t(locale, 'travelCredits')}</span>
                <strong>
                  {data.travelCredits.credits.toLocaleString()} {data.travelCredits.currency}
                </strong>
              </div>
            )}
          </div>
        </AccountPanel>
      )}
    </>
  );
}

function ProfileEditor({
  token,
  profile,
  onSaved,
}: {
  token: string | null;
  profile: {
    publicId: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    accountType?: string | null;
    avatarUrl?: string | null;
    whatsapp?: string | null;
    zalo?: string | null;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    preferredLocale?: string | null;
    facebookUrl?: string | null;
    instagramUrl?: string | null;
    linkedinUrl?: string | null;
  };
  onSaved: () => Promise<void>;
}) {
  const [firstName, setFirstName] = useState(profile.firstName ?? '');
  const [lastName, setLastName] = useState(profile.lastName ?? '');
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp ?? '');
  const [zalo, setZalo] = useState(profile.zalo ?? '');
  const [address, setAddress] = useState(profile.address ?? '');
  const [city, setCity] = useState(profile.city ?? '');
  const [country, setCountry] = useState(profile.country ?? '');
  const [preferredLocale, setPreferredLocale] = useState(profile.preferredLocale ?? '');
  const [facebookUrl, setFacebookUrl] = useState(profile.facebookUrl ?? '');
  const [instagramUrl, setInstagramUrl] = useState(profile.instagramUrl ?? '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl ?? '');
  const [accountType, setAccountType] = useState(profile.accountType ?? 'INDIVIDUAL');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setBusy(true);
    setMessage('');
    try {
      const optionalUrl = (value: string) => value.trim();
      await api.updateProfile(token, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        zalo: zalo.trim(),
        address: address.trim(),
        city: city.trim(),
        country: country.trim(),
        preferredLocale: preferredLocale.trim(),
        facebookUrl: optionalUrl(facebookUrl),
        instagramUrl: optionalUrl(instagramUrl),
        linkedinUrl: optionalUrl(linkedinUrl),
        accountType: accountType === 'COMPANY' ? 'COMPANY' : 'INDIVIDUAL',
      });
      await onSaved();
      setMessage('Profile updated.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update profile.');
    } finally {
      setBusy(false);
    }
  }

  async function avatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setBusy(true);
    setMessage('');
    try {
      await api.uploadAvatar(token, file);
      await onSaved();
      setMessage('Avatar updated.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update avatar.');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }

  return (
    <AccountPanel title="Personal information" subtitle="Update the details used for quotes, bookings, and notifications">
      <form onSubmit={save} className="jb-profile-form">
        <section className="jb-profile-form__section">
          <div className="jb-profile-form__section-head">
            <span>01</span>
            <div>
              <h3>Identity & contact</h3>
              <p>Used for your quotes and flight documents.</p>
            </div>
          </div>
          <div className="jb-profile-form__grid">
            <label className="jb-profile-field jb-profile-field--wide">
              <span>Email address</span>
              <input value={profile.email ?? ''} readOnly aria-readonly="true" />
              <small>Verified account email cannot be changed here.</small>
            </label>
            <label className="jb-profile-field">
              <span>First name</span>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </label>
            <label className="jb-profile-field">
              <span>Last name</span>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </label>
            <label className="jb-profile-field">
              <span>Phone</span>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label className="jb-profile-field">
              <span>WhatsApp</span>
              <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
            </label>
            <label className="jb-profile-field">
              <span>Zalo</span>
              <input type="tel" value={zalo} onChange={(e) => setZalo(e.target.value)} />
            </label>
            <label className="jb-profile-field">
              <span>Account type</span>
              <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                <option value="INDIVIDUAL">Individual</option>
                <option value="COMPANY">Company</option>
              </select>
            </label>
          </div>
        </section>

        <section className="jb-profile-form__section">
          <div className="jb-profile-form__section-head">
            <span>02</span>
            <div>
              <h3>Travel preferences</h3>
              <p>Keep itinerary communication consistent across JetVina.</p>
            </div>
          </div>
          <div className="jb-profile-form__grid">
            <label className="jb-profile-field jb-profile-field--wide">
              <span>Address</span>
              <input value={address} onChange={(e) => setAddress(e.target.value)} />
            </label>
            <label className="jb-profile-field">
              <span>City</span>
              <input value={city} onChange={(e) => setCity(e.target.value)} />
            </label>
            <label className="jb-profile-field">
              <span>Country</span>
              <input value={country} onChange={(e) => setCountry(e.target.value)} />
            </label>
            <label className="jb-profile-field">
              <span>Preferred language</span>
              <select value={preferredLocale} onChange={(e) => setPreferredLocale(e.target.value)}>
                <option value="">Use website language</option>
                <option value="en-us">English</option>
                <option value="vi">Tiếng Việt</option>
                <option value="zh-cn">简体中文</option>
              </select>
            </label>
            <label className="jb-profile-field">
              <span>Profile photo</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={avatarChange} disabled={busy} />
            </label>
          </div>
        </section>

        <section className="jb-profile-form__section">
          <div className="jb-profile-form__section-head">
            <span>03</span>
            <div>
              <h3>Social profiles</h3>
              <p>Optional links. We automatically add https:// when needed.</p>
            </div>
          </div>
          <div className="jb-profile-form__grid">
            {[
              ['Facebook URL', facebookUrl, setFacebookUrl, 'facebook.com/your-profile'],
              ['Instagram URL', instagramUrl, setInstagramUrl, 'instagram.com/your-profile'],
              ['LinkedIn URL', linkedinUrl, setLinkedinUrl, 'linkedin.com/in/your-profile'],
            ].map(([label, value, setter, placeholder]) => (
              <label className="jb-profile-field jb-profile-field--wide" key={label as string}>
                <span>{label as string}</span>
                <input
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  value={value as string}
                  onChange={(e) => (setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value)}
                  placeholder={placeholder as string}
                />
              </label>
            ))}
          </div>
        </section>

        <div className="jb-profile-form__footer">
          <div>
            <strong>JetVina ID</strong>
            <code>{profile.publicId}</code>
          </div>
          <button type="submit" className="jb-btn-primary" disabled={busy}>
            {busy ? 'Saving…' : 'Save profile'}
          </button>
        </div>
        {message ? (
          <p className={`jb-profile-message${message.includes('updated') ? ' is-success' : ' is-error'}`} role="status">
            {message}
          </p>
        ) : null}
      </form>
    </AccountPanel>
  );
}

export default function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: loc } = use(params);
  const locale = loc ?? 'en-us';
  return <OverviewContent locale={locale} />;
}
