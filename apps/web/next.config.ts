import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));

/** Production must not hotlink jetvina.com — only allow remote patterns for staging/dev review. */
const isProductionApp = (process.env.NEXT_PUBLIC_APP_ENV || process.env.APP_ENV || '') === 'production';
const remoteReview =
  !isProductionApp && process.env.JETVINA_MEDIA_REMOTE_REVIEW_ENABLED !== 'false';

const nextConfig: NextConfig = {
  transpilePackages: ['@jetbay/ui', '@jetbay/i18n'],
  turbopack: {
    root: path.join(dir, '../..'),
  },
  images: {
    remotePatterns: remoteReview
      ? [
          {
            protocol: 'https',
            hostname: 'jetvina.com',
            pathname: '/wp-content/uploads/**',
          },
          {
            protocol: 'https',
            hostname: 'www.jetvina.com',
            pathname: '/wp-content/uploads/**',
          },
        ]
      : [],
  },
};

export default nextConfig;
