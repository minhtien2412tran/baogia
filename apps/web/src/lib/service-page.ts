import { buildMetadata } from './metadata';
import { getPageContent } from './page-content';

export function servicePageMetadata(pageKey: string) {
  const c = getPageContent(pageKey);
  return buildMetadata({
    title: c?.title ?? 'J-TA',
    description: c?.description ?? 'Private jet charter',
  });
}
