import Link from 'next/link';
import { navHref } from '../../config/navigation';
import { CdnImage } from '../ui/CdnImage';

export function PromoBannerRow({
  locale,
  items,
}: {
  locale: string;
  items: { image: string; title: string; href: string; cta: string }[];
}) {
  return (
    <div className="jb-promo-row">
      {items.map((item) => (
        <Link key={item.href} href={navHref(locale, item.href)} className="jb-promo-banner-card">
          <div className="jb-promo-banner-img jb-media-frame">
            <CdnImage src={item.image} alt={item.title} fill className="jb-promo-img" sizes="(max-width:768px) 100vw, 50vw" />
          </div>
          <div className="jb-promo-banner-body">
            <h3>{item.title}</h3>
            <span className="jb-link-gold">{item.cta} →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
