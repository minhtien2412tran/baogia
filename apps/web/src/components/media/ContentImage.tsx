import { ResponsiveImage } from './ResponsiveImage';

type Aspect = 'hero' | 'service' | 'aircraft' | 'destination' | 'news' | 'logo';

const ASPECT: Record<Aspect, { ratio: string; objectFit: 'contain' | 'cover' }> = {
  hero: { ratio: '16 / 7', objectFit: 'cover' },
  service: { ratio: '4 / 3', objectFit: 'cover' },
  aircraft: { ratio: '16 / 9', objectFit: 'cover' },
  destination: { ratio: '3 / 2', objectFit: 'cover' },
  news: { ratio: '16 / 9', objectFit: 'cover' },
  logo: { ratio: 'auto', objectFit: 'contain' },
};

type Props = {
  src: string;
  alt: string;
  aspect?: Aspect;
  className?: string;
  priority?: boolean;
  sizes?: string;
  blocked?: boolean;
};

/**
 * Content image with aspect presets. When `blocked` (rights missing), renders nothing.
 */
export function ContentImage({
  src,
  alt,
  aspect = 'news',
  className,
  priority,
  sizes,
  blocked,
}: Props) {
  if (blocked || !src) return null;
  const preset = ASPECT[aspect];

  return (
    <div
      className={['content-image', className].filter(Boolean).join(' ')}
      style={
        preset.ratio === 'auto'
          ? undefined
          : { position: 'relative', aspectRatio: preset.ratio, width: '100%' }
      }
    >
      <ResponsiveImage
        src={src}
        alt={alt}
        fill={preset.ratio !== 'auto'}
        width={preset.ratio === 'auto' ? 200 : undefined}
        height={preset.ratio === 'auto' ? 80 : undefined}
        objectFit={preset.objectFit}
        priority={priority}
        sizes={sizes}
      />
    </div>
  );
}
