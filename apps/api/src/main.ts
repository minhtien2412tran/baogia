import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { stringify as yamlStringify } from 'yaml';
import helmet from 'helmet';
import { AppModule } from './app.module';

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
    throw new Error('JWT_SECRET must be set to a strong random value in production');
  }
  if (weak(process.env.REFRESH_TOKEN_SECRET)) {
    throw new Error('REFRESH_TOKEN_SECRET must be set to a strong random value in production');
  }
  if (!process.env.DATABASE_URL?.trim() || process.env.DATABASE_URL.includes('CHANGE_ME')) {
    throw new Error('DATABASE_URL must be set in production');
  }
  if (weak(process.env.API_KEY) || weak(process.env.PAYMENT_SECRET)) {
    throw new Error('API_KEY and PAYMENT_SECRET must be strong random values in production');
  }
}

async function bootstrap() {
  assertProductionSecrets();

  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.use(
    helmet({
      contentSecurityPolicy: false,
      // APIs serving browser clients must allow cross-origin reads
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  const corsOrigins = (process.env.CORS_ORIGIN ??
    'http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001')
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

  const isProd =
    process.env.APP_ENV === 'production' || process.env.NODE_ENV === 'production';
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
    servers.set(apiPublic, 'Current');
    servers.set('https://api.minhtien.online', 'Production (api.minhtien.online)');
    servers.set('http://127.0.0.1:4000', 'Local development');
  }
  let builder = new DocumentBuilder()
    .setTitle('JetBay API')
    .setDescription(
      [
        'Private jet booking platform API (JETBAY).',
        '',
        '**App key:** header `X-API-Key` (required on most routes; not needed for `/health`).',
        '**User auth:** `Authorization: Bearer <accessToken>` from `POST /auth/login`.',
        '**Health:** `GET /health` · **Integrations (no secrets):** `GET /integrations/status`',
        '**UI audit:** `GET /api-gateway/ui-audit`',
        '',
        'Production docs: https://docs.minhtien.online/swagger',
      ].join('\n'),
    )
    .setVersion(process.env.APP_VERSION ?? '1.0.0');
  for (const [url, name] of servers) {
    builder = builder.addServer(url, name);
  }
  const config = builder
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT accessToken from POST /auth/login (without Bearer prefix in Swagger field)',
      },
      'bearer',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'App identification key (same pattern as api.homefix.asia)',
      },
      'X-API-Key',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const expressApp = app.getHttpAdapter().getInstance();
  type Res = {
    setHeader: (k: string, v: string) => void;
    send: (d: unknown) => void;
    type: (t: string) => { send: (d: unknown) => void };
  };
  expressApp.get('/openapi.json', (_req: unknown, res: Res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send(document);
  });
  expressApp.get('/openapi.yaml', (_req: unknown, res: Res) => {
    res.setHeader('Content-Type', 'application/yaml; charset=utf-8');
    res.send(yamlStringify(document));
  });

  SwaggerModule.setup('swagger', app, document, {
    customSiteTitle: 'JetBay API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const host = process.env.HOST ?? '127.0.0.1';
  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, host);
  console.log(`Jet-Bay API listening on http://${host}:${port}`);
  console.log(`Swagger: http://${host}:${port}/swagger`);
  console.log(`OpenAPI JSON: http://${host}:${port}/openapi.json`);
  console.log(`OpenAPI YAML: http://${host}:${port}/openapi.yaml`);
}
bootstrap();
