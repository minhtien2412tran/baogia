/**
 * JetVina / public media environment flags.
 * CLIENT_DIRECTED staging preference ≠ OWNED / LICENSED / CLIENT_PROVIDED.
 */

export type AppMediaEnv = 'development' | 'staging' | 'production';

export function getMediaEnvironment(): AppMediaEnv {
  const app = (process.env.NEXT_PUBLIC_APP_ENV || process.env.APP_ENV || '').toLowerCase();
  if (app === 'production') return 'production';
  if (app === 'staging') return 'staging';
  return 'development';
}

export const IS_MEDIA_PRODUCTION = getMediaEnvironment() === 'production';

/** Prefer JetVina when remapping blocked JetBay paths (dev/staging review). */
export const PREFER_JETVINA_MEDIA = process.env.NEXT_PUBLIC_PREFER_JETVINA_MEDIA !== 'false';

/**
 * Allow hotlink to jetvina.com for review only (never production).
 * Server-side flag preferred; NEXT_PUBLIC_ is not a security boundary alone.
 */
export const JETVINA_MEDIA_REMOTE_REVIEW_ENABLED =
  !IS_MEDIA_PRODUCTION && process.env.JETVINA_MEDIA_REMOTE_REVIEW_ENABLED !== 'false';

/** Prefer local mirror files under /assets/jetvina/mirror when present. */
export const JETVINA_MEDIA_LOCAL_MIRROR_ENABLED =
  process.env.JETVINA_MEDIA_LOCAL_MIRROR_ENABLED !== 'false';

/**
 * Publish JetVina media in production only after written rights + approvedForProduction.
 * Default false while rightsStatus remains UNVERIFIED.
 */
export const JETVINA_MEDIA_PRODUCTION_ENABLED =
  process.env.JETVINA_MEDIA_PRODUCTION_ENABLED === 'true';

export const BLOCK_JETBAY_MEDIA_ASSETS = process.env.NEXT_PUBLIC_ALLOW_JETBAY_MEDIA !== 'true';
