import Link from 'next/link';
import { navHref } from '../../config/navigation';
import { cdnUrl } from '../../config/jetbay-cdn';
import { QuoteSearchWidget } from '../QuoteSearchWidget';

export function PageHero({
  locale,
  title,
  description,
  tag,
  breadcrumb,
  heroImage,
  showQuoteWidget,
  currency,
}: {
  locale: string;
  title: string;
  description?: string;
  tag?: string;
  breadcrumb?: { label: string; href?: string }[];
  heroImage?: string;
  showQuoteWidget?: boolean;
  currency?: string;
}) {
  const crumbs = breadcrumb ?? [{ label: 'Home', href: '' }, { label: title }];
  const bg = heroImage ? cdnUrl(heroImage, 1920) : undefined;

  return (
    <section
      className={`jb-page-hero${showQuoteWidget ? ' jb-page-hero-search' : ''}`}
      style={
        bg
          ? {
              backgroundImage: `linear-gradient(105deg, rgba(10,12,15,0.88) 0%, rgba(10,12,15,0.6) 50%, rgba(10,12,15,0.82) 100%), url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
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
        {description && <p className="jb-page-hero-desc">{description}</p>}
        {showQuoteWidget && (
          <div className="jb-page-hero-widget">
            <QuoteSearchWidget locale={locale} currency={currency} />
          </div>
        )}
      </div>
    </section>
  );
}
