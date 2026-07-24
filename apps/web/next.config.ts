import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));

/** Hotlink jetvina.com — independent of JETVINA_MEDIA_PRODUCTION_ENABLED (local mirror). */
const allowJetvinaRemote = process.env.NEXT_PUBLIC_ALLOW_JETVINA_REMOTE === 'true';

const isProductionApp = (process.env.NEXT_PUBLIC_APP_ENV || process.env.APP_ENV || '') === 'production';
const remoteReview =
  allowJetvinaRemote ||
  process.env.JETVINA_MEDIA_REMOTE_REVIEW_ENABLED === 'true' ||
  (!isProductionApp && process.env.JETVINA_MEDIA_REMOTE_REVIEW_ENABLED !== 'false');

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
