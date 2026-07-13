import {
  BLOCK_JETBAY_MEDIA_ASSETS,
  IS_MEDIA_PRODUCTION,
  JETVINA_MEDIA_REMOTE_REVIEW_ENABLED,
  PREFER_JETVINA_MEDIA,
} from './media-env';
import {
  isJetBayMediaPath,
  isJetvinaRemoteUrl,
  resolveMediaAsset,
  sanitizeResolvedSrc,
  usageContextFromPath,
} from './resolve-media-asset';

export type PlaceholderKind =
  | 'aircraft'
  | 'service'
  | 'destination'
  | 'news'
  | 'membership'
  | 'cabin'
  | 'hero'
  | 'map';

const KIND_TO_CONTEXT = {
  aircraft: 'AIRCRAFT_EXTERIOR',
  service: 'SERVICE',
  destination: 'DESTINATION',
  news: 'NEWS',
  membership: 'MEMBERSHIP',
  cabin: 'AIRCRAFT_CABIN',
  hero: 'HERO',
  map: 'MAP',
} as const;

/** Stable placeholder/demo paths (never remote JetVina). */
export const PLACEHOLDER: Record<PlaceholderKind, string> = {
  aircraft: '/placeholders/demo/aircraft-01.svg',
  service: '/placeholders/demo/service-01.svg',
  destination: '/placeholders/demo/destination-01.svg',
  news: '/placeholders/demo/news-01.svg',
  membership: '/placeholders/demo/membership-01.svg',
  cabin: '/placeholders/demo/cabin-01.svg',
  hero: '/placeholders/demo/hero-01.svg',
  map: '/placeholders/demo/map-01.svg',
};

function guessKind(path: string): PlaceholderKind {
  const ctx = usageContextFromPath(path);
  if (ctx === 'AIRCRAFT_CABIN') return 'cabin';
  if (ctx === 'MAP' || ctx === 'CONTACT') return 'map';
  if (ctx === 'DESTINATION') return 'destination';
  if (ctx === 'NEWS') return 'news';
  if (ctx === 'MEMBERSHIP') return 'membership';
  if (ctx === 'HERO') return 'hero';
  if (ctx === 'AIRCRAFT_EXTERIOR' || ctx === 'EMPTY_LEG') return 'aircraft';
  return 'service';
}

/**
 * Remap JetBay mirrors → resolveMediaAsset (JetVina local/remote review or placeholder).
 * Production never returns jetvina.com hotlinks.
 */
export function sanitizePublicMediaSrc(src: string, kind?: PlaceholderKind): string {
  if (!src) return PLACEHOLDER.service;

  // Absolute JetVina remote in production → placeholder
  if (isJetvinaRemoteUrl(src)) {
    return sanitizeResolvedSrc(src, kind ? KIND_TO_CONTEXT[kind] : usageContextFromPath(src), src);
  }

  if (!BLOCK_JETBAY_MEDIA_ASSETS) return src;
  if (!isJetBayMediaPath(src)) return src;

  const resolvedKind = kind ?? guessKind(src);
  const resolved = resolveMediaAsset({
    context: KIND_TO_CONTEXT[resolvedKind],
    seed: src,
    fallbackKind: resolvedKind,
  });
  return resolved.src;
}

export {
  BLOCK_JETBAY_MEDIA_ASSETS,
  IS_MEDIA_PRODUCTION,
  JETVINA_MEDIA_REMOTE_REVIEW_ENABLED,
  PREFER_JETVINA_MEDIA,
  resolveMediaAsset,
};
