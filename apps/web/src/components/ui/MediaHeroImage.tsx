import { CdnImage } from './CdnImage';

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  variant?: 'standard' | 'wide';
};

/** Constrained hero / featured image (16:9 or 21:9, object-fit cover). */
export function MediaHeroImage({ src, alt, priority, variant = 'standard' }: Props) {
  return (
    <div className={`jb-media-hero${variant === 'wide' ? ' jb-media-hero--wide' : ''}`}>
      <CdnImage
        src={src}
        alt={alt}
        fill
        className="jb-media-hero__img"
        priority={priority}
        sizes="(max-width: 768px) 100vw, min(960px, 90vw)"
      />
    </div>
  );
}
