import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { BookingService } from '../services/booking.service';
import { CreateBookingDto, UpdateBookingStatusDto } from '../dto';

function resolveUserId(headers: Record<string, string | undefined>): number {
  const raw = headers['x-user-id'];
  return raw ? Number(raw) : 1;
}

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
  @ApiBearerAuth()
  @ApiHeader({ name: 'X-User-Id', required: false, description: 'Demo user ID (default: 1)' })
  @ApiOperation({ summary: 'List bookings for the current user' })
  @ApiResponse({ status: 200, description: 'User bookings.' })
  findMy(@Headers() headers: Record<string, string | undefined>) {
    return this.bookingService.findMyBookings(resolveUserId(headers));
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiHeader({ name: 'X-User-Id', required: false })
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking details.' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Headers() headers: Record<string, string | undefined>,
  ) {
    return this.bookingService.findById(id, resolveUserId(headers));
  }

  @Patch(':id/cancel')
  @ApiBearerAuth()
  @ApiHeader({ name: 'X-User-Id', required: false })
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled.' })
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Headers() headers: Record<string, string | undefined>,
    @Req() req: Request,
  ) {
    return this.bookingService.cancel(id, resolveUserId(headers), clientIp(req));
  }
}

@ApiTags('Admin Bookings')
@Controller('admin/bookings')
export class AdminBookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking by ID (admin)' })
  @ApiResponse({ status: 200, description: 'Booking details.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.findById(id);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update booking status (admin)' })
  @ApiResponse({ status: 200, description: 'Status updated.' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateBookingStatusDto,
    @Headers() headers: Record<string, string | undefined>,
    @Req() req: Request,
  ) {
    const adminUserId = resolveUserId(headers);
    return this.bookingService.updateStatusAdmin(id, body, adminUserId, clientIp(req));
  }
}
