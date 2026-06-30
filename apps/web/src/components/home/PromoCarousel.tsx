'use client';

import { useEffect, useState } from 'react';
import { JB } from '../../config/jetbay-cdn';
import { cdnUrl } from '../../config/jetbay-cdn';

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
];

export function PromoCarousel({ locale }: { locale: string }) {
  const [active, setActive] = useState(0);
  const p = `/${locale}`;

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="jb-promo">
      <div className="jb-container">
        <div className="jb-carousel">
          <div className="jb-carousel-track" style={{ transform: `translateX(-${active * 100}%)` }}>
            {SLIDES.map((s) => (
              <a
                key={s.title}
                href={`${p}${s.href}`}
                className="jb-promo-slide"
                style={{
                  backgroundImage: `linear-gradient(transparent 50%, rgba(0,0,0,0.75)), url(${cdnUrl(s.desktop, 1920)})`,
                }}
              >
                <span className="jb-promo-caption">{s.title}</span>
              </a>
            ))}
          </div>
          <button type="button" className="jb-carousel-btn prev" onClick={() => setActive((i) => (i - 1 + SLIDES.length) % SLIDES.length)} aria-label="Previous">
            ‹
          </button>
          <button type="button" className="jb-carousel-btn next" onClick={() => setActive((i) => (i + 1) % SLIDES.length)} aria-label="Next">
            ›
          </button>
          <div className="jb-carousel-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`jb-dot${i === active ? ' active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
