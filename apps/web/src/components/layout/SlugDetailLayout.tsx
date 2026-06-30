import Link from 'next/link';
import { navHref } from '../../config/navigation';
import { cdnUrl } from '../../config/jetbay-cdn';
import { CdnImage } from '../ui/CdnImage';

export function SlugDetailLayout({
  locale,
  title,
  tag,
  heroImage,
  publishedAt,
  excerpt,
  breadcrumb,
  backHref,
  backLabel,
  children,
  footer,
}: {
  locale: string;
  title: string;
  tag?: string;
  heroImage?: string;
  publishedAt?: string;
  excerpt?: string;
  breadcrumb: { label: string; href?: string }[];
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const bg = heroImage ? cdnUrl(heroImage, 1920) : undefined;

  return (
    <main className="jb-subpage">
      <section
        className="jb-slug-hero"
        style={
          bg
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(10,12,15,0.35) 0%, rgba(10,12,15,0.92) 70%), url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        <div className="jb-container">
          <nav className="jb-breadcrumb jb-breadcrumb-light" aria-label="Breadcrumb">
            {breadcrumb.map((c, i) => (
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
          <h1 className="jb-slug-title">{title}</h1>
          {excerpt && <p className="jb-slug-excerpt">{excerpt}</p>}
          {publishedAt && <time className="jb-slug-date">{publishedAt.slice(0, 10)}</time>}
        </div>
      </section>

      <div className="jb-container jb-sub-body">
        <Link href={navHref(locale, backHref)} className="jb-back-link">← {backLabel}</Link>
        <article className="jb-slug-body">{children}</article>
      </div>
      {footer}
    </main>
  );
}

export function SlugHeroImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="jb-slug-featured-img">
      <CdnImage src={src} alt={alt} width={1200} height={630} className="jb-slug-featured-photo" priority />
    </div>
  );
}
