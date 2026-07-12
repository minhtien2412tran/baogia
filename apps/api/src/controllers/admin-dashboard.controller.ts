import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiSecurity } from '@nestjs/swagger';
import type { Request } from 'express';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { UpdateQuoteStatusDto } from '../dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';

function clientIp(req: Request): string | undefined {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string') return xf.split(',')[0]?.trim();
  return req.ip;
}

@ApiTags('Admin Dashboard')
@ApiSecurity('X-API-Key')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('bearer')
export class AdminDashboardController {
  constructor(private readonly dashboard: AdminDashboardService) {}

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Dashboard overview stats' })
  getStats() {
    return this.dashboard.getStats();
  }

  @Get('dashboard/recent-quotes')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Recent quote requests' })
  getRecentQuotes(@Query('limit') limit?: string) {
    return this.dashboard.getRecentQuotes(limit ? Number(limit) : 10);
  }

  @Patch('quotes/:id/status')
  @ApiOperation({ summary: 'Update quote request status' })
  updateQuoteStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateQuoteStatusDto,
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
  ) {
    return this.dashboard.updateQuoteStatus(id, body.status, user, clientIp(req));
  }

  @Get('dashboard/recent-bookings')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Recent bookings' })
  getRecentBookings(@Query('limit') limit?: string) {
    return this.dashboard.getRecentBookings(limit ? Number(limit) : 10);
  }

  @Get('dashboard/revenue-demo')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Revenue demo calculation' })
  getRevenue() {
    return this.dashboard.getRevenueDemo();
  }

  @Get('audit-logs')
  @ApiBearerAuth('bearer')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOperation({ summary: 'Audit log listing' })
  getAuditLogs(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.dashboard.getAuditLogs(page ? Number(page) : 1, limit ? Number(limit) : 20);
  }

  @Get('system-health')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'System health check' })
  getHealth() {
    return this.dashboard.getSystemHealth();
  }
}
