import { BRAND_LOGO, BRAND_NAME } from '../../lib/brand';

type Props = {
  className?: string;
  priority?: boolean;
};

/** Brand wordmark — internal placeholder until CLIENT_PROVIDED logo is approved. */
export function JetBayLogo({ className = 'jb-logo-img', priority }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={BRAND_LOGO}
      alt={BRAND_NAME}
      className={className}
      width={120}
      height={32}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
    />
  );
}
