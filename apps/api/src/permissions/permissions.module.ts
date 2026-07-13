import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionGuard } from './permission.guard';
import { AdminPermissionsController } from './admin-permissions.controller';

@Module({
  controllers: [AdminPermissionsController],
  providers: [PermissionService, PermissionGuard],
  exports: [PermissionService, PermissionGuard],
})
export class PermissionsModule {}
