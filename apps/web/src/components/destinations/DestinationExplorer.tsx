'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { destinationThumb, JB } from '../../config/jetbay-cdn';
import { DESTINATION_CATEGORIES, type DestinationCategory, apiLocale } from '../../config/destination-categories';
import { api } from '../../lib/api';
import { CdnImage } from '../ui/CdnImage';

type Dest = Record<string, unknown>;

function destImage(d: Dest): string {
  if (d.thumbnail) return String(d.thumbnail);
  return destinationThumb(String(d.slug ?? d.city ?? 'default')) ?? JB.logo;
}

type Props = {
  locale: string;
  variant: 'home' | 'hub';
  initialCategory?: string;
};

export function DestinationExplorer({ locale, variant, initialCategory = 'ISLAND' }: Props) {
  const router = useRouter();
  const p = `/${locale}`;
  const normalizedCategory = (initialCategory?.toUpperCase() || 'ISLAND') as DestinationCategory;

  const [activeCategory, setActiveCategory] = useState<DestinationCategory>(
    DESTINATION_CATEGORIES.some((c) => c.api === normalizedCategory) ? normalizedCategory : 'ISLAND',
  );
  const [search, setSearch] = useState('');
  const [destinations, setDestinations] = useState<Dest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDestinations = useCallback(
    async (category: DestinationCategory, q: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getDestinations({
          category,
          locale: apiLocale(locale),
          search: q.trim() || undefined,
          limit: 50,
        });
        setDestinations(res.destinations);
      } catch {
        setError('Could not load destinations. Please try again.');
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    },
    [locale],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchDestinations(activeCategory, search);
    }, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [activeCategory, search, fetchDestinations]);

  function onCategoryChange(api: DestinationCategory) {
    setActiveCategory(api);
    if (variant === 'hub') {
      const params = new URLSearchParams();
      params.set('category', api);
      router.replace(`${p}/destination?${params.toString()}`);
    }
  }

  const activeLabel = DESTINATION_CATEGORIES.find((c) => c.api === activeCategory)?.label ?? 'Island Escapes';

  return (
    <>
      {variant === 'home' && (
        <>
          <span className="jb-tag">Curated Flights</span>
          <div className="jb-section-header">
            <div>
              <h2 className="jb-section-title">Fly to the World&apos;s Most Exclusive Destinations</h2>
              <p className="jb-section-desc">
                Discover hand-picked global retreats with bespoke private jet access designed around your itinerary.
              </p>
            </div>
            <a href={`${p}/destination?category=${activeCategory}`} className="jb-link-gold">
              View All Destinations →
            </a>
          </div>
        </>
      )}

      {variant === 'hub' && (
        <div style={{ marginBottom: 20 }}>
          <input
            type="search"
            className="jb-section-desc"
            placeholder="Search city or country…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 360, width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6 }}
          />
        </div>
      )}

      <div className="jb-tabs-row">
        {DESTINATION_CATEGORIES.map((c) => (
          <button
            key={c.api}
            type="button"
            className={`jb-cat-tab${activeCategory === c.api ? ' active' : ''}`}
            onClick={() => onCategoryChange(c.api)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading && <p className="jb-section-desc">Loading {activeLabel.toLowerCase()}…</p>}
      {error && <p className="jb-section-desc">{error}</p>}

      {!loading && !error && destinations.length === 0 && (
        <p className="jb-section-desc">No destinations in this category yet. Check back soon.</p>
      )}

      {!loading && destinations.length > 0 && (
        <div className="jb-dest-grid">
          {destinations.map((d) => {
            const slug = String(d.slug);
            const thumb = destImage(d);
            return (
              <a
                key={slug}
                href={`${p}/destination?slug=${slug}`}
                className="jb-dest-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="jb-dest-img">
                  {thumb && (
                    <CdnImage src={thumb} alt={String(d.city)} fill className="jb-cover-img" sizes="(max-width: 768px) 100vw, 33vw" />
                  )}
                </div>
                <div className="jb-dest-body">
                  <span className="jb-dest-tag">{String(d.category)}</span>
                  <h3 className="jb-dest-name">{String(d.title ?? d.city)}</h3>
                  <p className="jb-dest-meta">
                    {String(d.city)}, {String(d.country)}
                  </p>
                  {d.tagline != null && d.tagline !== '' && (
                    <span className="jb-link-gold">{String(d.tagline)} →</span>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}
