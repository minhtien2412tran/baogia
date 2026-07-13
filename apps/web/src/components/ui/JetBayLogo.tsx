import { BrandLogo } from '../brand/BrandLogo';
import { JETVINA_OFFICIAL_LOGO_ENABLED } from '../../lib/brand';
import type { BrandLogoContext, BrandLogoVariant } from '../../lib/brand-assets';

type Props = {
  className?: string;
  priority?: boolean;
  variant?: BrandLogoVariant;
  context?: BrandLogoContext;
};

/** @deprecated Prefer BrandLogo — kept so existing Header/Footer imports keep working. */
export function JetBayLogo({ className, priority, variant, context = 'header' }: Props) {
  return (
    <BrandLogo
      variant={variant}
      context={context}
      priority={priority}
      className={className}
      officialLogoEnabled={JETVINA_OFFICIAL_LOGO_ENABLED}
    />
  );
}
