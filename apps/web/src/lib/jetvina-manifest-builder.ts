import type { JetVinaMediaManifest, MediaUsageContext } from './media-types';
import { JETVINA_MEDIA } from './jetvina-media-catalog';

const CONTEXT_BY_KIND: Record<keyof typeof JETVINA_MEDIA, MediaUsageContext[]> = {
  aircraft: ['AIRCRAFT_EXTERIOR', 'EMPTY_LEG'],
  cabin: ['AIRCRAFT_CABIN'],
  destination: ['DESTINATION'],
  hero: ['HERO'],
  news: ['NEWS'],
  service: ['SERVICE', 'ABOUT', 'CARGO'],
  membership: ['MEMBERSHIP'],
  map: ['MAP', 'CONTACT'],
};

function fileNameFromUrl(url: string): string {
  try {
    return decodeURIComponent(url.split('/').pop() || 'asset').replace(/[^\w.\-]+/g, '_');
  } catch {
    return 'asset';
  }
}

function guessMime(url: string): string {
  const lower = url.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.avif')) return 'image/avif';
  if (lower.endsWith('.jpeg') || lower.endsWith('.jpg')) return 'image/jpeg';
  return 'image/jpeg';
}

/** Build staging catalog entries (UNVERIFIED) from curated URL lists. */
export function buildCatalogManifest(syncedAt = new Date().toISOString()): JetVinaMediaManifest {
  const records = [];
  let i = 0;
  for (const [kind, urls] of Object.entries(JETVINA_MEDIA) as [keyof typeof JETVINA_MEDIA, readonly string[]][]) {
    for (const sourceUrl of urls) {
      i += 1;
      const file = fileNameFromUrl(sourceUrl);
      records.push({
        id: `jv-cat-${kind}-${i}`,
        sourceUrl,
        localPath: `/assets/jetvina/mirror/${file}`,
        mimeType: guessMime(sourceUrl),
        width: kind === 'hero' ? 1920 : 1600,
        height: kind === 'hero' ? 1080 : 900,
        fileSize: 0,
        checksum: '',
        altText: `JetVina ${kind} media (UNVERIFIED staging review)`,
        usageContexts: CONTEXT_BY_KIND[kind],
        rightsStatus: 'UNVERIFIED' as const,
        approvedForStaging: true,
        approvedForProduction: false,
        syncedAt,
      });
    }
  }
  return {
    version: 1,
    generatedAt: syncedAt,
    rightsNote:
      'CLIENT_DIRECTED staging review only. rightsStatus=UNVERIFIED until OWNED|LICENSED|CLIENT_PROVIDED. Not production-publishable.',
    records,
  };
}
