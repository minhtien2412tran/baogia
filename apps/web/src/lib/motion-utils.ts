export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function animateCounter(
  el: HTMLElement,
  to: number,
  opts: { duration?: number; suffix?: string; prefix?: string; decimals?: number } = {},
) {
  const { duration = 1400, suffix = '', prefix = '', decimals = 0 } = opts;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = easeOutCubic(t);
    const val = to * eased;
    const shown = decimals > 0 ? val.toFixed(decimals) : String(Math.round(val));
    el.textContent = `${prefix}${shown}${suffix}`;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
