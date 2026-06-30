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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { BookingService } from '../services/booking.service';
import { CreateBookingDto, UpdateBookingStatusDto } from '../dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';

function clientIp(req: Request): string | undefined {
  return (req.headers['x-forwarded-for'] as string) ?? req.socket?.remoteAddress;
}

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created.' })
  create(@Body() body: CreateBookingDto, @Req() req: Request) {
    return this.bookingService.create(body, clientIp(req));
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List bookings for the current user' })
  @ApiResponse({ status: 200, description: 'User bookings.' })
  findMy(@CurrentUser() user: AuthUser) {
    return this.bookingService.findMyBookings(user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking details.' })
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.bookingService.findById(id, user.userId);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled.' })
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
  ) {
    return this.bookingService.cancel(id, user.userId, clientIp(req));
  }
}

@ApiTags('Admin Bookings')
@Controller('admin/bookings')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
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
}
