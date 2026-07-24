'use client';

import Image from 'next/image';
import { useState } from 'react';
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
  fallbackSrc?: string;
};

const DEFAULT_FALLBACK = '/brand/jetvina/logo-fallback.svg';

/**
 * CDN/remote image with single-shot onError fallback (no retry loop).
 */
export function CdnImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  style,
  priority,
  sizes,
  fallbackSrc = DEFAULT_FALLBACK,
}: Props) {
  const primary = sanitizePublicMediaSrc(localAsset(src)) || fallbackSrc;
  const [url, setUrl] = useState(primary);
  const [failed, setFailed] = useState(false);

  function onError() {
    if (failed) return;
    setFailed(true);
    setUrl(fallbackSrc);
  }

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
        onError={onError}
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
      onError={onError}
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
