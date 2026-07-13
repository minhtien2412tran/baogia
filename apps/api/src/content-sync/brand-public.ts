import { canPublishRights } from './url-safety';

export type BrandLogoBundle = {
  logoPrimary: string;
  logoLight: string;
  logoDark: string;
  logoMark: string;
  favicon: string;
  ogImage: string;
  logoFallback: string;
  rightsStatus: string;
  /** Staging/dev preview flag — ignored when isProduction=true */
  officialLogoEnabled: boolean;
  /** Simulated or real production environment */
  isProduction?: boolean;
};

/**
 * Public logo exposure rules:
 * - OWNED/LICENSED/CLIENT_PROVIDED/PUBLIC_DOMAIN → official paths
 * - UNVERIFIED + staging flag + NOT production → official paths (preview)
 * - otherwise → neutral fallback (never JetBay)
 */
export function resolvePublicBrandLogos(input: BrandLogoBundle) {
  const canPublish = canPublishRights(input.rightsStatus);
  const stagingPreview =
    Boolean(input.officialLogoEnabled) && !input.isProduction;
  const expose = canPublish || stagingPreview;
  const fb = input.logoFallback;
  return {
    canPublishLogo: canPublish,
    usingOfficialLogo: expose,
    publicLogoPrimary: expose ? input.logoPrimary : fb,
    publicLogoLight: expose ? input.logoLight : fb,
    publicLogoDark: expose ? input.logoDark : fb,
    publicLogoMark: expose ? input.logoMark : fb,
    publicFavicon: expose ? input.favicon : fb,
    publicOgImage: expose ? input.ogImage : fb,
  };
}

const JETBAY_PUBLIC_RE = /jetbay|jet-bay|jet bay/i;

/** Fail-soft sanitizer for public brand JSON (never leak JetBay strings). */
export function assertNoJetBayPublicBrand(
  payload: Record<string, unknown>,
): string[] {
  const hits: string[] = [];
  const walk = (v: unknown, path: string) => {
    if (typeof v === 'string' && JETBAY_PUBLIC_RE.test(v))
      hits.push(`${path}=${v}`);
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
    else if (v && typeof v === 'object') {
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        walk(val, path ? `${path}.${k}` : k);
      }
    }
  };
  walk(payload, '');
  return hits;
}
