import { JETBAY_LOGO } from '../../config/jetbay-cdn';

type Props = {
  className?: string;
  priority?: boolean;
};

/** Crisp vector logo — avoids blurry webp upscale on Retina */
export function JetBayLogo({ className = 'jb-logo-img', priority }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={JETBAY_LOGO}
      alt="JetBay"
      className={className}
      width={120}
      height={32}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
    />
  );
}
