import { BLOCK_JETBAY_MEDIA_ASSETS } from './brand';

export const PLACEHOLDER = {
  aircraft: '/placeholders/aircraft-placeholder.svg',
  service: '/placeholders/service-placeholder.svg',
  destination: '/placeholders/destination-placeholder.svg',
  news: '/placeholders/news-placeholder.svg',
  membership: '/placeholders/membership-placeholder.svg',
} as const;

export type PlaceholderKind = keyof typeof PLACEHOLDER;

function guessKind(path: string): PlaceholderKind {
  const p = path.toLowerCase();
  if (p.includes('destination') || p.includes('island') || p.includes('ski') || p.includes('golf')) {
    return 'destination';
  }
  if (p.includes('news') || p.includes('blog') || p.includes('article') || p.includes('video')) {
    return 'news';
  }
  if (p.includes('member') || p.includes('partner') || p.includes('award') || p.includes('media')) {
    return 'membership';
  }
  if (p.includes('aircraft') || p.includes('fleet') || p.includes('jet') || p.includes('plane')) {
    return 'aircraft';
  }
  return 'service';
}

/** Remap JetBay local mirror paths to neutral placeholders when blocked. */
export function sanitizePublicMediaSrc(src: string, kind?: PlaceholderKind): string {
  if (!BLOCK_JETBAY_MEDIA_ASSETS) return src;
  const lower = src.toLowerCase();
  if (
    lower.includes('/assets/jetbay/') ||
    lower.includes('jetbayimg') ||
    lower.includes('jet-bay.com') ||
    lower.includes('asserts.jet-bay')
  ) {
    return PLACEHOLDER[kind ?? guessKind(src)];
  }
  return src;
}
