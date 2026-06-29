'use client';

import { useMemo, useState } from 'react';

const CATEGORIES = [
  { label: 'Island Escapes', api: 'ISLAND' },
  { label: 'Ski Escapes', api: 'SKI' },
  { label: 'Golf Escapes', api: 'GOLF' },
] as const;

type Dest = Record<string, unknown>;

export function DestinationsSection({ locale, destinations }: { locale: string; destinations: Dest[] }) {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]['label']>('Island Escapes');
  const p = `/${locale}`;

  const activeApi = CATEGORIES.find((c) => c.label === active)?.api ?? 'ISLAND';

  const filtered = useMemo(
    () => destinations.filter((d) => String(d.category).toUpperCase() === activeApi),
    [destinations, activeApi],
  );

  return (
    <section className="jb-section">
      <div className="jb-container">
        <span className="jb-tag">Curated Flights</span>
        <div className="jb-section-header">
          <div>
            <h2 className="jb-section-title">Fly to the World&apos;s Most Exclusive Destinations</h2>
            <p className="jb-section-desc">
              Discover hand-picked global retreats with bespoke private jet access designed around your itinerary.
            </p>
          </div>
          <a href={`${p}/island-destinations`} className="jb-link-gold">View All Destinations →</a>
        </div>

        <div className="jb-tabs-row">
          {CATEGORIES.map((c) => (
            <button
              key={c.label}
              type="button"
              className={`jb-cat-tab${active === c.label ? ' active' : ''}`}
              onClick={() => setActive(c.label)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="jb-section-desc">No destinations in this category yet. Check back soon.</p>
        ) : (
          <div className="jb-dest-grid">
            {filtered.map((d) => (
              <a
                key={String(d.slug)}
                href={`${p}/destination?slug=${d.slug}`}
                className="jb-dest-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="jb-dest-img">
                  {d.thumbnail ? String(d.thumbnail) : `[Image: ${String(d.city)}]`}
                </div>
                <div className="jb-dest-body">
                  <span className="jb-dest-tag">{String(d.category)}</span>
                  <h3 className="jb-dest-name">{String(d.title ?? d.city)}</h3>
                  <p className="jb-dest-meta">{String(d.city)}, {String(d.country)}</p>
                  {d.tagline != null && d.tagline !== '' && (
                    <span className="jb-link-gold">{String(d.tagline)} →</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
