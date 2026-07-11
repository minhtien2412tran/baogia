import type { ReactNode } from 'react';
import Link from 'next/link';

type Props = {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  variant?: 'light' | 'dark';
  icon?: 'news' | 'routes' | 'generic';
};

function EmptyIcon({ kind }: { kind: NonNullable<Props['icon']> }) {
  const paths: Record<typeof kind, ReactNode> = {
    news: (
      <path
        fill="currentColor"
        d="M6 4h12a2 2 0 0 1 2 2v14l-4-3-4 3-4-3-4 3V6a2 2 0 0 1 2-2Zm2 5h8v2H8V9Zm0 4h8v2H8v-2Z"
      />
    ),
    routes: (
      <path
        fill="currentColor"
        d="M4 14 10 8l3 3 7-7 2 2-9 9-3-3-5 5-1-3Zm1-6a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z"
      />
    ),
    generic: (
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5v5h4v2h-6V7h2Z"
      />
    ),
  };
  return (
    <svg className="jb-empty-state__icon" viewBox="0 0 24 24" aria-hidden>
      {paths[kind]}
    </svg>
  );
}

export function EmptyState({ title, description, action, variant = 'dark', icon = 'generic' }: Props) {
  return (
    <div className={`jb-empty-state jb-empty-state--${variant}`}>
      <EmptyIcon kind={icon} />
      <h3 className="jb-empty-state__title">{title}</h3>
      {description ? <p className="jb-empty-state__desc">{description}</p> : null}
      {action ? (
        <Link href={action.href} className="jb-empty-state__cta">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
