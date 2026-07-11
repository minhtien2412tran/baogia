'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { JB, cdnUrl } from '../../config/jetbay-cdn';

const SLIDES = [
  {
    title: 'World Cup 2026 — Private jet travel for every match',
    href: '/world-cup-2026-private-jet-booking',
    desktop: JB.promo.worldCup.desktop,
    mobile: JB.promo.worldCup.mobile,
  },
  {
    title: 'Fixed price private jet charter — price certainty on global routes',
    href: '/fixed-price-charter',
    desktop: JB.promo.fixedPrice.desktop,
    mobile: JB.promo.fixedPrice.mobile,
  },
  {
    title: 'Luxurious private jet cabin — cream leather & polished finishes',
    href: '/private-jet-charter',
    desktop: JB.promo.cabin.desktop,
    mobile: JB.promo.cabin.mobile,
  },
] as const;

const AUTO_MS = 6500;
const SWIPE_THRESHOLD = 52;

export function PromoCarousel({ locale }: { locale: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const reducedMotion = useRef(false);
  const p = `/${locale}`;

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const goTo = useCallback((index: number) => {
    setActive((index + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused || reducedMotion.current) return;
    setProgress(0);
    const started = Date.now();
    const id = window.setInterval(() => {
      const pct = (Date.now() - started) / AUTO_MS;
      if (pct >= 1) {
        setActive((i) => (i + 1) % SLIDES.length);
        setProgress(0);
      } else {
        setProgress(pct);
      }
    }, 40);
    return () => window.clearInterval(id);
  }, [paused, active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  return (
    <section className="jb-promo" aria-roledescription="carousel" aria-label="Featured offers">
      <div className="jb-container">
        <div
          className="jb-carousel jb-promo-carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
          }}
          onTouchStart={(e) => {
            touchStartX.current = e.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current == null) return;
            const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
            if (Math.abs(dx) >= SWIPE_THRESHOLD) {
              if (dx < 0) next();
              else prev();
            }
            touchStartX.current = null;
          }}
        >
          <div className="jb-carousel-track" style={{ transform: `translate3d(-${active * 100}%, 0, 0)` }}>
            {SLIDES.map((s, i) => (
              <a
                key={s.href}
                href={`${p}${s.href}`}
                className={`jb-promo-slide${i === active ? ' is-active' : ''}`}
                aria-hidden={i !== active}
                tabIndex={i === active ? 0 : -1}
              >
                <picture className="jb-promo-slide-media">
                  <source media="(max-width: 768px)" srcSet={cdnUrl(s.mobile)} />
                  <img
                    src={cdnUrl(s.desktop)}
                    alt=""
                    loading={i <= 1 ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                  />
                </picture>
                <div className="jb-promo-slide-shade" aria-hidden />
                <span className="jb-promo-caption">{s.title}</span>
              </a>
            ))}
          </div>

          <button type="button" className="jb-carousel-btn prev" onClick={prev} aria-label="Previous slide">
            ‹
          </button>
          <button type="button" className="jb-carousel-btn next" onClick={next} aria-label="Next slide">
            ›
          </button>

          <div className="jb-carousel-dots" role="tablist" aria-label="Choose slide">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`jb-dot${i === active ? ' active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
              >
                {i === active && (
                  <span className="jb-dot-progress" style={{ transform: `scaleX(${paused ? progress : progress})` }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
