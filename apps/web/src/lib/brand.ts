import {
  BRAND_LOGO_FALLBACK,
  isOfficialLogoFlagEnabled,
  JETVINA_LOGO_PATHS,
  resolveLogoSrc,
  STATIC_BRAND_FALLBACK,
} from './brand-assets';

/** Brand constants — JetVina under SAFE_REFERENCE_MODE.
 * Official logo files live in /public/brand/jetvina (UNVERIFIED until client rights).
 * Do NOT hotlink JetVina assets. Never fall back to JetBay logos.
 */
export const BRAND_NAME = 'JetVina';
export const BRAND_LEGAL = 'JetVina';
export const BRAND_TAGLINE = 'Private Air Charter';

const isProductionRuntime = process.env.NEXT_PUBLIC_APP_ENV === 'production';

/**
 * Staging/dev: official PNG when flag not explicitly false.
 * Production (NEXT_PUBLIC_APP_ENV=production): force fallback while rights remain UNVERIFIED.
 * Note: do not key off NODE_ENV — Next `build` always sets NODE_ENV=production.
 */
export const JETVINA_OFFICIAL_LOGO_ENABLED = isProductionRuntime
  ? false
  : isOfficialLogoFlagEnabled() ||
    process.env.NEXT_PUBLIC_JETVINA_OFFICIAL_LOGO_ENABLED !== 'false';

const resolved = resolveLogoSrc('primary', {
  officialLogoEnabled: JETVINA_OFFICIAL_LOGO_ENABLED,
});

/** Active logo path for legacy call sites — prefer <BrandLogo />. */
export const BRAND_LOGO = resolved.src;
export const BRAND_LOGO_OFFICIAL = JETVINA_LOGO_PATHS.primary;
export const BRAND_LOGO_NEUTRAL = BRAND_LOGO_FALLBACK;
export const BRAND_RIGHTS_STATUS = 'UNVERIFIED' as const;

/** Hide unverified marketing claims until client-approved numbers. */
export const SHOW_UNVERIFIED_STATS = false;

/** Hide JetBay / unverified association & media logos. */
export const SHOW_UNVERIFIED_PARTNER_LOGOS = false;

/**
 * JetBay marketing sections (SOS, Jet Card, Partner, App download).
 * Prefer hide over leaving JetBay copy visible.
 */
export const SHOW_UNVERIFIED_MARKETING_SECTIONS =
  process.env.NEXT_PUBLIC_SHOW_UNVERIFIED_MARKETING === 'true';

/** Remap /media-seed/* (legacy JetBay path seeds) — see media-env / resolve-media-asset. */
export { BLOCK_JETBAY_MEDIA_ASSETS, PREFER_JETVINA_MEDIA } from './media-env';
export {
  JETVINA_MEDIA_LOCAL_MIRROR_ENABLED,
  JETVINA_MEDIA_PRODUCTION_ENABLED,
  JETVINA_MEDIA_REMOTE_REVIEW_ENABLED,
  IS_MEDIA_PRODUCTION,
} from './media-env';

export const BRAND_CONFIG = {
  ...STATIC_BRAND_FALLBACK,
  officialLogoEnabled: JETVINA_OFFICIAL_LOGO_ENABLED,
};

/** Normalize legacy JetBay / J-TA strings from CMS or scraped content */
export function rebrandText(text: string): string {
  return text
    .replace(/JetBay Inc\./gi, BRAND_LEGAL)
    .replace(/JetBay SOS/gi, `${BRAND_NAME} Air Ambulance`)
    .replace(/JetBay/gi, BRAND_NAME)
    .replace(/J\s*-\s*TA/g, BRAND_NAME)
    .replace(/J-TA/g, BRAND_NAME)
    .replace(/j-ta\.local/g, 'jetvina.local')
    .replace(/@j-ta\.local/g, '@jetvina.local')
    .replace(/jetbay\.local/gi, 'jetvina.local')
    .replace(/jet-bay\.com/gi, 'jetvina.local')
    .replace(/10,000\+\s*aircraft/gi, 'a global aircraft network')
    .replace(/10,000\+/g, '')
    .replace(/No\.?\s*1\b/gi, 'leading');
}
