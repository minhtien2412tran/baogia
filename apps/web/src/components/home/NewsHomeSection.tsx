import Link from 'next/link';
import { api, safeApi } from '../../lib/api';
import { apiLocale } from '../../config/locales';
import { navHref } from '../../config/navigation';

export async function NewsHomeSection({ locale }: { locale: string }) {
  const data = await safeApi(() => api.getNews(apiLocale(locale)), { news: [] });
  if (data.news.length === 0) return null;

  const items = data.news.slice(0, 3);

  return (
    <section className="jb-section jb-light-band">
      <div className="jb-container">
        <div className="jb-section-head">
          <h2 className="jb-section-title">Latest news</h2>
          <Link href={navHref(locale, '/news')} className="jb-link-gold">View all ›</Link>
        </div>
        <div className="jb-news-grid">
          {items.map((article: Record<string, unknown>) => (
            <Link
              key={String(article.slug)}
              href={navHref(locale, `/news/${article.slug}`)}
              className="jb-news-card"
            >
              <h3>{String(article.title ?? article.slug)}</h3>
              {article.excerpt ? <p>{String(article.excerpt)}</p> : null}
              {article.publishedAt ? (
                <time className="jb-news-date">
                  {new Date(String(article.publishedAt)).toLocaleDateString()}
                </time>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
