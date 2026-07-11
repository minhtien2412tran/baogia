'use client';

import { useEffect } from 'react';
import { animateCounter } from '../../lib/motion-utils';

/**
 * Site-wide motion: scroll reveal, parallax, counters, tilt fallback, booking flow.
 */
export function JetBayMotion() {
  useEffect(() => {
    const root = document.querySelector('.jb-page');
    if (!root) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups: (() => void)[] = [];

    const revealEls = new Set<HTMLElement>();

    root.querySelectorAll<HTMLElement>(
      '.jb-section, .jb-promo, .jb-stats, .jb-route-card, .jb-feature, .jb-stat-desktop-card, .jb-stat-mobile-card, .jb-news-card, .jb-slug-hero .jb-container, .jb-light-section-head, .jb-pricing-tier-card, .jb-step-item, .jb-partner-type-card-light, .jb-booking-step, .jb-aircraft-row',
    ).forEach((el) => revealEls.add(el));

    root.querySelectorAll<HTMLElement>('.jb-features-grid, .jb-stats-desktop-grid, .jb-booking-steps').forEach((grid) => {
      grid.classList.add('jb-motion-stagger');
      revealEls.add(grid);
    });

    root.querySelectorAll<HTMLElement>('.jb-split-visual').forEach((el) => {
      el.classList.add('jb-motion-reveal', 'jb-motion-reveal--right');
      revealEls.add(el);
    });
    root.querySelectorAll<HTMLElement>('.jb-split > div:first-child').forEach((el) => {
      el.classList.add('jb-motion-reveal', 'jb-motion-reveal--left');
      revealEls.add(el);
    });

    /* Elements marked jb-motion-reveal in markup (e.g. fixed-price detail) */
    root.querySelectorAll<HTMLElement>('.jb-motion-reveal').forEach((el) => revealEls.add(el));

    revealEls.forEach((el) => {
      if (!el.classList.contains('jb-motion-reveal')) el.classList.add('jb-motion-reveal');
    });

    let revealIo: IntersectionObserver | null = null;
    if (!reduce) {
      revealIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('jb-motion-reveal--in');
              revealIo?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -48px 0px' },
      );
      revealEls.forEach((el) => revealIo?.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('jb-motion-reveal--in'));
    }

    const heroItems = root.querySelectorAll<HTMLElement>(
      '.jb-hero h1, .jb-hero-sub, .jb-trust-row, .jb-hero .jb-quote-card, .jb-page-hero-widget .jb-quote-card',
    );
    heroItems.forEach((el) => el.classList.add('jb-motion-reveal'));
    if (!reduce) {
      heroItems.forEach((el, i) => {
        setTimeout(() => el.classList.add('jb-motion-reveal--in'), 120 + i * 90);
      });
    } else {
      heroItems.forEach((el) => el.classList.add('jb-motion-reveal--in'));
    }

    const header = root.querySelector<HTMLElement>('.jb-header');
    const onScroll = () => {
      const y = window.scrollY;
      header?.classList.toggle('jb-header--scrolled', y > 24);
      if (!reduce) {
        const heroBg = root.querySelector<HTMLElement>('.jb-hero-bg');
        if (heroBg && y < 800) {
          heroBg.style.transform = `scale(1.05) translateY(${y * 0.18}px)`;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    cleanups.push(() => window.removeEventListener('scroll', onScroll));

    // ── Stat counters (10K+, 190+, …) ──
    const counters = root.querySelectorAll<HTMLElement>('[data-jb-count-to]');
    const countIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const to = Number(el.dataset.jbCountTo || 0);
          const suffix = el.dataset.jbSuffix ?? '';
          const prefix = el.dataset.jbPrefix ?? '';
          if (reduce) {
            el.textContent = `${prefix}${to}${suffix}`;
          } else {
            animateCounter(el, to, { suffix, prefix });
          }
          countIo.unobserve(el);
        });
      },
      { threshold: 0.45 },
    );
    counters.forEach((c) => countIo.observe(c));
    cleanups.push(() => countIo.disconnect());

    // ── Progress bars ──
    const progressBars = root.querySelectorAll<HTMLElement>('.jb-stat-progress-bar');
    progressBars.forEach((bar) => {
      const pct = bar.style.width || bar.dataset.jbProgress || '0%';
      bar.style.setProperty('--jb-progress-pct', pct);
      if (!reduce) bar.style.width = '0';
      else bar.classList.add('jb-progress--in');
    });

    const progressIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const bar = entry.target as HTMLElement;
          bar.classList.add('jb-progress--in');
          const plane = bar.closest('.jb-stat-progress')?.querySelector<HTMLElement>('.jb-stat-plane');
          if (plane) {
            const pct = bar.dataset.jbProgress || bar.style.getPropertyValue('--jb-progress-pct') || '0%';
            plane.style.left = `calc(${parseFloat(pct)}% - 10px)`;
          }
          progressIo.unobserve(bar);
        });
      },
      { threshold: 0.4 },
    );
    progressBars.forEach((b) => progressIo.observe(b));
    cleanups.push(() => progressIo.disconnect());

    // ── 3D tilt via event delegation (works for dynamic booking results) ──
    if (!reduce) {
      let activeTilt: HTMLElement | null = null;

      const resetTilt = (card: HTMLElement) => {
        const inner = card.querySelector<HTMLElement>('.jb-tilt-card__inner');
        if (inner) inner.style.transform = '';
      };

      const onMouseMove = (e: Event) => {
        const me = e as MouseEvent;
        const card = (me.target as Element).closest<HTMLElement>('.jb-tilt-card');
        if (!card) {
          if (activeTilt) {
            resetTilt(activeTilt);
            activeTilt = null;
          }
          return;
        }
        if (activeTilt && activeTilt !== card) resetTilt(activeTilt);
        activeTilt = card;

        const inner = card.querySelector<HTMLElement>('.jb-tilt-card__inner') ?? card;
        const max = Number(card.dataset.tiltMax || 10);
        const rect = card.getBoundingClientRect();
        const x = (me.clientX - rect.left) / rect.width - 0.5;
        const y = (me.clientY - rect.top) / rect.height - 0.5;
        inner.style.transform = `rotateY(${x * max * 2}deg) rotateX(${-y * max * 2}deg) translateZ(12px)`;
      };

      document.addEventListener('mousemove', onMouseMove);
      cleanups.push(() => document.removeEventListener('mousemove', onMouseMove));
    }

    // ── Booking step timeline highlight ──
    const bookingSteps = root.querySelectorAll<HTMLElement>('.jb-booking-step');
    if (bookingSteps.length && !reduce) {
      const stepIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            entry.target.classList.toggle('jb-booking-step--active', entry.isIntersecting);
          });
        },
        { threshold: 0.55, rootMargin: '-10% 0px' },
      );
      bookingSteps.forEach((s) => stepIo.observe(s));
      cleanups.push(() => stepIo.disconnect());
    }

    // ── Hero particles (canvas lives outside React tree to avoid removeChild errors) ──
    let canvas: HTMLCanvasElement | null = null;
    let raf = 0;

    if (!reduce) {
      const hero = root.querySelector('.jb-hero');
      if (hero) {
        canvas = document.createElement('canvas');
        canvas.className = 'jb-hero-particles';
        canvas.setAttribute('aria-hidden', 'true');
        hero.insertBefore(canvas, hero.firstChild?.nextSibling ?? null);

        const ctx = canvas.getContext('2d');
        if (ctx) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const dots: { x: number; y: number; r: number; vx: number; a: number }[] = [];
          let w = 0;
          let h = 0;

          const resize = () => {
            const rect = hero.getBoundingClientRect();
            w = rect.width;
            h = rect.height;
            canvas!.width = Math.floor(w * dpr);
            canvas!.height = Math.floor(h * dpr);
            canvas!.style.width = `${w}px`;
            canvas!.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          };
          resize();
          window.addEventListener('resize', resize);
          cleanups.push(() => window.removeEventListener('resize', resize));

          for (let i = 0; i < 36; i++) {
            dots.push({
              x: Math.random() * w,
              y: Math.random() * h,
              r: 0.5 + Math.random() * 1.2,
              vx: 0.15 + Math.random() * 0.35,
              a: 0.08 + Math.random() * 0.2,
            });
          }

          const draw = () => {
            ctx.clearRect(0, 0, w, h);
            for (const d of dots) {
              d.x += d.vx;
              if (d.x > w + 8) d.x = -8;
              ctx.beginPath();
              ctx.fillStyle = `rgba(200, 220, 240, ${d.a})`;
              ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
              ctx.fill();
            }
            raf = requestAnimationFrame(draw);
          };
          raf = requestAnimationFrame(draw);
        }
      }
    }

    cleanups.push(() => {
      revealIo?.disconnect();
      cancelAnimationFrame(raf);
      canvas?.remove();
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
