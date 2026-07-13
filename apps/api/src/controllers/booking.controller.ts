import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  Req,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiSecurity } from '@nestjs/swagger';
import type { Request } from 'express';
import { BookingService } from '../services/booking.service';
import { CreateBookingDto, UpdateBookingStatusDto } from '../dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { PermissionGuard } from '../permissions/permission.guard';
import { RequirePermissions } from '../permissions/require-permissions.decorator';
import { PermissionService } from '../permissions/permission.service';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';

function clientIp(req: Request): string | undefined {
  return (req.headers['x-forwarded-for'] as string) ?? req.socket?.remoteAddress;
}

const STAFF_ROLES = new Set(['ADMIN', 'SALES', 'CONTRACT_APPROVER']);

@ApiTags('Bookings')
@ApiSecurity('X-API-Key')
@Controller('bookings')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly permissions: PermissionService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Create a new booking (authenticated)' })
  @ApiResponse({ status: 201, description: 'Booking created.' })
  create(
    @Body() body: CreateBookingDto,
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
  ) {
    return this.bookingService.create(body, user.userId, clientIp(req));
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'List bookings for the current user' })
  @ApiResponse({ status: 200, description: 'User bookings.' })
  findMy(@CurrentUser() user: AuthUser) {
    return this.bookingService.findMyBookings(user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking details.' })
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.bookingService.findById(id, user.userId);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Cancel a booking',
    description:
      'Customers cancel own bookings. Staff must have booking.cancel (user DENY override → 403).',
  })
  @ApiResponse({ status: 200, description: 'Booking cancelled.' })
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
    @Body() body?: { reason?: string },
  ) {
    if (STAFF_ROLES.has(user.role)) {
      const ok = await this.permissions.hasPermission(user.userId, user.role, 'booking.cancel');
      if (!ok) {
        throw new ForbiddenException({
          statusCode: 403,
          message: 'Insufficient permission',
          required: ['booking.cancel'],
        });
      }
      return this.bookingService.cancel(id, user.userId, clientIp(req), {
        asStaff: true,
        reason: body?.reason,
      });
    }
    return this.bookingService.cancel(id, user.userId, clientIp(req), {
      reason: body?.reason,
    });
  }
}

@ApiTags('Admin Bookings')
@ApiSecurity('X-API-Key')
@Controller('admin/bookings')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('bearer')
export class AdminBookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  @ApiQuery({ name: 'status', required: false, example: 'pending' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiOperation({ summary: 'List all bookings (admin)' })
  @ApiResponse({ status: 200, description: 'Paginated booking list.' })
  findAll(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.bookingService.findAllAdmin({
      status,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID (admin)' })
  @ApiResponse({ status: 200, description: 'Booking details.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.findById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update booking status (admin)' })
  @ApiResponse({ status: 200, description: 'Status updated.' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateBookingStatusDto,
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
  ) {
    return this.bookingService.updateStatusAdmin(id, body, user.userId, clientIp(req));
  }

  @Patch(':id/cancel')
  @UseGuards(PermissionGuard)
  @RequirePermissions('booking.cancel')
  @ApiOperation({ summary: 'Cancel booking as admin (requires booking.cancel)' })
  adminCancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
    @Body() body?: { reason?: string },
  ) {
    return this.bookingService.cancel(id, user.userId, clientIp(req), {
      asStaff: true,
      reason: body?.reason,
    });
  }
}
