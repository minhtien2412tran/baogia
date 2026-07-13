import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';
import {
  resolveMediaAsset,
  setMediaManifestForTests,
  isJetvinaRemoteUrl,
} from './resolve-media-asset';
import type { JetVinaMediaManifest } from './media-types';

const sampleManifest: JetVinaMediaManifest = {
  version: 1,
  generatedAt: '2026-07-13T00:00:00.000Z',
  rightsNote: 'test',
  records: [
    {
      id: 'jv-plane-1',
      sourceUrl: 'https://jetvina.com/wp-content/uploads/2024/08/flyprivatejet-flugzeuge-global60001.jpg',
      localPath: '/assets/jetvina/mirror/flyprivatejet-flugzeuge-global60001.jpg',
      mimeType: 'image/jpeg',
      width: 1600,
      height: 900,
      fileSize: 100,
      checksum: '',
      altText: 'Global 6000',
      usageContexts: ['AIRCRAFT_EXTERIOR', 'HERO', 'EMPTY_LEG'],
      rightsStatus: 'UNVERIFIED',
      approvedForStaging: true,
      approvedForProduction: false,
      syncedAt: '2026-07-13T00:00:00.000Z',
    },
    {
      id: 'jv-plane-prod',
      sourceUrl: 'https://jetvina.com/wp-content/uploads/2024/08/flyprivatejet-flugzeuge-global60001.jpg',
      localPath: '/assets/jetvina/mirror/approved-plane.jpg',
      mimeType: 'image/jpeg',
      width: 1600,
      height: 900,
      fileSize: 100,
      checksum: 'abc123',
      altText: 'Approved plane',
      usageContexts: ['AIRCRAFT_EXTERIOR'],
      rightsStatus: 'CLIENT_PROVIDED',
      approvedForStaging: true,
      approvedForProduction: true,
      syncedAt: '2026-07-13T00:00:00.000Z',
    },
    {
      id: 'jv-dest',
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
  ],
};

describe('resolveMediaAsset', () => {
  beforeEach(() => {
    setMediaManifestForTests(sampleManifest);
  });

  it('prefers remote JetVina for staging/dev review', () => {
    const r = resolveMediaAsset({
      context: 'AIRCRAFT_EXTERIOR',
      preferredId: 'jv-plane-1',
      environment: 'development',
    });
    assert.equal(r.source, 'REMOTE_JETVINA_REVIEW');
    assert.equal(isJetvinaRemoteUrl(r.src), true);
    assert.equal(r.rightsStatus, 'UNVERIFIED');
  });

  it('never returns remote JetVina in production for unverified', () => {
    const r = resolveMediaAsset({
      context: 'AIRCRAFT_EXTERIOR',
      preferredId: 'jv-plane-1',
      environment: 'production',
    });
    assert.notEqual(r.source, 'REMOTE_JETVINA_REVIEW');
    assert.equal(r.src.startsWith('/placeholders/'), true);
  });

  it('uses local CLIENT_PROVIDED mirror in production when flag on', () => {
    const prev = process.env.JETVINA_MEDIA_PRODUCTION_ENABLED;
    process.env.JETVINA_MEDIA_PRODUCTION_ENABLED = 'true';
    const r = resolveMediaAsset({
      context: 'AIRCRAFT_EXTERIOR',
      preferredId: 'jv-plane-prod',
      environment: 'production',
    });
    assert.equal(r.source, 'LOCAL_JETVINA');
    assert.equal(r.src, '/assets/jetvina/mirror/approved-plane.jpg');
    assert.equal(r.src.includes('jetvina.com'), false);
    process.env.JETVINA_MEDIA_PRODUCTION_ENABLED = prev;
  });

  it('maps destination context separately from aircraft', () => {
    const dest = resolveMediaAsset({ context: 'DESTINATION', seed: 'x', environment: 'development' });
    assert.equal(dest.src.includes('Phu-quoc') || dest.src.includes('destination'), true);
  });

  it('never falls back to JetBay paths', () => {
    const r = resolveMediaAsset({ context: 'SERVICE', seed: '/assets/jetbay/x.png', environment: 'production' });
    assert.equal(r.src.toLowerCase().includes('jetbay'), false);
  });
});
