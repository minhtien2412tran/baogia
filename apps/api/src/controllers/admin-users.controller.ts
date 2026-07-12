import { Controller, Get, Patch, Put, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiSecurity } from '@nestjs/swagger';
import { AdminUsersService } from '../services/admin-users.service';
import { PermissionService } from '../services/permission.service';
import { AirportScopeService } from '../services/airport-scope.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { UpdateAdminUserDto, PutUserPermissionsDto, PutUserAirportScopeDto } from '../dto';

@ApiTags('Admin Users')
@ApiSecurity('X-API-Key')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('bearer')
export class AdminUsersController {
  constructor(
    private readonly usersService: AdminUsersService,
    private readonly permissions: PermissionService,
    private readonly airportScope: AirportScopeService,
  ) {}

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOperation({ summary: 'List users (admin)' })
  list(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.usersService.listUsers(page ? Number(page) : 1, limit ? Number(limit) : 20);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user role/status (admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateAdminUserDto,
    @CurrentUser() admin: AuthUser,
  ) {
    return this.usersService.updateUser(id, body, admin.userId);
  }

  @Get(':id/permissions')
  @ApiOperation({ summary: 'List permission overrides + resolved effects' })
  getPermissions(@Param('id', ParseIntPipe) id: number) {
    return this.permissions.listForUser(id);
  }

  @Put(':id/permissions')
  @ApiOperation({ summary: 'Upsert permission overrides (INHERIT removes row)' })
  putPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PutUserPermissionsDto,
    @CurrentUser() admin: AuthUser,
  ) {
    return this.permissions.putOverrides(id, body.items, admin.userId);
  }

  @Get(':id/airport-scope')
  @ApiOperation({ summary: 'Get user airport scope' })
  getAirportScope(@Param('id', ParseIntPipe) id: number) {
    return this.airportScope.getForUser(id);
  }

  @Put(':id/airport-scope')
  @ApiOperation({ summary: 'Set user airport scope (ALL / CONTINENT / COUNTRY / AIRPORT_LIST / NONE)' })
  putAirportScope(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PutUserAirportScopeDto,
    @CurrentUser() admin: AuthUser,
  ) {
    return this.airportScope.putForUser(id, body, admin.userId);
  }
}
