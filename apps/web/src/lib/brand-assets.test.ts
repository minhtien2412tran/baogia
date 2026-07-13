import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  BRAND_LOGO_FALLBACK,
  JETVINA_LOGO_PATHS,
  resolveLogoSrc,
  contextDefaultVariant,
  LOGO_INTRINSIC,
} from './brand-assets';
import { canPublishBrandLogo } from './brand-rights';

describe('brand rights', () => {
  it('blocks UNVERIFIED from production publish', () => {
    assert.equal(canPublishBrandLogo('UNVERIFIED'), false);
    assert.equal(canPublishBrandLogo('PROHIBITED'), false);
  });

  it('allows CLIENT_PROVIDED / OWNED / LICENSED', () => {
    assert.equal(canPublishBrandLogo('CLIENT_PROVIDED'), true);
    assert.equal(canPublishBrandLogo('OWNED'), true);
    assert.equal(canPublishBrandLogo('LICENSED'), true);
  });
});

describe('resolveLogoSrc', () => {
  it('uses fallback when rights unverified and flag off', () => {
    const r = resolveLogoSrc('primary', {
      rightsStatus: 'UNVERIFIED',
      officialLogoEnabled: false,
    });
    assert.equal(r.src, BRAND_LOGO_FALLBACK);
    assert.equal(r.usingOfficial, false);
  });

  it('uses official PNG when staging flag on even if UNVERIFIED', () => {
    const r = resolveLogoSrc('primary', {
      rightsStatus: 'UNVERIFIED',
      officialLogoEnabled: true,
    });
    assert.equal(r.src, JETVINA_LOGO_PATHS.primary);
    assert.equal(r.usingOfficial, true);
  });

  it('selects variant paths', () => {
    const mark = resolveLogoSrc('mark', { officialLogoEnabled: true });
    assert.equal(mark.src, JETVINA_LOGO_PATHS.mark);
    const light = resolveLogoSrc('light', { officialLogoEnabled: true });
    assert.equal(light.src, JETVINA_LOGO_PATHS.light);
  });

  it('publishes official when CLIENT_PROVIDED without flag', () => {
    const r = resolveLogoSrc('dark', {
      rightsStatus: 'CLIENT_PROVIDED',
      officialLogoEnabled: false,
    });
    assert.equal(r.src, JETVINA_LOGO_PATHS.dark);
    assert.equal(r.usingOfficial, true);
  });

  it('never returns JetBay logo paths', () => {
    for (const v of ['primary', 'light', 'dark', 'mark'] as const) {
      const off = resolveLogoSrc(v, { officialLogoEnabled: false });
      const on = resolveLogoSrc(v, { officialLogoEnabled: true });
      assert.equal(off.src.includes('jetbay'), false);
      assert.equal(on.src.includes('jetbay'), false);
    }
  });
});

describe('logo aspect', () => {
  it('keeps intrinsic ratio for layout math', () => {
    assert.equal(LOGO_INTRINSIC.width, 800);
    assert.equal(LOGO_INTRINSIC.height, 510);
    const w = 170;
    const h = Math.round((w * LOGO_INTRINSIC.height) / LOGO_INTRINSIC.width);
    assert.equal(h, 108);
  });

  it('maps context to default variant', () => {
    assert.equal(contextDefaultVariant('header'), 'primary');
    assert.equal(contextDefaultVariant('footer'), 'primary');
  });
});
