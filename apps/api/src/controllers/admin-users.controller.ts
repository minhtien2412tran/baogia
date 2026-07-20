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
import { AdminGuard } from '../auth/admin.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { UpdateAdminUserDto } from '../dto';

@ApiTags('Admin Users')
@ApiSecurity('X-API-Key')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('bearer')
export class AdminUsersController {
  constructor(private readonly usersService: AdminUsersService) {}

  @Get()
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
  @ApiOperation({ summary: 'Get customer 360 summary' })
  customer360(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getCustomer360(id);
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
}
