import { Module } from '@nestjs/common';
import { QuoteController } from '../../controllers/quote.controller';
import { AdminQuotesController } from '../../controllers/admin-quotes.controller';
import { QuoteService } from '../../services/quote.service';
import { AdminQuotesService } from '../../services/admin-quotes.service';
import { BookingService } from '../../services/booking.service';
import { PositioningPriceService } from '../../services/positioning-price.service';

/**
 * Quotes + admin offers. BookingService is registered here because
 * QuoteController exposes GET /payments/my via BookingService (phase 3 will move payments).
 */
@Module({
  controllers: [QuoteController, AdminQuotesController],
  providers: [QuoteService, AdminQuotesService, BookingService, PositioningPriceService],
  exports: [QuoteService, BookingService, PositioningPriceService],
})
export class QuotesModule {}
