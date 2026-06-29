import Link from 'next/link';
import { navHref } from '../../config/navigation';

export function SubPageLayout({
  locale,
  title,
  description,
  tag,
  breadcrumb,
  children,
}: {
  locale: string;
  title: string;
  description?: string;
  tag?: string;
  breadcrumb?: { label: string; href?: string }[];
  children: React.ReactNode;
}) {
  const crumbs = breadcrumb ?? [{ label: 'Home', href: '' }, { label: title }];

  return (
    <main className="jb-subpage">
      <section className="jb-sub-hero">
        <div className="jb-container">
          <nav className="jb-breadcrumb" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <span key={c.label}>
                {i > 0 && <span className="jb-bc-sep"> / </span>}
                {c.href !== undefined ? (
                  <Link href={navHref(locale, c.href)}>{c.label}</Link>
                ) : (
                  <span>{c.label}</span>
                )}
              </span>
            ))}
          </nav>
          {tag && <span className="jb-tag">{tag}</span>}
          <h1>{title}</h1>
          {description && <p className="jb-sub-hero-desc">{description}</p>}
        </div>
      </section>
      <div className="jb-container jb-sub-body">{children}</div>
    </main>
  );
}
