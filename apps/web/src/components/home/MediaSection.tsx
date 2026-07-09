'use client';

import { useState } from 'react';
import { JB } from '../../config/jetbay-cdn';
import { CdnImage } from '../ui/CdnImage';

const TABS = [
  { id: 'media', label: 'Featured Media' },
  { id: 'membership', label: 'Industry Membership' },
  { id: 'social', label: 'Social Media' },
] as const;

export function MediaSection() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('media');

  return (
    <section className="jb-section jb-media-section">
      <div className="jb-container">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span className="jb-tag">Explore</span>
          <h2 className="jb-section-title">Explore the World with JetBay</h2>
        </div>
        <div className="jb-media-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`jb-cat-tab${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'media' && (
          <div className="jb-logos-row">
            {JB.media.map((m) => (
              <CdnImage key={m.alt} src={m.src} alt={m.alt} width={120} height={40} className="jb-media-logo" />
            ))}
          </div>
        )}
        {tab === 'membership' && (
          <div className="jb-logos-row">
            {JB.membership.map((m) => (
              <CdnImage key={m.alt} src={m.src} alt={m.alt} width={80} height={44} className="jb-media-logo" />
            ))}
          </div>
        )}
        {tab === 'social' && (
          <div className="jb-logos-row jb-social-tab">
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
