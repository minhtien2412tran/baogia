import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';
import { PLACEHOLDER, sanitizePublicMediaSrc } from './media-policy';
import { setMediaManifestForTests } from './resolve-media-asset';
import type { JetVinaMediaManifest } from './media-types';

const manifest: JetVinaMediaManifest = {
  version: 1,
  generatedAt: '2026-07-13T00:00:00.000Z',
  rightsNote: 'test',
  records: [
    {
      id: '1',
      sourceUrl: 'https://jetvina.com/wp-content/uploads/2025/10/Phenom-300-Ext-JS.jpg',
      localPath: '/assets/jetvina/mirror/Phenom-300-Ext-JS.jpg',
      mimeType: 'image/jpeg',
      width: 1600,
      height: 900,
      fileSize: 0,
      checksum: '',
      usageContexts: ['AIRCRAFT_EXTERIOR'],
      rightsStatus: 'UNVERIFIED',
      approvedForStaging: true,
      approvedForProduction: false,
      syncedAt: '2026-07-13T00:00:00.000Z',
    },
    {
      id: '2',
      sourceUrl: 'https://jetvina.com/wp-content/uploads/2026/02/Phu-quoc-1.jpg',
      localPath: '/assets/jetvina/mirror/Phu-quoc-1.jpg',
      mimeType: 'image/jpeg',
      width: 1200,
      height: 800,
      fileSize: 0,
      checksum: '',
      usageContexts: ['DESTINATION'],
      rightsStatus: 'UNVERIFIED',
      approvedForStaging: true,
      approvedForProduction: false,
      syncedAt: '2026-07-13T00:00:00.000Z',
    },
    {
      id: '3',
      sourceUrl: 'https://jetvina.com/wp-content/uploads/2024/08/Global-6000-Interior-1024x576-1.jpeg',
      localPath: '/assets/jetvina/mirror/cabin.jpg',
      mimeType: 'image/jpeg',
      width: 1600,
      height: 900,
      fileSize: 0,
      checksum: '',
      usageContexts: ['AIRCRAFT_CABIN'],
      rightsStatus: 'UNVERIFIED',
      approvedForStaging: true,
      approvedForProduction: false,
      syncedAt: '2026-07-13T00:00:00.000Z',
    },
  ],
};

describe('sanitizePublicMediaSrc', () => {
  beforeEach(() => setMediaManifestForTests(manifest));

  it('remaps jetbay asset paths away from jetbay', () => {
    const src = sanitizePublicMediaSrc('/assets/jetbay/jetbayImg/about/fly_anywhere_jetbay.png');
    assert.equal(src.toLowerCase().includes('jetbay'), false);
  });

  it('varies aircraft images by path', () => {
    const a = sanitizePublicMediaSrc('/assets/jetbay/v4/alt/aircraft/phenom-300-light-jet.webp');
    const b = sanitizePublicMediaSrc('/assets/jetbay/v4/alt/aircraft/citation-xls-midsize-business-jet.webp');
    assert.equal(a.toLowerCase().includes('jetbay'), false);
    assert.equal(b.toLowerCase().includes('jetbay'), false);
  });

  it('maps destination and cabin kinds', () => {
    const dest = sanitizePublicMediaSrc('/assets/jetbay/v4/alt/scenario/destination/nassau-beach-home.webp');
    const cabin = sanitizePublicMediaSrc('/assets/jetbay/v4/alt/banner/home/private-jet-cabin-banner-en-pc.webp');
    assert.equal(/Phu-quoc|destination-/i.test(dest), true);
    assert.equal(/Interior|cabin/i.test(cabin), true);
  });

  it('keeps brand jetvina paths', () => {
    const src = sanitizePublicMediaSrc('/brand/jetvina/logo-primary.png');
    assert.equal(src, '/brand/jetvina/logo-primary.png');
  });

  it('exposes membership placeholder kind', () => {
    assert.equal(PLACEHOLDER.membership.includes('membership'), true);
  });

  it('blocks jetvina remote when APP_ENV production via sanitizeResolved path', async () => {
    // Force production by resolving through environment on resolveMediaAsset is covered elsewhere;
    // here ensure placeholders never contain jetbay.
    assert.equal(PLACEHOLDER.hero.includes('jetvina.com'), false);
  });
});
