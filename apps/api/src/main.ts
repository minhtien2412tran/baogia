import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { stringify as yamlStringify } from 'yaml';
import helmet from 'helmet';
import { AppModule } from './app.module';
import {
  SWAGGER_API_DESCRIPTION,
  SWAGGER_TAG_META,
  enrichOpenApiDocument,
} from './swagger/openapi-enrichment';
import { normalizeSwaggerLang } from './swagger/swagger-locales';
import { SWAGGER_THEME_CSS } from './swagger/swagger-theme.css';
import { buildSwaggerI18nJs } from './swagger/swagger-i18n.client';
import { installSwaggerBasicAuth } from './swagger/swagger-basic-auth';
import type { NextFunction, Request, Response } from 'express';

function assertProductionSecrets() {
  const env = process.env.APP_ENV ?? process.env.NODE_ENV;
  if (env !== 'production') return;

  const weak = (v?: string) =>
    !v?.trim() ||
    v.includes('CHANGE_ME') ||
    v.includes('change-in-production') ||
    v === 'dev-jetbay-secret-change-in-production' ||
    v === 'dev-refresh-secret-change-in-production';

  if (weak(process.env.JWT_SECRET)) {
    throw new Error(
      'JWT_SECRET must be set to a strong random value in production',
    );
  }
  if (weak(process.env.REFRESH_TOKEN_SECRET)) {
    throw new Error(
      'REFRESH_TOKEN_SECRET must be set to a strong random value in production',
    );
  }
  if (
    !process.env.DATABASE_URL?.trim() ||
    process.env.DATABASE_URL.includes('CHANGE_ME')
  ) {
    throw new Error('DATABASE_URL must be set in production');
  }
  if (weak(process.env.API_KEY) || weak(process.env.PAYMENT_SECRET)) {
    throw new Error(
      'API_KEY and PAYMENT_SECRET must be strong random values in production',
    );
  }
}

function cloneDocument<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

function langFromRequest(req: { query?: Record<string, unknown>; headers?: Record<string, unknown> }): string {
  const q = req.query?.lang;
  if (typeof q === 'string' && q.trim()) return q;
  if (Array.isArray(q) && typeof q[0] === 'string') return q[0];
  const cookie = String(req.headers?.cookie ?? '');
  const m = cookie.match(/(?:^|;\s*)jb_swagger_lang=([^;]+)/);
  if (m?.[1]) return decodeURIComponent(m[1]);
  const accept = String(req.headers?.['accept-language'] ?? '');
  if (accept) return accept.split(',')[0] ?? 'en';
  return 'en';
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  assertProductionSecrets();

  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Nginx owns X-Frame-Options / X-Content-Type-Options / Referrer-Policy on prod
  // (avoids duplicate header values e.g. SAMEORIGIN,DENY — see S4).
  const nginxOwnsSecurityHeaders =
    process.env.APP_ENV === 'production' ||
    process.env.NGINX_SECURITY_HEADERS === '1';
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      ...(nginxOwnsSecurityHeaders
        ? {
            xFrameOptions: false,
            xContentTypeOptions: false,
            referrerPolicy: false,
          }
        : {}),
    }),
  );

  installSwaggerBasicAuth(app);

  const corsOrigins = (
    process.env.CORS_ORIGIN ??
    'http://localhost:3000,http://localhost:3001,http://localhost:3011,http://127.0.0.1:3000,http://127.0.0.1:3001,http://127.0.0.1:3011'
  )
    .split(',')
    .map((s) => s.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'Accept'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Keep the JSON body limit intentionally low. Return a clean 413 for
  // oversized probes/uploads instead of logging a full parser stack trace.
  app.use(
    (
      error: unknown,
      _req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      if (
        error &&
        typeof error === 'object' &&
        'type' in error &&
        error.type === 'entity.too.large'
      ) {
        res.status(413).json({
          statusCode: 413,
          message: 'Request body too large',
        });
        return;
      }
      next(error);
    },
  );

  const isProd =
    process.env.APP_ENV === 'production' ||
    process.env.NODE_ENV === 'production';
  const apiPublic =
    process.env.API_PUBLIC_URL?.replace(/\/$/, '') ||
    (isProd ? 'https://api.minhtien.online' : 'http://127.0.0.1:4000');

  const servers = new Map<string, string>();
  if (isProd) {
    servers.set('https://api.minhtien.online', 'Production');
    if (apiPublic !== 'https://api.minhtien.online') {
      servers.set(apiPublic, 'API_PUBLIC_URL');
    }
  } else {
    servers.set('http://127.0.0.1:4000', 'Local development');
    if (apiPublic !== 'http://127.0.0.1:4000') {
      servers.set(apiPublic, 'Current (API_PUBLIC_URL)');
    }
    servers.set('https://api.minhtien.online', 'Production');
  }

  let builder = new DocumentBuilder()
    .setTitle('JetVina API')
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(process.env.APP_VERSION ?? '1.0.0')
    .setContact('JetVina', 'https://www.minhtien.online', '')
    .setExternalDoc(
      'Human API reference (docs/API.md)',
      'https://github.com/minhtien2412tran/baogia/blob/main/docs/API.md',
    );

  for (const [url, name] of servers) {
    builder = builder.addServer(url, name);
  }
  for (const tag of SWAGGER_TAG_META) {
    builder = builder.addTag(tag.name, tag.description);
  }

  const config = builder
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'JWT accessToken from POST /auth/login (paste token only — Swagger adds Bearer)',
      },
      'bearer',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description:
          'App identification key (API_KEY). Required on most routes except /health and OpenAPI.',
      },
      'X-API-Key',
    )
    .build();

  const baseDocument = enrichOpenApiDocument(
    SwaggerModule.createDocument(app, config),
    'en',
  );

  const expressApp = app.getHttpAdapter().getInstance();
  type Req = {
    query?: Record<string, unknown>;
    headers?: Record<string, unknown>;
  };
  type Res = {
    setHeader: (k: string, v: string) => void;
    send: (d: unknown) => void;
    type: (t: string) => { send: (d: unknown) => void };
  };

  expressApp.get('/openapi.json', (req: Req, res: Res) => {
    const lang = normalizeSwaggerLang(langFromRequest(req));
    const doc = enrichOpenApiDocument(cloneDocument(baseDocument), lang);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Language', lang);
    res.send(doc);
  });
  expressApp.get('/openapi.yaml', (req: Req, res: Res) => {
    const lang = normalizeSwaggerLang(langFromRequest(req));
    const doc = enrichOpenApiDocument(cloneDocument(baseDocument), lang);
    res.setHeader('Content-Type', 'application/yaml; charset=utf-8');
    res.setHeader('Content-Language', lang);
    res.send(yamlStringify(doc));
  });

  SwaggerModule.setup('swagger', app, baseDocument, {
    customSiteTitle: 'JetVina API Docs',
    customCss: SWAGGER_THEME_CSS,
    customJsStr: buildSwaggerI18nJs(),
    patchDocumentOnRequest: (req, _res, document) => {
      const lang = normalizeSwaggerLang(langFromRequest(req as Req));
      return enrichOpenApiDocument(cloneDocument(document), lang);
    },
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      filter: true,
      displayRequestDuration: true,
      tryItOutEnabled: true,
      defaultModelsExpandDepth: -1,
      syntaxHighlight: { activate: true, theme: 'obsidian' },
    },
  });

  const host = process.env.HOST ?? '127.0.0.1';
  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, host);
  logger.log(`Jet-Bay API listening on http://${host}:${port}`);
  logger.log(`Swagger: http://${host}:${port}/swagger?lang=vi`);
  logger.log(`OpenAPI JSON: http://${host}:${port}/openapi.json?lang=vi`);
}
bootstrap();
