import type { Metadata } from 'next';
import { BRAND_NAME, BRAND_TAGLINE } from './brand';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
export const DEFAULT_OG_IMAGE = '/brand/jetvina/og-default.png';

export function siteMetadataBase(): URL {
  return new URL(SITE_URL);
}

export function buildMetadata(opts: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const site = `${BRAND_NAME} Private Jet Charter`;
  const image = opts.image ?? DEFAULT_OG_IMAGE;
  const url = opts.path ? new URL(opts.path, siteMetadataBase()).toString() : siteMetadataBase().toString();

  return {
    title: `${opts.title} | ${site}`,
    description: opts.description,
    openGraph: {
      title: opts.title,
      description: opts.description,
      type: 'website',
      siteName: site,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: `${BRAND_NAME} — ${BRAND_TAGLINE}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}
