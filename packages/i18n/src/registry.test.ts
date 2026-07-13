import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  toDbLocale,
  toDefaultWebLocale,
  resolveLocaleFallbackChain,
  detectWebLocale,
  webLocalesForDb,
  isValidDbLocale,
  getWebLocaleConfig,
} from './registry';

describe('toDbLocale', () => {
  it('maps web en-us to canonical en', () => {
    assert.equal(toDbLocale('en-us'), 'en');
    assert.equal(toDbLocale('en'), 'en');
  });

  it('keeps zh regional codes', () => {
    assert.equal(toDbLocale('zh-cn'), 'zh-cn');
    assert.equal(toDbLocale('zh-hk'), 'zh-hk');
    assert.equal(toDbLocale('zh-tw'), 'zh-tw');
  });

  it('defaults unknown to en', () => {
    assert.equal(toDbLocale('xx'), 'en');
    assert.equal(toDbLocale(''), 'en');
  });

  it('maps tourism locales', () => {
    assert.equal(toDbLocale('fr'), 'fr');
    assert.equal(toDbLocale('ja-JP'), 'ja');
    assert.equal(toDbLocale('ar-AE'), 'ar');
  });
});

describe('isValidDbLocale', () => {
  it('accepts canonical DB codes only', () => {
    assert.equal(isValidDbLocale('en'), true);
    assert.equal(isValidDbLocale('zh-cn'), true);
    assert.equal(isValidDbLocale('vi'), true);
    assert.equal(isValidDbLocale('fr'), true);
    assert.equal(isValidDbLocale('ja'), true);
  });

  it('rejects web aliases and unknown codes', () => {
    assert.equal(isValidDbLocale('en-us'), false);
    assert.equal(isValidDbLocale('xx'), false);
    assert.equal(isValidDbLocale(''), false);
  });
});

describe('getWebLocaleConfig', () => {
  it('returns config for known code', () => {
    assert.equal(getWebLocaleConfig('zh-cn').currency, 'CNY');
  });

  it('falls back to en-us for unknown', () => {
    assert.equal(getWebLocaleConfig('xx').code, 'en-us');
  });
});

describe('reverse i18n', () => {
  it('db en maps to en-us web by default', () => {
    assert.equal(toDefaultWebLocale('en'), 'en-us');
  });

  it('multiple web locales share db en', () => {
    const codes = webLocalesForDb('en');
    assert.ok(codes.includes('en-us'));
    assert.ok(codes.includes('en'));
  });
});

describe('fallback chain', () => {
  it('zh-tw falls back through hk, cn, en', () => {
    assert.deepEqual(resolveLocaleFallbackChain('zh-tw'), ['zh-tw', 'zh-hk', 'zh-cn', 'en']);
  });

  it('vi falls back to en only', () => {
    assert.deepEqual(resolveLocaleFallbackChain('vi'), ['vi', 'en']);
  });
});

describe('detectWebLocale', () => {
  it('prefers cookie over accept-language', () => {
    assert.equal(detectWebLocale('vi,en;q=0.9', 'zh-cn'), 'zh-cn');
  });

  it('parses accept-language', () => {
    assert.equal(detectWebLocale('vi-VN,vi;q=0.9'), 'vi');
  });

  it('ignores malformed accept-language', () => {
    assert.equal(detectWebLocale(',,;'), 'en-us');
  });
});
