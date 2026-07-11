'use client';

import { useMemo, useState } from 'react';
import { tn } from '@jetbay/i18n';
import { JB } from '../../config/jetbay-cdn';
import { CdnImage } from '../ui/CdnImage';

type TabId = 'media' | 'membership' | 'social';

export function MediaSection({ locale }: { locale: string }) {
  const tabs = useMemo(
    () =>
      [
        { id: 'media' as const, label: tn(locale, 'featuredMediaTab') },
        { id: 'membership' as const, label: tn(locale, 'industryMembershipTab') },
        { id: 'social' as const, label: tn(locale, 'socialMediaTab') },
      ],
    [locale],
  );
  const [tab, setTab] = useState<TabId>('media');

  return (
    <section className="jb-section jb-media-section">
      <div className="jb-container">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span className="jb-tag">{tn(locale, 'exploreTag')}</span>
          <h2 className="jb-section-title">{tn(locale, 'exploreWorldTitle')}</h2>
        </div>
        <div className="jb-media-tabs" role="tablist" aria-label={tn(locale, 'exploreWorldTitle')}>
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`jb-cat-tab${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'media' && (
          <div className="jb-logos-row" role="tabpanel">
            {JB.media.map((m) => (
              <CdnImage key={m.alt} src={m.src} alt={m.alt} width={120} height={40} className="jb-media-logo" />
            ))}
          </div>
        )}
        {tab === 'membership' && (
          <div className="jb-logos-row" role="tabpanel">
            {JB.membership.map((m) => (
              <CdnImage key={m.alt} src={m.src} alt={m.alt} width={80} height={44} className="jb-media-logo" />
            ))}
          </div>
        )}
        {tab === 'social' && (
          <div className="jb-logos-row jb-social-tab" role="tabpanel">
            {JB.social.map((s) => (
              <a key={s.alt} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.alt}>
                <CdnImage src={s.src} alt={s.alt} width={48} height={48} className="jb-social-icon" />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
