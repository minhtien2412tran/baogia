import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { PermissionGuard } from './permission.guard';
import { RequirePermissions } from './require-permissions.decorator';
import { PermissionService } from './permission.service';

@ApiTags('Admin Permissions')
@ApiSecurity('X-API-Key')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('admin/permissions')
export class AdminPermissionsController {
  constructor(private readonly permissions: PermissionService) {}

  @Get('catalog')
  @RequirePermissions('permission.manage', 'user.manage')
  @ApiOperation({ summary: 'List permission catalog' })
  catalog() {
    return this.permissions.catalog();
  }

  @Get('me')
  @ApiOperation({ summary: 'Effective permissions for current user' })
  me(@CurrentUser() user: AuthUser) {
    return this.permissions
      .listEffectivePermissions(user.userId, user.role)
      .then((list) => ({
        userId: user.userId,
        role: user.role,
        permissions: list,
      }));
  }

  @Get('users/:userId')
  @RequirePermissions('permission.manage')
  @ApiOperation({ summary: 'Effective permissions + scopes for a user' })
  async userPerms(@Param('userId', ParseIntPipe) userId: number) {
    const [scopes, overrides] = await Promise.all([
      this.permissions.getUserScopes(userId),
      this.permissions.getUserOverrides(userId),
    ]);
    return { userId, scopes, overrides };
  }

  @Put('users/:userId/overrides')
  @RequirePermissions('permission.manage')
  @ApiOperation({
    summary: 'Set user permission overrides (DENY/ALLOW/INHERIT)',
  })
  async setOverrides(
    @Param('userId', ParseIntPipe) userId: number,
    @Body()
    body: {
      overrides: Array<{
        permission: string;
        effect: 'INHERIT' | 'ALLOW' | 'DENY';
      }>;
    },
    @CurrentUser() actor: AuthUser,
  ) {
    const results: Awaited<ReturnType<PermissionService['setOverride']>>[] = [];
    for (const o of body.overrides ?? []) {
      results.push(
        await this.permissions.setOverride(
          userId,
          o.permission,
          o.effect,
          actor.userId,
        ),
      );
    }
    return { userId, overrides: results };
  }

  @Put('users/:userId/airport-scopes')
  @RequirePermissions('permission.manage')
  @ApiOperation({ summary: 'Replace user airport scopes' })
  setScopes(
    @Param('userId', ParseIntPipe) userId: number,
    @Body()
    body: {
      scopes: Array<{
        scopeType: string;
        continentCode?: string;
        countryCode?: string;
        airportId?: number;
      }>;
    },
    @CurrentUser() actor: AuthUser,
  ) {
    return this.permissions.replaceUserScopes(
      userId,
      body.scopes ?? [],
      actor.userId,
    );
  }

  @Put('roles/:role')
  @RequirePermissions('permission.manage')
  @ApiOperation({ summary: 'Replace role permission set' })
  setRole(
    @Param('role') role: string,
    @Body() body: { permissions: string[] },
  ) {
    return this.permissions.setRolePermissions(role, body.permissions ?? []);
  }
}
