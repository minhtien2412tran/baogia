#!/usr/bin/env node
/**
 * Fetch OpenAPI from a running JetBay API and generate @jetbay/api-client.
 *
 * Usage:
 *   node scripts/openapi/generate-client.mjs
 *   OPENAPI_URL=https://api.minhtien.online/openapi.json node scripts/openapi/generate-client.mjs
 */
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { stringify as yamlStringify } from 'yaml';

const require = createRequire(import.meta.url);
const { generate } = require('openapi-typescript-codegen');

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');
const pkgDir = join(root, 'packages/api-client');
const openapiDir = join(pkgDir, 'openapi');
const outDir = join(pkgDir, 'src/generated');

const OPENAPI_URL =
  process.env.OPENAPI_URL?.trim() ||
  (process.env.npm_lifecycle_event === 'openapi:client:prod'
    ? 'https://api.minhtien.online/openapi.json'
    : process.env.API_URL
      ? `${process.env.API_URL.replace(/\/$/, '')}/openapi.json`
      : 'http://127.0.0.1:4000/openapi.json');

async function main() {
  console.log(`[openapi] fetching ${OPENAPI_URL}`);
  const res = await fetch(OPENAPI_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch OpenAPI: ${res.status} ${res.statusText}`);
  }
  const document = await res.json();

  await mkdir(openapiDir, { recursive: true });
  const jsonPath = join(openapiDir, 'openapi.json');
  const yamlPath = join(openapiDir, 'openapi.yaml');
  await writeFile(jsonPath, JSON.stringify(document, null, 2) + '\n', 'utf8');
  await writeFile(yamlPath, yamlStringify(document), 'utf8');
  console.log(`[openapi] wrote ${jsonPath}`);
  console.log(`[openapi] wrote ${yamlPath}`);

  await rm(outDir, { recursive: true, force: true });
  await generate({
    input: jsonPath,
    output: outDir,
    httpClient: 'fetch',
    useOptions: true,
    useUnionTypes: true,
    exportCore: true,
    exportServices: true,
    exportModels: true,
    exportSchemas: false,
  });

  await writeFile(
    join(pkgDir, 'src/index.ts'),
    `/**
 * JetBay API TypeScript client (generated from OpenAPI).
 * Regenerate: pnpm openapi:client
 *
 * @example
 * import { OpenAPI, AuthService } from '@jetbay/api-client';
 * OpenAPI.BASE = 'https://api.minhtien.online';
 * OpenAPI.HEADERS = { 'X-API-Key': process.env.EXPO_PUBLIC_API_KEY! };
 * const session = await AuthService.authControllerLogin({ requestBody: { email, password } });
 * OpenAPI.TOKEN = session.tokens.accessToken;
 */
export { OpenAPI } from './generated';
export * from './generated';
`,
    'utf8',
  );

  console.log(`[openapi] generated client → ${outDir}`);
  console.log('[openapi] done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
