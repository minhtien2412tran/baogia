import {
  BLOCK_JETBAY_MEDIA_ASSETS,
  getMediaEnvironment,
  JETVINA_MEDIA_LOCAL_MIRROR_ENABLED,
  JETVINA_MEDIA_REMOTE_REVIEW_ENABLED,
  PREFER_JETVINA_MEDIA,
} from './media-env';
import { buildCatalogManifest } from './jetvina-manifest-builder';
import type {
  JetVinaMediaManifest,
  JetVinaMediaRecord,
  MediaUsageContext,
  ResolveMediaInput,
  ResolvedMedia,
} from './media-types';
import diskManifest from '../../public/brand/jetvina/jetvina-media-manifest.json';

const DEMO: Record<string, readonly string[]> = {
  aircraft: [
    '/placeholders/demo/aircraft-01.svg',
    '/placeholders/demo/aircraft-02.svg',
    '/placeholders/demo/aircraft-03.svg',
  ],
  service: ['/placeholders/demo/service-01.svg', '/placeholders/demo/service-02.svg'],
  destination: [
    '/placeholders/demo/destination-01.svg',
    '/placeholders/demo/destination-02.svg',
    '/placeholders/demo/destination-03.svg',
  ],
  news: ['/placeholders/demo/news-01.svg', '/placeholders/demo/news-02.svg'],
  membership: ['/placeholders/demo/membership-01.svg'],
  cabin: ['/placeholders/demo/cabin-01.svg'],
  hero: ['/placeholders/demo/hero-01.svg'],
  map: ['/placeholders/demo/map-01.svg'],
  generic: ['/placeholders/demo/service-01.svg'],
};

const DEMO_SIZE: Record<string, { width: number; height: number }> = {
  aircraft: { width: 1600, height: 900 },
  cabin: { width: 1600, height: 900 },
  destination: { width: 1200, height: 800 },
  news: { width: 1600, height: 900 },
  membership: { width: 800, height: 400 },
  hero: { width: 1920, height: 1080 },
  map: { width: 800, height: 500 },
  service: { width: 1200, height: 900 },
  generic: { width: 1200, height: 900 },
};

let cachedManifest: JetVinaMediaManifest | null = null;

/** Inject/override manifest (tests + sync-generated module). */
export function setMediaManifestForTests(manifest: JetVinaMediaManifest | null): void {
  cachedManifest = manifest;
}

export function getMediaManifest(): JetVinaMediaManifest {
  if (cachedManifest) return cachedManifest;
  const disk = diskManifest as JetVinaMediaManifest | undefined;
  if (disk?.records?.length) {
    cachedManifest = disk;
    return cachedManifest;
  }
  cachedManifest = buildCatalogManifest();
  return cachedManifest;
}

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

function pickDemo(kind: string, seed: string): ResolvedMedia {
  const pool = DEMO[kind] ?? DEMO.generic!;
  const src = pool[hashSeed(seed) % pool.length]!;
  const size = DEMO_SIZE[kind] ?? DEMO_SIZE.generic!;
  return {
    src,
    alt: 'Placeholder illustration',
    width: size.width,
    height: size.height,
    source: 'PLACEHOLDER',
    rightsStatus: 'N/A',
  };
}

function contextToFallbackKind(ctx: MediaUsageContext): string {
  switch (ctx) {
    case 'HERO':
      return 'hero';
    case 'AIRCRAFT_EXTERIOR':
    case 'EMPTY_LEG':
      return 'aircraft';
    case 'AIRCRAFT_CABIN':
      return 'cabin';
    case 'DESTINATION':
      return 'destination';
    case 'NEWS':
      return 'news';
    case 'MEMBERSHIP':
      return 'membership';
    case 'MAP':
    case 'CONTACT':
      return 'map';
    case 'CARGO':
    case 'MEDEVAC':
    case 'SERVICE':
    case 'ABOUT':
    default:
      return 'service';
  }
}

function recordMatchesContext(rec: JetVinaMediaRecord, ctx: MediaUsageContext): boolean {
  return rec.usageContexts.includes(ctx) || rec.usageContexts.includes('PLACEHOLDER');
}

function productionPublishEnabled(): boolean {
  return process.env.JETVINA_MEDIA_PRODUCTION_ENABLED === 'true';
}

function canUseInEnv(rec: JetVinaMediaRecord, env: ReturnType<typeof getMediaEnvironment>): boolean {
  if (rec.rightsStatus === 'PROHIBITED') return false;
  if (env === 'production') {
    if (!productionPublishEnabled()) return false;
    if (!rec.approvedForProduction) return false;
    if (!['OWNED', 'LICENSED', 'CLIENT_PROVIDED'].includes(rec.rightsStatus)) return false;
    return Boolean(rec.localPath && rec.checksum);
  }
  return rec.approvedForStaging;
}

function warnBlockedRemote(url: string): void {
  if (typeof window === 'undefined') {
    process.stderr.write(
      `${JSON.stringify({ level: 'warn', msg: 'blocked_jetvina_remote_in_production', url })}\n`,
    );
  }
}

/**
 * Central media resolver — components must not decide rights themselves.
 * Priority: CLIENT/local approved → remote review (non-prod) → placeholder.
 * Never returns JetBay paths. Never returns JetVina remote in production.
 */
export function resolveMediaAsset(input: ResolveMediaInput): ResolvedMedia {
  const env = input.environment ?? getMediaEnvironment();
  const seed = input.seed ?? input.preferredId ?? input.context;
  const fallbackKind = input.fallbackKind === 'generic' ? 'generic' : (input.fallbackKind ?? contextToFallbackKind(input.context));

  const manifest = getMediaManifest();
  const pool = manifest.records.filter((r) => recordMatchesContext(r, input.context) && canUseInEnv(r, env));

  let chosen: JetVinaMediaRecord | undefined;
  if (input.preferredId) {
    chosen = pool.find((r) => r.id === input.preferredId);
  }
  if (!chosen && pool.length) {
    chosen = pool[hashSeed(seed) % pool.length];
  }

  if (chosen) {
    const useLocal =
      JETVINA_MEDIA_LOCAL_MIRROR_ENABLED && Boolean(chosen.localPath) && Boolean(chosen.checksum);

    if (env === 'production') {
      if (useLocal && chosen.localPath) {
        return {
          src: chosen.localPath,
          alt: chosen.altText ?? 'JetVina media',
          width: chosen.width,
          height: chosen.height,
          source: 'LOCAL_JETVINA',
          rightsStatus: chosen.rightsStatus,
          objectPosition: chosen.objectPositionDesktop,
        };
      }
      return pickDemo(fallbackKind, seed);
    }

    // staging / development — local mirror only when checksum proves file synced
    if (useLocal && chosen.localPath) {
      return {
        src: chosen.localPath,
        alt: chosen.altText ?? 'JetVina media',
        width: chosen.width,
        height: chosen.height,
        source: 'LOCAL_JETVINA',
        rightsStatus: chosen.rightsStatus,
        objectPosition: chosen.objectPositionDesktop,
      };
    }

    if (PREFER_JETVINA_MEDIA && JETVINA_MEDIA_REMOTE_REVIEW_ENABLED && chosen.sourceUrl) {
      return {
        src: chosen.sourceUrl,
        alt: chosen.altText ?? 'JetVina media (staging review)',
        width: chosen.width,
        height: chosen.height,
        source: 'REMOTE_JETVINA_REVIEW',
        rightsStatus: chosen.rightsStatus,
        objectPosition: chosen.objectPositionDesktop,
      };
    }
  }

  if (!PREFER_JETVINA_MEDIA) {
    return pickDemo(fallbackKind, seed);
  }

  // Prefer remote catalog URLs in non-prod even without checksum/local mirror
  if (env !== 'production' && JETVINA_MEDIA_REMOTE_REVIEW_ENABLED && PREFER_JETVINA_MEDIA) {
    const fromManifest = manifest.records.filter((r) => recordMatchesContext(r, input.context));
    if (fromManifest.length) {
      const rec = fromManifest[hashSeed(seed) % fromManifest.length]!;
      return {
        src: rec.sourceUrl,
        alt: rec.altText ?? 'JetVina media (staging review)',
        width: rec.width,
        height: rec.height,
        source: 'REMOTE_JETVINA_REVIEW',
        rightsStatus: 'UNVERIFIED',
        objectPosition: rec.objectPositionDesktop,
      };
    }
  }

  return pickDemo(fallbackKind, seed);
}

export function isJetBayMediaPath(src: string): boolean {
  const lower = src.toLowerCase();
  return (
    lower.includes('/assets/jetbay/') ||
    lower.includes('jetbayimg') ||
    lower.includes('jet-bay.com') ||
    lower.includes('asserts.jet-bay')
  );
}

export function isJetvinaRemoteUrl(src: string): boolean {
  try {
    const u = new URL(src);
    return u.protocol === 'https:' && (u.hostname === 'jetvina.com' || u.hostname === 'www.jetvina.com');
  } catch {
    return false;
  }
}

/**
 * Sanitize any public image src: block JetBay, block JetVina remote in production.
 */
export function sanitizeResolvedSrc(src: string, context: MediaUsageContext, seed?: string): string {
  if (BLOCK_JETBAY_MEDIA_ASSETS && isJetBayMediaPath(src)) {
    return resolveMediaAsset({ context, seed: seed ?? src }).src;
  }
  if (isJetvinaRemoteUrl(src) && getMediaEnvironment() === 'production') {
    warnBlockedRemote(src);
    return resolveMediaAsset({ context, seed: seed ?? src, environment: 'production' }).src;
  }
  return src;
}

export function usageContextFromPath(path: string): MediaUsageContext {
  const p = path.toLowerCase();
  if (p.includes('cabin') || p.includes('interior') || p.includes('evaluatebg')) return 'AIRCRAFT_CABIN';
  if (p.includes('/map/') || p.includes('office')) return 'MAP';
  if (
    p.includes('destination') ||
    p.includes('island') ||
    p.includes('ski') ||
    p.includes('golf') ||
    p.includes('hot-route') ||
    p.includes('beach')
  ) {
    return 'DESTINATION';
  }
  if (p.includes('news') || p.includes('blog') || p.includes('article') || p.includes('knowledges')) return 'NEWS';
  if (p.includes('member') || p.includes('partner') || p.includes('award') || p.includes('media') || p.includes('logo')) {
    return 'MEMBERSHIP';
  }
  if (p.includes('banner') || p.includes('hero') || p.includes('home/global')) return 'HERO';
  if (p.includes('aircraft') || p.includes('fleet') || p.includes('jet') || p.includes('plane') || p.includes('empty')) {
    return 'AIRCRAFT_EXTERIOR';
  }
  if (p.includes('cargo')) return 'CARGO';
  if (p.includes('ambulance') || p.includes('medevac') || p.includes('sos')) return 'MEDEVAC';
  return 'SERVICE';
}
