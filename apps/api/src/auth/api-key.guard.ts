import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { timingSafeEqual } from 'crypto';
import { IS_PUBLIC_KEY } from './public.decorator';

function normalizeApiKey(value: string | undefined | null): string {
  if (!value) return '';
  let trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    trimmed = trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

/**
 * Validates X-API-Key (app identification) — pattern from HomeFix / api.homefix.asia.
 * Skipped when @Public(). If API_KEY unset in non-production, allows (local DX).
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      url?: string;
      originalUrl?: string;
      path?: string;
    }>();
    const path = request.originalUrl ?? request.url ?? request.path ?? '';
    // Swagger UI + OpenAPI (docs host / probes)
    if (
      path.startsWith('/swagger') ||
      path.startsWith('/openapi.json') ||
      path.includes('/swagger-ui')
    ) {
      return true;
    }

    const validApiKey = normalizeApiKey(process.env.API_KEY);
    const env = process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development';
    if (!validApiKey) {
      if (env === 'production') {
        throw new UnauthorizedException('Server misconfigured: API_KEY missing');
      }
      return true;
    }

    const apiKey = normalizeApiKey(
      request.headers['x-api-key'] ?? request.headers['X-API-Key'],
    );

    if (!apiKey) {
      throw new UnauthorizedException('Missing X-API-Key header');
    }

    const a = Buffer.from(apiKey);
    const b = Buffer.from(validApiKey);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException('Invalid X-API-Key');
    }

    return true;
  }
}
