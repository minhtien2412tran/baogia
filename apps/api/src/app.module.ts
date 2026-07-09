import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
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
import { AdminPartnerController } from './controllers/admin-partner.controller';
import { ContentController } from './controllers/content.controller';
import { BookingController, AdminBookingController } from './controllers/booking.controller';
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AirportController } from './controllers/airport.controller';
import { ApiGatewayController } from './controllers/api-gateway.controller';
import { AdminAircraftController } from './controllers/admin-aircraft.controller';
import { MediaController } from './controllers/media.controller';
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
import { PartnerService } from './services/partner.service';
import { ApiGatewayService } from './services/api-gateway.service';
import { EmailService } from './services/email.service';
import { PaymentService } from './services/payment.service';
import { DocumentService } from './services/document.service';
import { OAuthService } from './services/oauth.service';
import { OtpService } from './services/otp.service';
import { SmsService } from './services/sms.service';
import { OnepayService } from './services/onepay.service';
import { NinepayService } from './services/ninepay.service';
import { AdminUsersService } from './services/admin-users.service';
import { StorageService } from './services/storage.service';
import { RedisService } from './services/redis.service';
import { AircraftService } from './services/aircraft.service';
import { IntegrationsStatusService } from './services/integrations-status.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { ApiKeyGuard } from './auth/api-key.guard';

@Module({
  imports: [
    PrismaModule,
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60_000, limit: 120 },
      { name: 'auth', ttl: 60_000, limit: 20 },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'dev-jetbay-secret-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
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
    AdminPartnerController,
    ContentController,
    AdminContentController,
    BookingController,
    AdminBookingController,
    AdminDashboardController,
    AdminUsersController,
    AdminAircraftController,
    ApiGatewayController,
    MediaController,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: ApiKeyGuard },
    AppService,
    ApiGatewayService,
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
    PartnerService,
    EmailService,
    PaymentService,
    DocumentService,
    OAuthService,
    OtpService,
    SmsService,
    OnepayService,
    NinepayService,
    AdminUsersService,
    StorageService,
    RedisService,
    AircraftService,
    IntegrationsStatusService,
    JwtStrategy,
  ],
})
export class AppModule {}
