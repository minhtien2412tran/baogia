import type { INestApplication } from '@nestjs/common';
import { timingSafeEqual } from 'crypto';
import type { Request, Response, NextFunction } from 'express';

function unauthorized(res: Response) {
  res.setHeader('WWW-Authenticate', 'Basic realm="JetVina API Docs"');
  res.status(401).send('Authentication required');
}

function parseBasic(
  header: string | undefined,
): { user: string; pass: string } | null {
  if (!header || !header.startsWith('Basic ')) return null;
  try {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
    const i = decoded.indexOf(':');
    if (i < 0) return null;
    return { user: decoded.slice(0, i), pass: decoded.slice(i + 1) };
  } catch {
    return null;
  }
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Protect /swagger + OpenAPI when SWAGGER_BASIC_USER + SWAGGER_BASIC_PASSWORD are set. */
export function installSwaggerBasicAuth(app: INestApplication): void {
  const user = process.env.SWAGGER_BASIC_USER?.trim();
  const pass = process.env.SWAGGER_BASIC_PASSWORD?.trim();
  if (!user || !pass) return;

  const paths = ['/swagger', '/openapi.json', '/openapi.yaml', '/swagger-json'];

  app.use((req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl || req.url || '';
    const hit = paths.some(
      (p) => url === p || url.startsWith(`${p}?`) || url.startsWith(`${p}/`),
    );
    if (!hit) return next();

    const creds = parseBasic(req.headers.authorization);
    if (
      creds &&
      safeEqual(creds.user, user) &&
      safeEqual(creds.pass, pass)
    ) {
      return next();
    }
    return unauthorized(res);
  });

  console.log(
    'Swagger/OpenAPI protected with HTTP Basic (SWAGGER_BASIC_USER set)',
  );
}
