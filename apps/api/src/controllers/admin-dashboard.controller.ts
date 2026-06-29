import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminDashboardService } from '../services/admin-dashboard.service';

@ApiTags('Admin Dashboard')
@Controller('admin')
export class AdminDashboardController {
  constructor(private readonly dashboard: AdminDashboardService) {}

  @Get('dashboard/stats')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dashboard overview stats' })
  getStats() {
    return this.dashboard.getStats();
  }

  @Get('dashboard/recent-quotes')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Recent quote requests' })
  getRecentQuotes(@Query('limit') limit?: string) {
    return this.dashboard.getRecentQuotes(limit ? Number(limit) : 10);
  }

  @Get('dashboard/recent-bookings')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Recent bookings' })
  getRecentBookings(@Query('limit') limit?: string) {
    return this.dashboard.getRecentBookings(limit ? Number(limit) : 10);
  }

  @Get('dashboard/revenue-demo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revenue demo calculation' })
  getRevenue() {
    return this.dashboard.getRevenueDemo();
  }

  @Get('audit-logs')
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOperation({ summary: 'Audit log listing' })
  getAuditLogs(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.dashboard.getAuditLogs(page ? Number(page) : 1, limit ? Number(limit) : 20);
  }

  @Get('system-health')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'System health check' })
  getHealth() {
    return this.dashboard.getSystemHealth();
  }
}
