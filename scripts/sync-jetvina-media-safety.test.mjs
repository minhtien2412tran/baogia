import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  assertAllowedUrlShape,
  assertResolvedIpsSafe,
  isPrivateIp,
  sniffMime,
  validateDownloadedImage,
  MAX_BYTES,
} from './lib/jetvina-media-safety.mjs';

describe('jetvina-media-safety', () => {
  it('blocks non-allowlisted hosts', () => {
    assert.throws(() => assertAllowedUrlShape('https://evil.com/wp-content/uploads/x.jpg'));
  });

  it('blocks SVG paths', () => {
    assert.throws(() =>
      assertAllowedUrlShape('https://jetvina.com/wp-content/uploads/2024/logo.svg'),
    );
  });

  it('allows curated jetvina upload URLs', () => {
    const u = assertAllowedUrlShape(
      'https://jetvina.com/wp-content/uploads/2024/08/flyprivatejet-flugzeuge-global60001.jpg',
    );
    assert.equal(u.hostname, 'jetvina.com');
  });

  it('blocks private IPs for SSRF', () => {
    assert.equal(isPrivateIp('127.0.0.1'), true);
    assert.equal(isPrivateIp('10.0.0.1'), true);
    assert.throws(() => assertResolvedIpsSafe(['127.0.0.1']));
  });

  it('sniffs jpeg/png and rejects fake mime', () => {
    assert.equal(sniffMime(Buffer.from([0xff, 0xd8, 0xff, 0x00])), 'image/jpeg');
    assert.equal(sniffMime(Buffer.from('<svg></svg>')), null);
    assert.throws(() => validateDownloadedImage(Buffer.from('<svg></svg>'), 'image/svg+xml'));
  });

  it('blocks oversized buffers', () => {
    const huge = Buffer.alloc(MAX_BYTES + 1, 0xff);
    huge[0] = 0xff;
    huge[1] = 0xd8;
    huge[2] = 0xff;
    assert.throws(() => validateDownloadedImage(huge, 'image/jpeg'));
  });
});
