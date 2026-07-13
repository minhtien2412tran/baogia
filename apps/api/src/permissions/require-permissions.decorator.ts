import { SetMetadata } from '@nestjs/common';
import type { Permission } from './permission.catalog';

export const PERMISSIONS_KEY = 'permissions';

/** Require any of the listed permissions (OR). */
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
