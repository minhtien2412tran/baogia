'use client';

import { useEffect } from 'react';
import { animateCounter } from '../../lib/motion-utils';

export function AccountMotion() {
  useEffect(() => {
    const root = document.querySelector('.jb-account-page');
    if (!root) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups: (() => void)[] = [];

    root.querySelectorAll<HTMLElement>('.jb-account-stat, .jb-account-panel, .jb-account-nav-link').forEach((el, i) => {
      el.classList.add('jb-motion-reveal');
      el.style.transitionDelay = `${Math.min(i * 0.06, 0.36)}s`;
    });

    if (!reduce) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('jb-motion-reveal--visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
      );

      root.querySelectorAll('.jb-motion-reveal').forEach((el) => observer.observe(el));
      cleanups.push(() => observer.disconnect());

      root.querySelectorAll<HTMLElement>('[data-account-count]').forEach((el) => {
        const to = Number(el.dataset.accountCount ?? '0');
        animateCounter(el, to, { duration: 900 });
      });
    } else {
      root.querySelectorAll('.jb-motion-reveal').forEach((el) => el.classList.add('jb-motion-reveal--visible'));
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}

export function AccountStatGrid({
  stats,
}: {
  stats: { bookings: number; quotes: number; payments: number; documents: number; jetCardHours: number; travelCredits: number };
}) {
  const items = [
    { label: 'Bookings', value: stats.bookings, accent: 'gold' },
    { label: 'Quotes', value: stats.quotes, accent: 'blue' },
    { label: 'Payments', value: stats.payments, accent: 'green' },
    { label: 'Documents', value: stats.documents, accent: 'purple' },
    { label: 'Jet Card hrs', value: stats.jetCardHours, accent: 'gold' },
    { label: 'Credits', value: stats.travelCredits, accent: 'cyan' },
  ];

  return (
    <div className="jb-account-stats">
      {items.map((item) => (
        <div key={item.label} className={`jb-account-stat jb-account-stat--${item.accent}`}>
          <span className="jb-account-stat__value" data-account-count={item.value}>
            {item.value}
          </span>
          <span className="jb-account-stat__label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function AccountPanel({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="jb-account-panel">
      <header className="jb-account-panel__head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {actions}
      </header>
      <div className="jb-account-panel__body">{children}</div>
    </section>
  );
}

export function AccountEmpty({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="jb-account-empty">
      <div className="jb-account-empty__icon" aria-hidden>✦</div>
      <h3>{title}</h3>
      {hint && <p>{hint}</p>}
      {action}
    </div>
  );
}

export function AccountSkeleton() {
  return (
    <div className="jb-account-skeleton" aria-busy="true">
      <div className="jb-account-skeleton__bar" />
      <div className="jb-account-skeleton__grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="jb-account-skeleton__card" />
        ))}
      </div>
      <div className="jb-account-skeleton__panel" />
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const tone =
    s.includes('confirm') || s.includes('complete') || s === 'paid'
      ? 'success'
      : s.includes('pend') || s.includes('draft')
        ? 'warn'
        : s.includes('cancel') || s.includes('fail')
          ? 'danger'
          : 'neutral';
  return <span className={`jb-account-badge jb-account-badge--${tone}`}>{status}</span>;
}
