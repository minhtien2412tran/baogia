import { api, safeApi } from './api';

export type ContentPageData = {
  title?: string;
  excerpt?: string;
  body?: string;
  seoMeta?: { title?: string; description?: string };
};

export async function fetchContentPage(slug: string, locale: string): Promise<ContentPageData | null> {
  return safeApi(() => api.getContentPage(slug, locale), null as ContentPageData | null);
}

export function contentSeo(page: ContentPageData | null) {
  return page?.seoMeta;
}
