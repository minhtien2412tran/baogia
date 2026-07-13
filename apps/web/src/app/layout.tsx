import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import { BRAND_NAME, BRAND_TAGLINE } from '../lib/brand';
import { DEFAULT_OG_IMAGE, siteMetadataBase } from '../lib/metadata';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const playfair = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});
const cormorant = Cormorant_Garamond({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: siteMetadataBase(),
  title: {
    default: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: 'Private air charter booking platform — request quotes, empty legs, and managed itineraries.',
  icons: {
    icon: [{ url: '/assets/brand/logo-placeholder.svg', type: 'image/svg+xml' }],
    apple: '/assets/brand/logo-placeholder.svg',
  },
  openGraph: {
    type: 'website',
    siteName: `${BRAND_NAME} Private Air Charter`,
    title: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
    description: 'Private air charter booking platform — request quotes, empty legs, and managed itineraries.',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: BRAND_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
    description: 'Private air charter booking platform — request quotes, empty legs, and managed itineraries.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0c0f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${cormorant.variable}`}>{children}</body>
    </html>
  );
}
