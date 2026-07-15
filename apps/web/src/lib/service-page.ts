import { buildMetadata } from './metadata';
import { getPageContent } from './page-content';

/**
 * CMS slug → `GET /content/pages/:slug` (optional supplement to static `PAGE_CONTENT`).
 * See docs/CHARTER_CMS_MAP.md (T-S3-01). Create matching Pages in Admin Content to override body.
 */
export const PAGE_CMS_SLUG: Partial<Record<string, string>> = {
  'about-us': 'about-us',
  'booking-process': 'booking-process',
  // Charter ×6 — slug = route key; CMS body injects below static hero/sections when published
  'private-jet-charter': 'private-jet-charter',
  'corporate-air-charter': 'corporate-air-charter',
  'group-air-charter': 'group-air-charter',
  'event-air-charter': 'event-air-charter',
  'air-ambulance': 'air-ambulance',
  'pet-travel': 'pet-travel',
};

export function servicePageMetadata(pageKey: string) {
  const c = getPageContent(pageKey);
  return buildMetadata({
    title: c?.title ?? 'JetVina',
    description: c?.description ?? 'Private jet charter',
  });
}
