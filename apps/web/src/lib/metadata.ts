import type { Metadata } from 'next';

export function buildMetadata(opts: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const site = 'J-TA Private Jet Charter';
  return {
    title: `${opts.title} | ${site}`,
    description: opts.description,
    openGraph: {
      title: opts.title,
      description: opts.description,
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: opts.title, description: opts.description },
  };
}
