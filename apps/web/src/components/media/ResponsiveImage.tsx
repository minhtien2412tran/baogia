import Image from 'next/image';

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover';
  fallbackSrc?: string;
};

const DEFAULT_FALLBACK = '/brand/jetvina/logo-fallback.svg';

/** Next Image wrapper with sizes + object-fit defaults to limit CLS. */
export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  fill,
  sizes = '(max-width: 768px) 100vw, 50vw',
  className,
  priority,
  objectFit = 'cover',
  fallbackSrc = DEFAULT_FALLBACK,
}: Props) {
  const safeSrc = src || fallbackSrc;

  if (fill) {
    return (
      <Image
        src={safeSrc}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        priority={priority}
        unoptimized
        style={{ objectFit }}
      />
    );
  }

  return (
    <Image
      src={safeSrc}
      alt={alt}
      width={width ?? 800}
      height={height ?? 500}
      sizes={sizes}
      className={className}
      priority={priority}
      unoptimized
      style={{ objectFit, width: '100%', height: 'auto' }}
    />
  );
}
