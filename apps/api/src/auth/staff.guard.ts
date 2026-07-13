import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import type { AuthUser } from './auth.types';

const STAFF_ROLES = new Set(['ADMIN', 'SALES', 'CONTRACT_APPROVER']);

/** Allows ADMIN / SALES / CONTRACT_APPROVER (finer checks via PermissionGuard). */
@Injectable()
export class StaffGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    if (!request.user || !STAFF_ROLES.has(request.user.role)) {
      throw new ForbiddenException('Staff access required');
    }
    return true;
  }
}
