'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { navHref } from '../../config/navigation';

export function CookieBanner({ locale }: { locale: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('jb-cookie-consent');
    if (!accepted) setVisible(true);
  }, []);

  if (!visible) return null;

  function accept() {
    localStorage.setItem('jb-cookie-consent', 'all');
    setVisible(false);
  }

  return (
    <div className="jb-cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="jb-cookie-inner">
        <p>
          We use cookies to improve your experience, analyze traffic, and personalize content.
          See our{' '}
          <Link href={navHref(locale, '/article/cookie')}>Cookie Notice</Link>
          {' '}and{' '}
          <Link href={navHref(locale, '/article/policy')}>Privacy Policy</Link>.
        </p>
        <div className="jb-cookie-actions">
          <button type="button" className="jb-btn-outline" onClick={accept}>Accept All</button>
          <Link href={navHref(locale, '/article/cookie')} className="jb-btn-outline">Manage Preferences</Link>
        </div>
      </div>
    </div>
  );
}
