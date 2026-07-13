import {
  assertNoJetBayPublicBrand,
  resolvePublicBrandLogos,
} from './brand-public';

describe('resolvePublicBrandLogos', () => {
  const base = {
    logoPrimary: '/brand/jetvina/logo-primary.png',
    logoLight: '/brand/jetvina/logo-light.png',
    logoDark: '/brand/jetvina/logo-dark.png',
    logoMark: '/brand/jetvina/logo-mark.png',
    favicon: '/brand/jetvina/favicon-32x32.png',
    ogImage: '/brand/jetvina/og-default.png',
    logoFallback: '/brand/jetvina/logo-fallback.svg',
    rightsStatus: 'UNVERIFIED',
    officialLogoEnabled: false,
  };

  it('hides official logo when UNVERIFIED and flag off', () => {
    const r = resolvePublicBrandLogos(base);
    expect(r.canPublishLogo).toBe(false);
    expect(r.usingOfficialLogo).toBe(false);
    expect(r.publicLogoPrimary).toBe(base.logoFallback);
  });

  it('exposes official logo for staging flag when not production', () => {
    const r = resolvePublicBrandLogos({
      ...base,
      officialLogoEnabled: true,
      isProduction: false,
    });
    expect(r.publicLogoPrimary).toBe(base.logoPrimary);
    expect(r.canPublishLogo).toBe(false);
    expect(r.usingOfficialLogo).toBe(true);
  });

  it('production + UNVERIFIED never returns official logo even with flag', () => {
    const r = resolvePublicBrandLogos({
      ...base,
      officialLogoEnabled: true,
      isProduction: true,
    });
    expect(r.publicLogoPrimary).toBe(base.logoFallback);
    expect(r.usingOfficialLogo).toBe(false);
  });

  it('exposes official logo when CLIENT_PROVIDED', () => {
    const r = resolvePublicBrandLogos({
      ...base,
      rightsStatus: 'CLIENT_PROVIDED',
      officialLogoEnabled: false,
      isProduction: true,
    });
    expect(r.canPublishLogo).toBe(true);
    expect(r.publicLogoPrimary).toBe(base.logoPrimary);
  });

  it('detects JetBay strings in brand payload', () => {
    const hits = assertNoJetBayPublicBrand({
      brandName: 'JetVina',
      socialLinks: [{ label: 'IG', href: 'https://instagram.com/jetbay' }],
    });
    expect(hits.length).toBeGreaterThan(0);
  });

  it('passes clean JetVina brand payload', () => {
    const hits = assertNoJetBayPublicBrand({
      brandName: 'JetVina',
      logoPrimary: '/brand/jetvina/logo-primary.png',
    });
    expect(hits).toEqual([]);
  });
});
