import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PLACEHOLDER, sanitizePublicMediaSrc } from './media-policy';

describe('sanitizePublicMediaSrc', () => {
  it('remaps jetbay asset paths to neutral placeholders when blocked', () => {
    // Default BLOCK_JETBAY_MEDIA_ASSETS is true unless ALLOW flag set
    const src = sanitizePublicMediaSrc('/assets/jetbay/jetbayImg/about/fly_anywhere_jetbay.png');
    assert.equal(src.startsWith('/placeholders/'), true);
    assert.equal(src.toLowerCase().includes('jetbay'), false);
  });

  it('keeps brand jetvina paths', () => {
    const src = sanitizePublicMediaSrc('/brand/jetvina/logo-primary.png');
    assert.equal(src, '/brand/jetvina/logo-primary.png');
  });

  it('exposes membership placeholder kind', () => {
    assert.equal(PLACEHOLDER.membership.includes('membership'), true);
  });
});
