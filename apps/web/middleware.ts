import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DEFAULT_LOCALE, isValidLocale } from './src/config/locales';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Standalone client progress report — no locale redirect
  if (pathname === '/baocaotiendo' || pathname.startsWith('/baocaotiendo/')) {
    return NextResponse.next();
  }

  const segment = pathname.split('/')[1];
  if (segment && !isValidLocale(segment) && !pathname.startsWith('/_next') && !pathname.includes('.')) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|placeholders).*)'],
};
