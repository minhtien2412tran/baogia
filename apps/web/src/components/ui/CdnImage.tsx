import Image from 'next/image';
import { localAsset } from '../../config/jetbay-cdn';
import { sanitizePublicMediaSrc } from '../../lib/media-policy';

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  sizes?: string;
};

export function CdnImage({ src, alt, width, height, fill, className, style, priority, sizes }: Props) {
  const url = sanitizePublicMediaSrc(localAsset(src));
  if (fill) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        className={className}
        style={style}
        priority={priority}
        sizes={sizes ?? '100vw'}
        unoptimized
      />
    );
  }
  return (
    <Image
      src={url}
      alt={alt}
      width={width ?? 800}
      height={height ?? 500}
      className={className}
      style={style}
      priority={priority}
      unoptimized
    />
  );
}

export function cdnBg(src: string): React.CSSProperties {
  return {
    backgroundImage: `url(${sanitizePublicMediaSrc(localAsset(src))})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
}
