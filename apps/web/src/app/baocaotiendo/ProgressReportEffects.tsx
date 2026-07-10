'use client';

import { useEffect, useRef } from 'react';

/**
 * Hiệu ứng trang báo cáo: bầu trời, đường bay, thanh tiến độ, hiện dần khi cuộn.
 * Tôn trọng prefers-reduced-motion.
 */
export function ProgressReportEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.querySelector('.pr-page');
    if (!root) return;

    // Scroll reveal
    const revealEls = root.querySelectorAll<HTMLElement>(
      '.pr-hero, .pr-summary, .pr-toc, .pr-section, .pr-module, .pr-phase, .pr-value article, .pr-demo article, .pr-next article, .pr-ref-col, .pr-footer',
    );
    revealEls.forEach((el) => el.classList.add('pr-reveal'));

    let io: IntersectionObserver | null = null;
    if (!reduce) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('pr-reveal--in');
              io?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
      );
      revealEls.forEach((el) => io?.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('pr-reveal--in'));
    }

    // Animate progress bars + counters
    const bars = root.querySelectorAll<HTMLElement>('.pr-bar[data-pct]');
    const counters = root.querySelectorAll<HTMLElement>('[data-count-to]');

    const animateNumber = (el: HTMLElement, to: number, suffix = '%') => {
      if (reduce) {
        el.textContent = `${to}${suffix}`;
        return;
      }
      const duration = 1100;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = `${Math.round(to * eased)}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const barIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const pct = Number(el.dataset.pct || 0);
          const fill = el.querySelector<HTMLElement>('.pr-bar__fill');
          if (fill) {
            fill.style.width = reduce ? `${pct}%` : '0%';
            requestAnimationFrame(() => {
              fill.style.width = `${pct}%`;
            });
          }
          barIo.unobserve(el);
        });
      },
      { threshold: 0.35 },
    );
    bars.forEach((b) => barIo.observe(b));

    const countIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const to = Number(el.dataset.countTo || 0);
          animateNumber(el, to, el.dataset.countSuffix ?? '%');
          countIo.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );
    counters.forEach((c) => countIo.observe(c));

    // Canvas: soft sky particles + contrail dots
    const canvas = canvasRef.current;
    let raf = 0;
    let cleanupResize: (() => void) | undefined;

    if (canvas && !reduce) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const particles: { x: number; y: number; r: number; vx: number; vy: number; a: number }[] = [];
        let w = 0;
        let h = 0;

        const resize = () => {
          w = window.innerWidth;
          h = window.innerHeight;
          canvas.width = Math.floor(w * dpr);
          canvas.height = Math.floor(h * dpr);
          canvas.style.width = `${w}px`;
          canvas.style.height = `${h}px`;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);
        cleanupResize = () => window.removeEventListener('resize', resize);

        for (let i = 0; i < 48; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: 0.6 + Math.random() * 1.8,
            vx: 0.08 + Math.random() * 0.22,
            vy: -0.02 + Math.random() * 0.04,
            a: 0.12 + Math.random() * 0.35,
          });
        }

        let t = 0;
        const draw = () => {
          t += 0.004;
          ctx.clearRect(0, 0, w, h);

          // soft horizon glow
          const g = ctx.createLinearGradient(0, h * 0.55, 0, h);
          g.addColorStop(0, 'rgba(94, 200, 184, 0)');
          g.addColorStop(0.5, 'rgba(94, 200, 184, 0.04)');
          g.addColorStop(1, 'rgba(201, 164, 92, 0.06)');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);

          for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy + Math.sin(t + p.x * 0.01) * 0.05;
            if (p.x > w + 10) p.x = -10;
            if (p.y < -10) p.y = h + 10;
            if (p.y > h + 10) p.y = -10;
            ctx.beginPath();
            ctx.fillStyle = `rgba(200, 220, 240, ${p.a})`;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
          }

          // dashed flight arc
          ctx.save();
          ctx.strokeStyle = 'rgba(94, 200, 184, 0.22)';
          ctx.setLineDash([6, 10]);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          const ax = w * 0.08;
          const ay = h * 0.22;
          const bx = w * 0.92;
          const by = h * 0.18;
          const cx = w * 0.5;
          const cy = h * 0.08 + Math.sin(t) * 8;
          ctx.moveTo(ax, ay);
          ctx.quadraticCurveTo(cx, cy, bx, by);
          ctx.stroke();
          ctx.restore();

          raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);
      }
    }

    return () => {
      io?.disconnect();
      barIo.disconnect();
      countIo.disconnect();
      cancelAnimationFrame(raf);
      cleanupResize?.();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="pr-sky-canvas" aria-hidden />
      <div className="pr-flight" aria-hidden>
        <svg className="pr-flight__path" viewBox="0 0 1200 160" preserveAspectRatio="none">
          <path
            id="pr-flight-curve"
            className="pr-flight__dash"
            d="M40 120 C 280 20, 520 20, 760 90 S 1100 140, 1160 60"
            fill="none"
          />
          <g className="pr-flight__plane">
            <animateMotion dur="18s" repeatCount="indefinite" rotate="auto">
              <mpath href="#pr-flight-curve" />
            </animateMotion>
            <path
              fill="currentColor"
              transform="translate(-18 -18) scale(0.55)"
              d="M62 30.5 38 28l-8-18h-4l6 18H16L8 22H5l5 10L5 42h3l8-6h16l-6 18h4l8-18 24-2.5z"
            />
          </g>
        </svg>
      </div>
      <div className="pr-clouds" aria-hidden>
        <span className="pr-cloud pr-cloud--a" />
        <span className="pr-cloud pr-cloud--b" />
        <span className="pr-cloud pr-cloud--c" />
      </div>
    </>
  );
}
