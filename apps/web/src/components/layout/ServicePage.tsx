import Link from 'next/link';
import { SubPageLayout } from './SubPageLayout';
import { getPageContent } from '../../lib/page-content';
import { navHref } from '../../config/navigation';

export function ServicePage({ locale, pageKey }: { locale: string; pageKey: string }) {
  const content = getPageContent(pageKey);
  if (!content) {
    return (
      <SubPageLayout locale={locale} title="Page not found">
        <p className="jb-section-desc">This page is not available.</p>
      </SubPageLayout>
    );
  }

  return (
    <SubPageLayout
      locale={locale}
      title={content.title}
      description={content.hero}
      tag={content.tag}
      breadcrumb={[{ label: 'Home', href: '' }, { label: content.title }]}
    >
      {content.sections.map((s) => (
        <section key={s.heading} className="jb-content-block">
          <h2>{s.heading}</h2>
          <p>{s.body}</p>
          {s.bullets && (
            <ul className="jb-bullet-list">
              {s.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
      {content.cta && (
        <div className="jb-cta-row" style={{ marginTop: 32 }}>
          <Link href={navHref(locale, content.cta.href)} className="jb-btn-primary">
            {content.cta.label}
          </Link>
        </div>
      )}
    </SubPageLayout>
  );
}
