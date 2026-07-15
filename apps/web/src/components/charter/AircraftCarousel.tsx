'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { t } from '@jetbay/i18n';
import { AIRCRAFT_FLEET } from '../../lib/aircraft-catalog';
import { CdnImage } from '../ui/CdnImage';
import { FlightScrollRail } from '../ui/FlightScrollRail';

/** Charter fleet showcase — sample catalog (not live API inventory). See T-S2-02. */
export function AircraftCarousel({ locale }: { locale: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [count, setCount] = useState(AIRCRAFT_FLEET.length);

  const syncDots = useCallback(() => {
    const track = wrapRef.current?.querySelector<HTMLElement>('.jb-flight-rail__track');
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>('.jb-aircraft-card');
    setCount(cards.length || AIRCRAFT_FLEET.length);
    const card = cards[0];
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).gap || '16') || 16;
    const step = card.offsetWidth + gap;
    if (step <= 0) return;
    const idx = Math.round(track.scrollLeft / step);
    setActive(Math.max(0, Math.min(cards.length - 1, idx)));
  }, []);

  useEffect(() => {
    const track = wrapRef.current?.querySelector<HTMLElement>('.jb-flight-rail__track');
    if (!track) return;
    syncDots();
    track.addEventListener('scroll', syncDots, { passive: true });
    const ro = new ResizeObserver(syncDots);
    ro.observe(track);
    return () => {
      track.removeEventListener('scroll', syncDots);
      ro.disconnect();
    };
  }, [syncDots]);

  function goTo(index: number) {
    const track = wrapRef.current?.querySelector<HTMLElement>('.jb-flight-rail__track');
    if (!track) return;
    const card = track.querySelector<HTMLElement>('.jb-aircraft-card');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).gap || '16') || 16;
    track.scrollTo({ left: index * (card.offsetWidth + gap), behavior: 'smooth' });
  }

  return (
    <section className="jb-sub-section jb-aircraft-showcase">
      <p className="jb-tag">{t(locale, 'fleetSampleTag')}</p>
      <h2 className="jb-section-title">{t(locale, 'fleetShowcaseTitle')}</h2>
      <p className="jb-section-desc">{t(locale, 'fleetShowcaseDesc')}</p>
      <p className="jb-section-desc jb-fleet-sample-note" role="note">
        {t(locale, 'fleetSampleNote')}
      </p>

      <div className="jb-aircraft-slider" ref={wrapRef}>
        <FlightScrollRail
          className="jb-aircraft-slider-rail"
          trackClassName="jb-aircraft-rail"
          ariaLabel={t(locale, 'fleetShowcaseTitle')}
          autoHideNav={false}
        >
          {AIRCRAFT_FLEET.map((jet) => (
            <article key={jet.name} className="jb-aircraft-card">
              <div className="jb-aircraft-card-img">
                <CdnImage
                  src={jet.image}
                  alt={jet.name}
                  width={320}
                  height={220}
                  className="jb-aircraft-card-photo"
                />
              </div>
              <div className="jb-aircraft-card-body">
                <h3 className="jb-aircraft-card-name">{jet.name}</h3>
                <p className="jb-aircraft-card-desc">{jet.description}</p>
              </div>
              <div className="jb-aircraft-card-specs">
                {jet.specs.map((s) => (
                  <div key={s.label} className="jb-aircraft-spec-row">
                    <span>{s.label}</span>
                    <strong>{s.value}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </FlightScrollRail>

        <div className="jb-aircraft-dots" role="tablist" aria-label="Fleet slides">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show aircraft ${i + 1}`}
              className={`jb-aircraft-dot${i === active ? ' is-active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
