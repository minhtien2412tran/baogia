import { PageHero } from './PageHero';

export function SubPageLayout({
  locale,
  title,
  description,
  tag,
  breadcrumb,
  heroImage,
  showQuoteWidget,
  children,
}: {
  locale: string;
  title: string;
  description?: string;
  tag?: string;
  breadcrumb?: { label: string; href?: string }[];
  heroImage?: string;
  showQuoteWidget?: boolean;
  children: React.ReactNode;
}) {
  return (
    <main className="jb-subpage">
      <PageHero
        locale={locale}
        title={title}
        description={description}
        tag={tag}
        breadcrumb={breadcrumb}
        heroImage={heroImage}
        showQuoteWidget={showQuoteWidget}
      />
      <div className="jb-container jb-sub-body">{children}</div>
    </main>
  );
}
