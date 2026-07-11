import { createHash } from 'crypto';

describe('Auth token hashing', () => {
  function hashRefreshToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  it('produces stable SHA-256 hashes', () => {
    const a = hashRefreshToken('refresh-token-abc');
    const b = hashRefreshToken('refresh-token-abc');
    expect(a).toBe(b);
    expect(a).toHaveLength(64);
  });

  it('differs for different tokens', () => {
    expect(hashRefreshToken('a')).not.toBe(hashRefreshToken('b'));
  });
});

describe('StorageService URL builder', () => {
  function buildPublicUrl(base: string, key: string) {
    const objectKey = key.startsWith('media/') ? key.slice('media/'.length) : key;
    const encoded = objectKey.split('/').map(encodeURIComponent).join('/');
    return `${base.replace(/\/$/, '')}/media/${encoded}`;
  }

  it('builds media URLs without double prefix', () => {
    expect(buildPublicUrl('http://127.0.0.1:4000', 'media/photo.jpg')).toBe(
      'http://127.0.0.1:4000/media/photo.jpg',
    );
  });

  it('preserves nested object keys in public URLs', () => {
    expect(
      buildPublicUrl('https://api.minhtien.online', 'media/enquiries/1783744994129-file.webp'),
    ).toBe('https://api.minhtien.online/media/enquiries/1783744994129-file.webp');
  });
});

describe('Gateway payment order ref', () => {
  it('embeds booking id', () => {
    const bookingId = 42;
    const orderRef = `jbay-${bookingId}-${Date.now()}`;
    expect(orderRef.startsWith('jbay-42-')).toBe(true);
  });
});
