import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthController } from './controllers/auth.controller';
import { QuoteController } from './controllers/quote.controller';
import { FixedPriceController } from './controllers/fixed-price.controller';
import { AdminFixedPriceController } from './controllers/admin-fixed-price.controller';
import { EmptyLegController } from './controllers/empty-leg.controller';
import { AdminEmptyLegController } from './controllers/admin-empty-leg.controller';
import { JetCardController } from './controllers/jet-card.controller';
import { AdminJetCardController } from './controllers/admin-jet-card.controller';
import { TravelCreditController, AdminTravelCreditController } from './controllers/travel-credit.controller';
import { AdminContentController } from './controllers/admin-content.controller';
import { PartnerController } from './controllers/partner.controller';
import { ContentController } from './controllers/content.controller';
import { BookingController, AdminBookingController } from './controllers/booking.controller';
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { AirportController } from './controllers/airport.controller';
import { BookingService } from './services/booking.service';
import { AuditService } from './services/audit.service';
import { FixedPriceService } from './services/fixed-price.service';
import { EmptyLegService } from './services/empty-leg.service';
import { JetCardService } from './services/jet-card.service';
import { TravelCreditService } from './services/travel-credit.service';
import { ContentService } from './services/content.service';
import { AdminDashboardService } from './services/admin-dashboard.service';
import { AirportService } from './services/airport.service';
import { QuoteService } from './services/quote.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    AppController,
    AuthController,
    QuoteController,
    AirportController,
    FixedPriceController,
    AdminFixedPriceController,
    EmptyLegController,
    AdminEmptyLegController,
    JetCardController,
    AdminJetCardController,
    TravelCreditController,
    AdminTravelCreditController,
    PartnerController,
    ContentController,
    AdminContentController,
    BookingController,
    AdminBookingController,
    AdminDashboardController,
  ],
  providers: [
    AppService,
    BookingService,
    AuditService,
    FixedPriceService,
    EmptyLegService,
    JetCardService,
    TravelCreditService,
    ContentService,
    AdminDashboardService,
    AirportService,
    QuoteService,
    AuthService,
  ],
})
export class AppModule {}
