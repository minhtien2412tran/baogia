import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { detectWebLocale } from '@jetbay/i18n';
import { DEFAULT_LOCALE, isValidLocale, LOCALE_COOKIE } from './src/config/locales';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/baocaotiendo' || pathname.startsWith('/baocaotiendo/')) {
    return NextResponse.next();
  }

  const segment = pathname.split('/')[1];
  const hasLocalePrefix = segment && isValidLocale(segment);

  if (!hasLocalePrefix && !pathname.startsWith('/_next') && !pathname.includes('.')) {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    const detected = detectWebLocale(request.headers.get('accept-language'), cookieLocale);
    const locale = isValidLocale(detected) ? detected : DEFAULT_LOCALE;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    const res = NextResponse.redirect(url);
    if (!cookieLocale) {
      res.cookies.set(LOCALE_COOKIE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
    }
    return res;
  }

  if (segment === 'en') {
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/en' ? '/en-us' : `/en-us${pathname.slice(3)}`;
    const redirect = NextResponse.redirect(url, 308);
    redirect.cookies.set(LOCALE_COOKIE, 'en-us', { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
    return redirect;
  }

  const res = NextResponse.next();
  if (hasLocalePrefix && segment) {
    res.cookies.set(LOCALE_COOKIE, segment, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|placeholders).*)'],
};
