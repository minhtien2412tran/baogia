import { Module } from '@nestjs/common';
import { QuoteController } from '../../controllers/quote.controller';
import { AdminQuotesController } from '../../controllers/admin-quotes.controller';
import { QuoteService } from '../../services/quote.service';
import { AdminQuotesService } from '../../services/admin-quotes.service';
import { BookingService } from '../../services/booking.service';
import { PermissionsModule } from '../../permissions/permissions.module';

/**
 * Quotes + admin offers. BookingService is registered here because
 * QuoteController exposes GET /payments/my via BookingService (phase 3 will move payments).
 */
@Module({
  imports: [PermissionsModule],
  controllers: [QuoteController, AdminQuotesController],
  providers: [QuoteService, AdminQuotesService, BookingService],
  exports: [QuoteService, BookingService],
})
export class QuotesModule {}
