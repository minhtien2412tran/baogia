import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from '../services/permission.service';
import { PERMISSION_KEY_META } from './permission.decorator';
import type { PermissionKey } from '../constants/permissions';
import type { AuthUser } from './auth.types';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissions: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const key = this.reflector.getAllAndOverride<PermissionKey | undefined>(
      PERMISSION_KEY_META,
      [context.getHandler(), context.getClass()],
    );
    if (!key) return true;

    const request = context.switchToHttp().getRequest<{
      user?: AuthUser;
      ip?: string;
      headers?: Record<string, string | undefined>;
    }>();
    const user = request.user;
    if (!user) return false;

    const ip =
      (request.headers?.['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
      request.ip;
    await this.permissions.assertAllowed(user.userId, user.role, key, ip);
    return true;
  }
}
