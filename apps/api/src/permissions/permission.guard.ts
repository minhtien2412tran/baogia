import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AuthUser } from '../auth/auth.types';
import { PermissionService } from './permission.service';
import { PERMISSIONS_KEY } from './require-permissions.decorator';
import type { Permission } from './permission.catalog';
import { ADMIN_ROLE } from './permission.catalog';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissions: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required?.length) return true;

    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    const user = request.user;
    if (!user) throw new ForbiddenException('Authentication required');
    if (user.role === ADMIN_ROLE) return true;

    for (const perm of required) {
      const ok = await this.permissions.hasPermission(
        user.userId,
        user.role,
        perm,
      );
      if (ok) return true;
    }

    throw new ForbiddenException({
      statusCode: 403,
      message: 'Insufficient permission',
      required: required,
    });
  }
}
