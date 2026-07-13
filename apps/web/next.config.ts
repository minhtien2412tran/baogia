import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  transpilePackages: ['@jetbay/ui', '@jetbay/i18n'],
  turbopack: {
    root: path.join(dir, '../..'),
  },
};

export default nextConfig;
