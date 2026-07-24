import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { AuthUser } from './auth.types';

/**
 * @deprecated R4/R5 — no route imports this guard anymore.
 * Prefer `StaffGuard` + `PermissionGuard` + `@RequirePermissions(...)`.
 * Kept for reference until R5 removes the file.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    if (request.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }
    return true;
  }
}
