import type {Metadata} from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap', weight: ['400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: 'Jetbay - Global Private Jet Charter',
  description: 'Access to 10,000+ Aircraft',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans text-gray-900 bg-white dark:bg-[#0B1121] dark:text-gray-100 antialiased selection:bg-[#40DACD] selection:text-white" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
