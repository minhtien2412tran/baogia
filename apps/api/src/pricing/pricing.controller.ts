import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { PricingService } from './pricing.service';
import { PricingEstimateDto } from './pricing.dto';

@ApiTags('Pricing')
@ApiSecurity('X-API-Key')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricing: PricingService) {}

  @Post('estimate')
  @ApiOperation({
    summary: 'Estimate charter price (positioning + passenger legs)',
    description:
      'Returns Giá ước tính. If aircraft is at CAN and customer books HAN→SGN, includes POSITIONING CAN→HAN.',
  })
  estimate(@Body() body: PricingEstimateDto, @CurrentUser() user?: AuthUser) {
    return this.pricing.estimate({
      aircraftId: body.aircraftId,
      fromAirportId: body.fromAirportId,
      toAirportId: body.toAirportId,
      passengerCount: body.passengerCount,
      departureAt: body.departureAt,
      persist: body.persist === true,
      bookingId: body.bookingId,
      quoteRequestId: body.quoteRequestId,
      userId: user?.userId,
    });
  }

  @Get('bookings/:id/breakdown')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Booking flight-leg + estimate breakdown' })
  breakdown(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.pricing.getBookingBreakdown(id, user.userId);
  }

  @Post('bookings/:id/recalculate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Recalculate booking estimate and replace planned legs',
  })
  recalculate(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.pricing.recalculateBooking(id, user.userId);
  }

  @Post('bookings/:bookingId/attach/:estimateId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Attach a persisted estimate snapshot to a booking',
  })
  attach(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @Param('estimateId', ParseIntPipe) estimateId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.pricing.attachEstimateToBooking(
      bookingId,
      estimateId,
      user.userId,
    );
  }
}
