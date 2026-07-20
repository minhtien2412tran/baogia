'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { tn } from '@jetbay/i18n';
import { navHref } from '../../config/navigation';
import { scheduleUi } from '../../lib/browser';

export function CookieBanner({ locale }: { locale: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    scheduleUi(() => {
      if (!localStorage.getItem('jb-cookie-consent')) setVisible(true);
    });
  }, []);

  if (!visible) return null;

  function accept() {
    localStorage.setItem('jb-cookie-consent', 'all');
    setVisible(false);
  }

  return (
    <div className="jb-cookie-banner" role="dialog" aria-label={tn(locale, 'cookieNotice')}>
      <div className="jb-cookie-inner">
        <p>
          {tn(locale, 'cookieConsent')}{' '}
          <Link href={navHref(locale, '/article/cookie')}>{tn(locale, 'cookieNotice')}</Link>
          {' '}{tn(locale, 'cookieAnd')}{' '}
          <Link href={navHref(locale, '/article/policy')}>{tn(locale, 'privacyPolicyShort')}</Link>.
        </p>
        <div className="jb-cookie-actions">
          <button type="button" className="jb-btn-outline" onClick={accept}>{tn(locale, 'acceptCookies')}</button>
          <Link href={navHref(locale, '/article/cookie')} className="jb-btn-outline">{tn(locale, 'managePreferences')}</Link>
        </div>
      </div>
    </div>
  );
}
