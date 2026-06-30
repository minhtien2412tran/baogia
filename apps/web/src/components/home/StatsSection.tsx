'use client';

import { useEffect, useRef, useState } from 'react';
import { JB } from '../../config/jetbay-cdn';
import { CdnImage } from '../ui/CdnImage';

const STATS = [
  {
    num: '10K+',
    label: 'Clients Served Worldwide',
    desc: 'Serving clients across 190+ countries with seamless global access.',
    variant: 'hero' as const,
    bg: JB.stats.globalBgM,
    icon: JB.stats.bigArrow,
  },
  {
    num: 'No.1',
    label: "Asia's Transaction Volume",
    desc: 'J-TA leads private aviation transactions across Asia, connecting key business and leisure hubs with speed and precision.',
    variant: 'plain' as const,
    icon: JB.stats.tab,
  },
  {
    num: '190+',
    label: 'Countries Flown',
    desc: 'Coverage across major cities and remote destinations worldwide.',
    variant: 'card' as const,
    progress: 34,
    plane: JB.stats.plane,
  },
  {
    num: '5K+',
    label: 'Annual Flights',
    desc: 'A trusted network supporting thousands of flights each year.',
    variant: 'card' as const,
    icon: JB.stats.annual,
    bg: JB.stats.annualBg,
  },
];

const DESKTOP_STATS = [
  {
    num: 'No.1',
    label: "Asia's Transaction Volume",
    desc: 'J-TA leads private aviation transactions across Asia, connecting key business and leisure hubs with precision. A trusted platform for high-volume and time-critical flights.',
    icon: JB.stats.tab,
  },
  {
    num: '190+',
    label: 'Countries Flown',
    desc: 'Our global network spans over 190 countries, providing seamless access to major cities and remote destinations.',
    progress: 45,
    plane: JB.stats.plane,
    variant: 'bordered' as const,
  },
  {
    num: '5K+',
    label: 'Annual Flights',
    desc: 'A trusted network supporting thousands of flights each year across business and leisure missions.',
    icon: JB.stats.annual,
    bg: JB.stats.annualBg,
  },
  {
    num: '10K+',
    label: 'Clients Served Worldwide',
    desc: 'Serving clients across 190+ countries with seamless global access and dedicated concierge support.',
    bg: JB.stats.servedBg,
    variant: 'featured' as const,
  },
];

export function StatsSection() {
  const mobileRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const el = mobileRef.current;
    if (!el) return;

    function onScroll() {
      const card = el!.querySelector<HTMLElement>('.jb-stat-mobile-card');
      if (!card) return;
      const w = card.offsetWidth + 16;
      setActiveSlide(Math.round(el!.scrollLeft / w));
    }

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="jb-stats jb-stats-light">
      <div className="jb-container">
        <div className="jb-stats-header">
          <span className="jb-stats-pill">Trusted Worldwide</span>
          <h2 className="jb-section-title jb-stats-title">A leading global private jet charter platform</h2>
        </div>

        {/* Mobile: horizontal snap carousel (jet-bay.com mobile stats UX) */}
        <div className="jb-stats-mobile-carousel" ref={mobileRef}>
          {STATS.map((s) => (
            <article
              key={s.label}
              className={`jb-stat-mobile-card jb-stat-mobile-${s.variant}`}
            >
              {s.variant === 'hero' && s.bg && (
                <div className="jb-stat-mobile-hero-bg" aria-hidden>
                  <CdnImage src={s.bg} alt="" fill className="jb-cover-img" sizes="90vw" />
                </div>
              )}
              <div className="jb-stat-mobile-content">
                {s.variant === 'hero' && s.icon && (
                  <CdnImage src={s.icon} alt="" width={41} height={60} className="jb-stat-mobile-arrow" />
                )}
                {s.icon && s.variant === 'plain' && (
                  <CdnImage src={s.icon} alt="" width={115} height={59} className="jb-stat-mobile-icon" />
                )}
                <div className="jb-stat-num">{s.num}</div>
                <div className="jb-stat-label">{s.label}</div>
                <p className="jb-stat-desc">{s.desc}</p>
                {s.progress != null && s.plane && (
                  <div className="jb-stat-progress">
                    <div className="jb-stat-progress-bar" style={{ width: `${s.progress}%` }} />
                    <CdnImage src={s.plane} alt="" width={22} height={22} className="jb-stat-plane" style={{ left: `${s.progress - 2}%` }} />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="jb-stats-mobile-dots">
          {STATS.map((s, i) => (
            <button
              key={s.label}
              type="button"
              className={`jb-dot${i === activeSlide ? ' active' : ''}`}
              aria-label={`Stat ${i + 1}`}
              onClick={() => {
                const el = mobileRef.current;
                const card = el?.querySelector<HTMLElement>('.jb-stat-mobile-card');
                if (!el || !card) return;
                el.scrollTo({ left: i * (card.offsetWidth + 16), behavior: 'smooth' });
              }}
            />
          ))}
        </div>

        {/* Desktop: 4-column rich grid */}
        <div className="jb-stats-desktop-grid">
          {DESKTOP_STATS.map((s) => (
            <article key={s.label} className={`jb-stat-desktop-card jb-stat-desktop-${s.variant ?? 'default'}`}>
              {s.bg && (
                <div className="jb-stat-bg" aria-hidden>
                  <CdnImage src={s.bg} alt="" fill className="jb-cover-img" sizes="25vw" />
                </div>
              )}
              {s.icon && <CdnImage src={s.icon} alt="" width={115} height={59} className="jb-stat-desktop-icon" />}
              <div className="jb-stat-num">{s.num}</div>
              <div className="jb-stat-label">{s.label}</div>
              <p className="jb-stat-desc">{s.desc}</p>
              {s.progress != null && s.plane && (
                <div className="jb-stat-progress">
                  <div className="jb-stat-progress-bar" style={{ width: `${s.progress}%` }} />
                  <CdnImage src={s.plane} alt="" width={25} height={25} className="jb-stat-plane" style={{ left: `${s.progress - 4}%` }} />
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
