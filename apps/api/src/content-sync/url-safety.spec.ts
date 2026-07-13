import {
  assertAllowedUrl,
  canPublishRights,
  canStoreCopyrightedHtml,
  contentHash,
} from './url-safety';

describe('contentHash', () => {
  it('is stable for same payload', () => {
    expect(contentHash({ a: 1, b: 'x' })).toBe(contentHash({ a: 1, b: 'x' }));
  });
  it('changes when payload changes', () => {
    expect(contentHash({ a: 1 })).not.toBe(contentHash({ a: 2 }));
  });
});

describe('assertAllowedUrl', () => {
  const allow = ['jetvina.com'];

  it('allows https jetvina.com', () => {
    const u = assertAllowedUrl('https://jetvina.com/wp-json/', allow);
    expect(u.hostname).toBe('jetvina.com');
  });

  it('blocks localhost', () => {
    expect(() => assertAllowedUrl('https://localhost/x', allow)).toThrow(/Localhost/);
  });

  it('blocks private IP', () => {
    expect(() => assertAllowedUrl('https://127.0.0.1/x', allow)).toThrow(/Private/);
  });

  it('blocks off-allowlist host', () => {
    expect(() => assertAllowedUrl('https://evil.example/x', allow)).toThrow(/allowlist/);
  });

  it('blocks http by default', () => {
    expect(() => assertAllowedUrl('http://jetvina.com/x', allow)).toThrow(/HTTPS/);
  });
});

describe('rights publish gate', () => {
  it('allows OWNED/LICENSED/CLIENT_PROVIDED/PUBLIC_DOMAIN', () => {
    expect(canPublishRights('OWNED')).toBe(true);
    expect(canPublishRights('LICENSED')).toBe(true);
    expect(canPublishRights('CLIENT_PROVIDED')).toBe(true);
    expect(canPublishRights('PUBLIC_DOMAIN')).toBe(true);
  });
  it('blocks UNVERIFIED and PROHIBITED', () => {
    expect(canPublishRights('UNVERIFIED')).toBe(false);
    expect(canPublishRights('PROHIBITED')).toBe(false);
  });
});

describe('SAFE_REFERENCE_MODE html policy', () => {
  it('does not allow storing copyrighted HTML', () => {
    expect(canStoreCopyrightedHtml('SAFE_REFERENCE_MODE')).toBe(false);
    expect(canStoreCopyrightedHtml('AUTHORIZED_DIRECT_SYNC')).toBe(true);
  });
});
