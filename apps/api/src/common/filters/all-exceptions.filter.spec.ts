import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppErrorCode } from '../errors/app-error-codes';

function mockHost(path = '/test', method = 'GET') {
  const headers: Record<string, string> = {};
  let statusCode = 0;
  let body: unknown;
  const res = {
    setHeader: (k: string, v: string) => {
      headers[k.toLowerCase()] = v;
    },
    status: (code: number) => {
      statusCode = code;
      return {
        json: (b: unknown) => {
          body = b;
        },
      };
    },
  };
  const req = {
    method,
    url: path,
    originalUrl: path,
    headers: {} as Record<string, string>,
  };
  return {
    host: {
      getType: () => 'http' as const,
      switchToHttp: () => ({
        getResponse: () => res,
        getRequest: () => req,
      }),
    },
    get statusCode() {
      return statusCode;
    },
    get body() {
      return body as Record<string, unknown>;
    },
    get headers() {
      return headers;
    },
  };
}

describe('AllExceptionsFilter', () => {
  const filter = new AllExceptionsFilter();
  const prevEnv = process.env.APP_ENV;

  afterEach(() => {
    process.env.APP_ENV = prevEnv;
  });

  it('maps HttpException to stable envelope', () => {
    const ctx = mockHost('/quotes/request');
    filter.catch(new HttpException('Nope', HttpStatus.BAD_REQUEST), ctx.host as never);
    expect(ctx.statusCode).toBe(400);
    expect(ctx.body.statusCode).toBe(400);
    expect(ctx.body.code).toBe(AppErrorCode.BAD_REQUEST);
    expect(ctx.body.message).toBe('Nope');
    expect(ctx.body.path).toBe('/quotes/request');
    expect(ctx.body.requestId).toBeTruthy();
    expect(ctx.headers['x-request-id']).toBe(ctx.body.requestId);
  });

  it('marks validation array as VALIDATION_FAILED', () => {
    const ctx = mockHost();
    filter.catch(
      new HttpException(
        { statusCode: 400, message: ['email must be an email'], error: 'Bad Request' },
        HttpStatus.BAD_REQUEST,
      ),
      ctx.host as never,
    );
    expect(ctx.body.code).toBe(AppErrorCode.VALIDATION_FAILED);
    expect(ctx.body.message).toEqual(['email must be an email']);
  });

  it('maps Prisma P2002 to 409', () => {
    const ctx = mockHost();
    const err = new Prisma.PrismaClientKnownRequestError('Unique', {
      code: 'P2002',
      clientVersion: 'test',
      meta: { target: ['email'] },
    });
    filter.catch(err, ctx.host as never);
    expect(ctx.statusCode).toBe(409);
    expect(ctx.body.code).toBe(AppErrorCode.PRISMA_UNIQUE);
  });

  it('hides 500 message in production', () => {
    process.env.APP_ENV = 'production';
    const ctx = mockHost();
    filter.catch(new Error('secret stack dump'), ctx.host as never);
    expect(ctx.statusCode).toBe(500);
    expect(ctx.body.message).toBe('Internal server error');
    expect(ctx.body.code).toBe(AppErrorCode.INTERNAL_ERROR);
  });
});
