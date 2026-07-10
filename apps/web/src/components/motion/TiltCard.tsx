'use client';

import { useRef, type ReactNode } from 'react';

/**
 * 3D perspective tilt on hover — inner content lifts slightly.
 */
export function TiltCard({
  children,
  className = '',
  maxTilt = 10,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent) {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    inner.style.transform = `rotateY(${x * maxTilt * 2}deg) rotateX(${-y * maxTilt * 2}deg) translateZ(12px)`;
  }

  function onLeave() {
    const inner = innerRef.current;
    if (inner) inner.style.transform = '';
  }

  return (
    <div
      ref={wrapRef}
      className={`jb-tilt-card ${className}`.trim()}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div ref={innerRef} className="jb-tilt-card__inner">
        {children}
      </div>
    </div>
  );
}
