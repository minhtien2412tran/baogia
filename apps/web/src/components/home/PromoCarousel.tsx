'use client';

import { useEffect, useState } from 'react';

const SLIDES = [
  {
    title: 'World Cup 2026 — Private jet travel for every match',
    href: '/world-cup-2026-private-jet-booking',
    gradient: 'linear-gradient(135deg, #1a2a40 0%, #0d1520 100%)',
  },
  {
    title: 'Fixed price private jet charter — price certainty on global routes',
    href: '/fixed-price-charter',
    gradient: 'linear-gradient(135deg, #2a3040 0%, #121820 100%)',
  },
  {
    title: 'Luxurious private jet cabin — cream leather & polished finishes',
    href: '/private-jet-charter',
    gradient: 'linear-gradient(135deg, #302820 0%, #141010 100%)',
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
              <a key={s.title} href={`${p}${s.href}`} className="jb-promo-slide" style={{ background: s.gradient }}>
                <div className="jb-promo-placeholder">{s.title}</div>
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
