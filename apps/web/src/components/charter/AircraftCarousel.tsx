'use client';

import { useRef } from 'react';
import { AIRCRAFT_FLEET } from '../../lib/aircraft-catalog';
import { CdnImage } from '../ui/CdnImage';

export function AircraftCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(dir: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.jb-aircraft-card');
    const gap = 16;
    const amount = (card?.offsetWidth ?? 320) + gap;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }

  return (
    <section className="jb-sub-section jb-aircraft-showcase">
      <h2 className="jb-section-title">Compare and Book Our Most Popular Private Jets</h2>
      <p className="jb-section-desc">
        Explore a handpicked selection of our popular top-rated jets designed for ultimate comfort, privacy, and performance.
      </p>

      <div className="jb-aircraft-carousel-wrap">
        <button type="button" className="jb-carousel-btn prev jb-aircraft-nav" onClick={() => scrollByCard(-1)} aria-label="Previous aircraft">
          ‹
        </button>
        <div className="jb-aircraft-carousel" ref={trackRef}>
          {AIRCRAFT_FLEET.map((jet) => (
            <article key={jet.name} className="jb-aircraft-card group">
              <div className="jb-aircraft-card-img">
                <CdnImage src={jet.image} alt={jet.name} width={320} height={220} className="jb-aircraft-card-photo" />
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
        </div>
        <button type="button" className="jb-carousel-btn next jb-aircraft-nav" onClick={() => scrollByCard(1)} aria-label="Next aircraft">
          ›
        </button>
      </div>
    </section>
  );
}
