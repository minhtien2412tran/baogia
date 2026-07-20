import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StaffGuard } from '../auth/staff.guard';
import { PermissionGuard } from '../permissions/permission.guard';
import { RequirePermissions } from '../permissions/require-permissions.decorator';

@ApiTags('Admin Dashboard')
@ApiSecurity('X-API-Key')
@Controller('admin')
@UseGuards(JwtAuthGuard, StaffGuard, PermissionGuard)
@ApiBearerAuth('bearer')
export class AdminDashboardController {
  constructor(private readonly dashboard: AdminDashboardService) {}

  @Get('dashboard/stats')
  @RequirePermissions('dashboard.view')
  @ApiOperation({ summary: 'Dashboard overview stats' })
  getStats() {
    return this.dashboard.getStats();
  }

  @Get('dashboard/recent-quotes')
  @RequirePermissions('dashboard.view', 'quote.view')
  @ApiOperation({ summary: 'Recent quote requests' })
  getRecentQuotes(@Query('limit') limit?: string) {
    return this.dashboard.getRecentQuotes(limit ? Number(limit) : 10);
  }

  @Get('dashboard/recent-bookings')
  @RequirePermissions('dashboard.view', 'booking.view')
  @ApiOperation({ summary: 'Recent bookings' })
  getRecentBookings(@Query('limit') limit?: string) {
    return this.dashboard.getRecentBookings(limit ? Number(limit) : 10);
  }

  @Get('dashboard/flight-schedule')
  @RequirePermissions('dashboard.view', 'booking.view', 'quote.view')
  @ApiQuery({ name: 'from', required: false, description: 'ISO start (inclusive)' })
  @ApiQuery({ name: 'to', required: false, description: 'ISO end (inclusive)' })
  @ApiOperation({
    summary: 'Flight calendar — bookings, quotes, empty legs by departure time',
  })
  getFlightSchedule(@Query('from') from?: string, @Query('to') to?: string) {
    return this.dashboard.getFlightSchedule(from, to);
  }

  @Get('dashboard/revenue-demo')
  @RequirePermissions('dashboard.view')
  @ApiOperation({ summary: 'Revenue demo calculation' })
  getRevenue() {
    return this.dashboard.getRevenueDemo();
  }

  @Get('audit-logs')
  @RequirePermissions('audit.view')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'workflow', required: false })
  @ApiQuery({ name: 'action', required: false })
  @ApiQuery({ name: 'q', required: false })
  @ApiOperation({ summary: 'Audit log listing (filter by workflow / action)' })
  getAuditLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('workflow') workflow?: string,
    @Query('action') action?: string,
    @Query('q') q?: string,
  ) {
    return this.dashboard.getAuditLogs(page ? Number(page) : 1, limit ? Number(limit) : 20, {
      workflow,
      action,
      q,
    });
  }

  @Get('system-health')
  @RequirePermissions('settings.view', 'dashboard.view')
  @ApiOperation({ summary: 'System health check' })
  getHealth() {
    return this.dashboard.getSystemHealth();
  }
}
