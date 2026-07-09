import { buildMetadata } from './metadata';
import { getPageContent } from './page-content';

/** Optional CMS slug override — fetches `/content/pages/:slug` to supplement static copy */
export const PAGE_CMS_SLUG: Partial<Record<string, string>> = {
  'about-us': 'about-us',
  'booking-process': 'booking-process',
};

export function servicePageMetadata(pageKey: string) {
  const c = getPageContent(pageKey);
  return buildMetadata({
    title: c?.title ?? 'JetBay',
    description: c?.description ?? 'Private jet charter',
  });
}
