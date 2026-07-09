import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeyGuard } from './api-key.guard';

function mockContext(headers: Record<string, string> = {}) {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
    }),
  } as never;
}

describe('ApiKeyGuard', () => {
  const prev = { ...process.env };

  afterEach(() => {
    process.env = { ...prev };
  });

  it('allows @Public routes', () => {
    process.env.API_KEY = 'secret-key-value-here';
    const reflector = { getAllAndOverride: () => true } as unknown as Reflector;
    const guard = new ApiKeyGuard(reflector);
    expect(guard.canActivate(mockContext())).toBe(true);
  });

  it('accepts matching X-API-Key', () => {
    process.env.API_KEY = 'secret-key-value-here';
    process.env.APP_ENV = 'production';
    const reflector = { getAllAndOverride: () => false } as unknown as Reflector;
    const guard = new ApiKeyGuard(reflector);
    expect(guard.canActivate(mockContext({ 'x-api-key': 'secret-key-value-here' }))).toBe(true);
  });

  it('rejects missing key in production', () => {
    process.env.API_KEY = 'secret-key-value-here';
    process.env.APP_ENV = 'production';
    const reflector = { getAllAndOverride: () => false } as unknown as Reflector;
    const guard = new ApiKeyGuard(reflector);
    expect(() => guard.canActivate(mockContext())).toThrow(UnauthorizedException);
  });

  it('allows missing API_KEY config in development', () => {
    delete process.env.API_KEY;
    process.env.APP_ENV = 'development';
    const reflector = { getAllAndOverride: () => false } as unknown as Reflector;
    const guard = new ApiKeyGuard(reflector);
    expect(guard.canActivate(mockContext())).toBe(true);
  });
});
