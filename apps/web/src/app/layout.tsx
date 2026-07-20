import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { Cormorant_Garamond, Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import { BRAND_NAME, BRAND_TAGLINE, JETVINA_OFFICIAL_LOGO_ENABLED } from '../lib/brand';
import { BRAND_APPLE_ICON, BRAND_FAVICON, BRAND_LOGO_FALLBACK, BRAND_OG_DEFAULT } from '../lib/brand-assets';
import { DEFAULT_LOCALE, getLocaleConfig } from '../config/locales';
import { DEFAULT_OG_IMAGE, siteMetadataBase } from '../lib/metadata';
import './globals.css';

const favicon = JETVINA_OFFICIAL_LOGO_ENABLED ? BRAND_FAVICON : BRAND_LOGO_FALLBACK;
const appleIcon = JETVINA_OFFICIAL_LOGO_ENABLED ? BRAND_APPLE_ICON : BRAND_LOGO_FALLBACK;
const ogImage = JETVINA_OFFICIAL_LOGO_ENABLED ? BRAND_OG_DEFAULT : DEFAULT_OG_IMAGE;

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
    icon: [{ url: favicon }],
    apple: appleIcon,
  },
  openGraph: {
    type: 'website',
    siteName: `${BRAND_NAME} Private Air Charter`,
    title: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
    description: 'Private air charter booking platform — request quotes, empty legs, and managed itineraries.',
    images: [{ url: ogImage, width: 1200, height: 630, alt: BRAND_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
    description: 'Private air charter booking platform — request quotes, empty legs, and managed itineraries.',
  },
  other: {
    google: 'notranslate',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0c0f',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerStore = await headers();
  const locale = headerStore.get('x-jb-locale') ?? DEFAULT_LOCALE;
  const htmlLang = getLocaleConfig(locale).htmlLang;

  return (
    // Site ships its own i18n — block browser auto-translate (e.g. Chrome
    // mangling "Charter" → "Hiến chương" and "English (US)" → "Tiếng Anh (Mỹ)").
    <html lang={htmlLang} translate="no" className="notranslate" data-scroll-behavior="smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${cormorant.variable}`}>{children}</body>
    </html>
  );
}
