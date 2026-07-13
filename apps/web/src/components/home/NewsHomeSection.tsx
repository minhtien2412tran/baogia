import Link from 'next/link';
import { api, safeApi } from '../../lib/api';
import { apiLocale } from '../../config/locales';
import { navHref } from '../../config/navigation';
import { JB } from '../../config/jetbay-cdn';
import { rebrandText } from '../../lib/brand';
import { CdnImage } from '../ui/CdnImage';
import { EmptyState } from '../ui/EmptyState';
import { t } from '../../lib/i18n';

export async function NewsHomeSection({ locale }: { locale: string }) {
  const data = await safeApi(() => api.getNews(apiLocale(locale)), { news: [] });
  const items = data.news.slice(0, 3);

  return (
    <section className="jb-section jb-light-band">
      <div className="jb-container">
        <div className="jb-section-head">
          <h2 className="jb-section-title">{t(locale, 'latestNews')}</h2>
          {items.length > 0 ? (
            <Link href={navHref(locale, '/news')} className="jb-link-gold">
              {t(locale, 'viewAll')} ›
            </Link>
          ) : null}
        </div>

        {items.length === 0 ? (
          <EmptyState
            variant="light"
            icon="news"
            title={t(locale, 'noNewsTitle')}
            description={t(locale, 'noNewsDesc')}
            action={{ label: t(locale, 'noNewsCta'), href: navHref(locale, '/private-jet-charter') }}
          />
        ) : (
          <div className="jb-news-grid">
            {items.map((article: Record<string, unknown>) => {
              const thumb = article.thumbnail ? String(article.thumbnail) : JB.pages.newsDefault;
              const title = rebrandText(String(article.title ?? article.slug));
              const excerpt = article.excerpt ? rebrandText(String(article.excerpt)) : null;
              return (
                <Link
                  key={String(article.slug)}
                  href={navHref(locale, `/news/${article.slug}`)}
                  className="jb-news-card"
                >
                  <div className="jb-news-card-img">
                    <CdnImage
                      src={thumb}
                      alt={title}
                      fill
                      className="jb-cover-img"
                      sizes="(max-width:768px) 100vw, 360px"
                    />
                  </div>
                  <div className="jb-news-card-body">
                    <h3>{title}</h3>
                    {excerpt ? <p>{excerpt}</p> : null}
                    {article.publishedAt ? (
                      <time className="jb-news-date" dateTime={String(article.publishedAt)}>
                        {new Date(String(article.publishedAt)).toLocaleDateString(locale)}
                      </time>
                    ) : null}
                    <span className="jb-news-card-cta">{t(locale, 'readMore')} →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
