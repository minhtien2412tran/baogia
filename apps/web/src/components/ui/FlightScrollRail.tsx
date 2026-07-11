'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

type FlightScrollRailProps = {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  ariaLabel: string;
  /** Compact mode: no flight path, minimal chrome (tabs, etc.) */
  compact?: boolean;
  /** Hide prev/next when content fits */
  autoHideNav?: boolean;
};

function PlaneIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      className={`jb-flight-rail__plane-icon jb-flight-rail__plane-icon--${dir}`}
      viewBox="0 0 24 24"
      aria-hidden
      fill="currentColor"
    >
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}

export function FlightScrollRail({
  children,
  className = '',
  trackClassName = '',
  ariaLabel,
  compact = false,
  autoHideNav = true,
}: FlightScrollRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [progress, setProgress] = useState(0);
  const [overflows, setOverflows] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft;
    setOverflows(max > 4);
    setCanPrev(left > 4);
    setCanNext(left < max - 4);
    setProgress(max <= 0 ? 0 : (left / max) * 100);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener('resize', sync);
    return () => {
      el.removeEventListener('scroll', sync);
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [sync, children]);

  function scrollByStep(dir: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>(':scope > *');
    const gap = parseFloat(getComputedStyle(el).gap || '16') || 16;
    const step = (item?.offsetWidth ?? 280) + gap;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }

  const showNav = !autoHideNav || overflows;

  return (
    <div
      className={`jb-flight-rail${compact ? ' jb-flight-rail--compact' : ''}${className ? ` ${className}` : ''}`}
      data-overflow={overflows ? 'true' : 'false'}
    >
      {showNav ? (
        <button
          type="button"
          className="jb-flight-rail__nav jb-flight-rail__nav--prev"
          onClick={() => scrollByStep(-1)}
          disabled={!canPrev}
          aria-label="Scroll previous"
        >
          <PlaneIcon dir="left" />
        </button>
      ) : null}

      <div
        ref={trackRef}
        className={`jb-flight-rail__track jb-hide-scrollbar${trackClassName ? ` ${trackClassName}` : ''}`}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
      >
        {children}
      </div>

      {showNav ? (
        <button
          type="button"
          className="jb-flight-rail__nav jb-flight-rail__nav--next"
          onClick={() => scrollByStep(1)}
          disabled={!canNext}
          aria-label="Scroll next"
        >
          <PlaneIcon dir="right" />
        </button>
      ) : null}

      {!compact && overflows ? (
        <div className="jb-flight-rail__route" aria-hidden>
          <div className="jb-flight-rail__route-line">
            <span className="jb-flight-rail__route-dash" />
            <span
              className="jb-flight-rail__route-plane"
              style={{ left: `clamp(0%, ${progress}%, calc(100% - 20px))` }}
            >
              <PlaneIcon dir="right" />
            </span>
            <span className="jb-flight-rail__route-dot jb-flight-rail__route-dot--end" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
