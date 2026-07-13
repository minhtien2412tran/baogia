import { canPublishBrandLogo, type BrandRightsStatus } from './brand-rights';

export type BrandLogoVariant = 'primary' | 'light' | 'dark' | 'mark';
export type BrandLogoContext = 'header' | 'mobile' | 'footer' | 'email' | 'document';

/** Official JetVina files stored locally (no hotlink). Rights: UNVERIFIED until client approval. */
export const JETVINA_LOGO_PATHS: Record<BrandLogoVariant, string> = {
  primary: '/brand/jetvina/logo-primary.png',
  light: '/brand/jetvina/logo-light.png',
  dark: '/brand/jetvina/logo-dark.png',
  mark: '/brand/jetvina/logo-mark.png',
};

/** Neutral wordmark — not presented as the official JetVina logo file. */
export const BRAND_LOGO_FALLBACK = '/brand/jetvina/logo-fallback.svg';

export const BRAND_FAVICON = '/brand/jetvina/favicon-32x32.png';
export const BRAND_APPLE_ICON = '/brand/jetvina/apple-touch-icon.png';
export const BRAND_OG_DEFAULT = '/brand/jetvina/og-default.png';

export const DEFAULT_BRAND_RIGHTS: BrandRightsStatus = 'UNVERIFIED';

/** Intrinsic size of logo-primary.png (keep aspect; do not distort). */
export const LOGO_INTRINSIC = { width: 800, height: 510 } as const;

export type PublicBrandConfig = {
  brandName: string;
  legalName: string;
  tagline: string;
  logoPrimary: string;
  logoLight: string;
  logoDark: string;
  logoMark: string;
  favicon: string;
  ogImage: string;
  primaryColor: string;
  secondaryColor: string;
  contactPhone: string | null;
  contactEmail: string | null;
  whatsapp: string | null;
  socialLinks: Array<{ label: string; href: string }>;
  rightsStatus: BrandRightsStatus;
  rightsEvidence: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  officialLogoEnabled: boolean;
  showUnverifiedStats: boolean;
  showUnverifiedPartnerLogos: boolean;
};

export const STATIC_BRAND_FALLBACK: PublicBrandConfig = {
  brandName: 'JetVina',
  legalName: 'JetVina',
  tagline: 'Private Air Charter',
  logoPrimary: JETVINA_LOGO_PATHS.primary,
  logoLight: JETVINA_LOGO_PATHS.light,
  logoDark: JETVINA_LOGO_PATHS.dark,
  logoMark: JETVINA_LOGO_PATHS.mark,
  favicon: BRAND_FAVICON,
  ogImage: BRAND_OG_DEFAULT,
  primaryColor: '#c9a45c',
  secondaryColor: '#0a0c0f',
  contactPhone: null,
  contactEmail: null,
  whatsapp: null,
  socialLinks: [],
  rightsStatus: DEFAULT_BRAND_RIGHTS,
  rightsEvidence: 'Downloaded from jetvina.com for staging audit — not client-cleared',
  approvedBy: null,
  approvedAt: null,
  officialLogoEnabled: false,
  showUnverifiedStats: false,
  showUnverifiedPartnerLogos: false,
};

export function isOfficialLogoFlagEnabled(
  envValue: string | undefined = process.env.NEXT_PUBLIC_JETVINA_OFFICIAL_LOGO_ENABLED,
): boolean {
  return envValue === 'true';
}

/**
 * Public logo path for UI. Never returns JetBay assets.
 * Official PNG only when rights publishable OR staging flag is on.
 */
export function resolveLogoSrc(
  variant: BrandLogoVariant,
  opts?: {
    rightsStatus?: BrandRightsStatus;
    officialLogoEnabled?: boolean;
    paths?: Partial<Record<BrandLogoVariant, string>>;
  },
): { src: string; usingOfficial: boolean; rightsStatus: BrandRightsStatus } {
  const rightsStatus = opts?.rightsStatus ?? DEFAULT_BRAND_RIGHTS;
  const flagOn = opts?.officialLogoEnabled ?? isOfficialLogoFlagEnabled();
  const allowOfficial = canPublishBrandLogo(rightsStatus) || flagOn;
  const paths = { ...JETVINA_LOGO_PATHS, ...opts?.paths };

  if (!allowOfficial) {
    return { src: BRAND_LOGO_FALLBACK, usingOfficial: false, rightsStatus };
  }

  return { src: paths[variant], usingOfficial: true, rightsStatus };
}

export function contextDefaultVariant(context: BrandLogoContext): BrandLogoVariant {
  if (context === 'email' || context === 'document') return 'primary';
  if (context === 'mobile') return 'primary';
  return 'primary';
}

export function contextClassName(context: BrandLogoContext): string {
  switch (context) {
    case 'footer':
      return 'brand-logo brand-logo--footer jb-logo-img';
    case 'mobile':
      return 'brand-logo brand-logo--mobile jb-logo-img';
    case 'email':
    case 'document':
      return 'brand-logo brand-logo--header jb-logo-img';
    default:
      return 'brand-logo brand-logo--header jb-logo-img';
  }
}
