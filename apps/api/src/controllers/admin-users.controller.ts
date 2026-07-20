import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import { AdminUsersService } from '../services/admin-users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StaffGuard } from '../auth/staff.guard';
import { PermissionGuard } from '../permissions/permission.guard';
import { RequirePermissions } from '../permissions/require-permissions.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { UpdateAdminUserDto } from '../dto';

@ApiTags('Admin Users')
@ApiSecurity('X-API-Key')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, StaffGuard, PermissionGuard)
@ApiBearerAuth('bearer')
export class AdminUsersController {
  constructor(private readonly usersService: AdminUsersService) {}

  @Get()
  @RequirePermissions('user.manage')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOperation({ summary: 'List users (admin)' })
  list(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.usersService.listUsers(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Get(':id/360')
  @RequirePermissions('user.manage')
  @ApiOperation({ summary: 'Get customer 360 summary' })
  customer360(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getCustomer360(id);
  }

  @Patch(':id')
  @RequirePermissions('user.manage')
  @ApiOperation({ summary: 'Update user role/status (admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateAdminUserDto,
    @CurrentUser() admin: AuthUser,
  ) {
    return this.usersService.updateUser(id, body, admin.userId);
  }
}
