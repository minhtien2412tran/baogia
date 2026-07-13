'use client';

import { useEffect, useRef } from 'react';

/**
 * Client-only particle canvas. Mounted after hydrate so it never participates
 * in SSR HTML / sibling order (avoids hydration mismatch with JetBayMotion).
 */
export function HeroParticles() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const hero = host.closest('.jb-hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'jb-hero-particles';
    canvas.setAttribute('aria-hidden', 'true');
    host.replaceChildren(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const dots: { x: number; y: number; r: number; vx: number; a: number }[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    for (let i = 0; i < 36; i++) {
      dots.push({
        x: Math.random() * Math.max(w, 1),
        y: Math.random() * Math.max(h, 1),
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
      raf = window.requestAnimationFrame(draw);
    };
    raf = window.requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      host.replaceChildren();
    };
  }, []);

  return <div ref={hostRef} className="jb-hero-particles-host" aria-hidden />;
}
