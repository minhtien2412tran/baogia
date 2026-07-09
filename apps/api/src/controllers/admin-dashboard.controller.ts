import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Admin Dashboard')
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
