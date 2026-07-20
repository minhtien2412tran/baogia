import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StaffGuard } from '../auth/staff.guard';
import { PermissionGuard } from '../permissions/permission.guard';
import { RequirePermissions } from '../permissions/require-permissions.decorator';
import { AdminPaymentsService } from '../services/admin-payments.service';

@ApiTags('Admin Payments')
@ApiSecurity('X-API-Key')
@Controller('admin/payments')
@UseGuards(JwtAuthGuard, StaffGuard, PermissionGuard)
@ApiBearerAuth('bearer')
export class AdminPaymentsController {
  constructor(private readonly payments: AdminPaymentsService) {}

  @Get()
  @RequirePermissions('payment.view')
  @ApiOperation({ summary: 'List payments (admin)' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  list(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.payments.list({
      status,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
    });
  }

  @Get(':id')
  @RequirePermissions('payment.view')
  @ApiOperation({ summary: 'Payment detail' })
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const row = await this.payments.getOne(id);
    if (!row) throw new NotFoundException(`Payment #${id} not found`);
    return row;
  }
}
