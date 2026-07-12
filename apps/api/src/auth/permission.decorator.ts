import { SetMetadata } from '@nestjs/common';
import type { PermissionKey } from '../constants/permissions';

export const PERMISSION_KEY_META = 'requirePermission';

export const RequirePermission = (key: PermissionKey) =>
  SetMetadata(PERMISSION_KEY_META, key);
