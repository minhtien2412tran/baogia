/**
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
