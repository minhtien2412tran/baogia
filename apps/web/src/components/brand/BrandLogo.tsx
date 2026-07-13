import Image from 'next/image';
import {
  BRAND_LOGO_FALLBACK,
  contextClassName,
  contextDefaultVariant,
  LOGO_INTRINSIC,
  resolveLogoSrc,
  type BrandLogoContext,
  type BrandLogoVariant,
} from '../../lib/brand-assets';
import { BRAND_NAME } from '../../lib/brand';

type Props = {
  variant?: BrandLogoVariant;
  context?: BrandLogoContext;
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
  officialLogoEnabled?: boolean;
};

/**
 * Shared brand logo. Paths come from brand-assets config (and optionally Brand API).
 * Do not hard-code logo URLs in Header/Footer/MobileMenu.
 */
export function BrandLogo({
  variant,
  context = 'header',
  priority,
  className,
  width,
  height,
  alt,
  officialLogoEnabled,
}: Props) {
  const resolvedVariant = variant ?? contextDefaultVariant(context);
  const { src, usingOfficial, rightsStatus } = resolveLogoSrc(resolvedVariant, {
    officialLogoEnabled,
  });

  const displayAlt =
    alt ?? (context === 'document' ? 'JetVina private jet charter' : BRAND_NAME);
  const cls = className ?? contextClassName(context);

  const w = width ?? (resolvedVariant === 'mark' ? 40 : 170);
  const h =
    height ??
    (Math.round((w * LOGO_INTRINSIC.height) / LOGO_INTRINSIC.width) || 40);

  // SVG fallback is not sized like the PNG; keep sensible box.
  const isFallback = src === BRAND_LOGO_FALLBACK;
  const imgW = isFallback ? Math.min(w, 160) : w;
  const imgH = isFallback ? 32 : h;

  return (
    <Image
      src={src}
      alt={displayAlt}
      width={imgW}
      height={imgH}
      className={cls}
      priority={priority}
      unoptimized
      data-brand-rights={rightsStatus}
      data-official-logo={usingOfficial ? 'true' : 'false'}
      style={{ display: 'block', width: imgW, height: 'auto', objectFit: 'contain' }}
    />
  );
}
