import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  toDbLocale,
  toDefaultWebLocale,
  resolveLocaleFallbackChain,
  detectWebLocale,
  webLocalesForDb,
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
    assert.equal(toDbLocale('fr'), 'en');
    assert.equal(toDbLocale(''), 'en');
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
});
