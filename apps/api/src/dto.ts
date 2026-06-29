import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// --- AUTH DTOS ---

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'Password123' })
  password?: string;

  @ApiProperty({ example: 'INDIVIDUAL', description: 'INDIVIDUAL or COMPANY' })
  accountType?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'Password123' })
  password?: string;
}

export class OAuthDto {
  @ApiProperty({ example: 'oauth-provider-token-xyz' })
  token: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh-token-xyz' })
  refreshToken: string;
}

// --- QUOTE DTOS ---

export class LegDto {
  @ApiProperty({ example: 'SGN', description: 'Origin airport IATA code' })
  fromAirport: string;

  @ApiProperty({ example: 'HAN', description: 'Destination airport IATA code' })
  toAirport: string;

  @ApiProperty({ example: '2026-12-01T12:00:00Z' })
  departureDate: string;

  @ApiProperty({ example: 4 })
  passengers: number;
}

export class SearchAircraftDto {
  @ApiProperty({ example: 'ONE_WAY', description: 'ONE_WAY, ROUND_TRIP, or MULTI_CITY' })
  tripType: string;

  @ApiProperty({ type: [LegDto] })
  legs: LegDto[];

  @ApiProperty({ example: 'en' })
  locale?: string;

  @ApiProperty({ example: 'USD' })
  currency?: string;
}

export class RequestQuoteDto {
  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '+84900000000' })
  phone: string;

  @ApiProperty({ type: [LegDto] })
  legs: LegDto[];

  @ApiProperty({ example: 'Need a pet-friendly cabin.' })
  message?: string;

  @ApiProperty({ example: true })
  isConsentAccepted: boolean;
}

// --- FIXED PRICE DTOS ---

export class BookFixedPriceDto {
  @ApiProperty({ example: 1, description: 'Route ID' })
  routeId: number;

  @ApiProperty({ example: 'LIGHT', description: 'Aircraft Category code' })
  category: string;

  @ApiProperty({ example: '2026-12-10' })
  date: string;

  @ApiProperty({ example: 6 })
  passengers: number;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;
}

// --- JET CARD DTOS ---

export class JetCardEnquiryDto {
  @ApiProperty({ example: 'Jane' })
  firstName: string;

  @ApiProperty({ example: 'Smith' })
  lastName: string;

  @ApiProperty({ example: 'jane.smith@example.com' })
  email: string;

  @ApiProperty({ example: '+1234567890' })
  phone: string;

  @ApiProperty({ example: 'Looking for a 25-hour Gold Card' })
  message?: string;

  @ApiProperty({ example: true })
  isConsentAccepted: boolean;
}

// --- TRAVEL CREDIT DTOS ---

export class RedeemCreditsDto {
  @ApiProperty({ example: 123, description: 'Booking ID' })
  bookingId: number;

  @ApiProperty({ example: 500 })
  credits: number;
}

// --- PARTNER DTOS ---

export class PartnerApplicationDto {
  @ApiProperty({ example: 'SERVICE', description: 'SERVICE, REFERRAL, or OFFICIAL' })
  partnerType: string;

  @ApiProperty({ example: 'partner@example.com' })
  email: string;

  @ApiProperty({ example: '+84900000001' })
  phone: string;

  @ApiPropertyOptional({ example: '+84900000001' })
  whatsapp?: string;

  @ApiPropertyOptional({ example: 'wechat_id' })
  wechat?: string;
}

// --- NEWSLETTER DTO ---

export class SubscribeNewsletterDto {
  @ApiProperty({ example: 'news@example.com' })
  email: string;

  @ApiProperty({ example: 'en' })
  locale?: string;
}

// --- PAYMENTS DTOS ---

export class PaymentIntentDto {
  @ApiProperty({ example: 123, description: 'Booking ID' })
  bookingId: number;

  @ApiProperty({ example: 'CREDIT_CARD', description: 'CREDIT_CARD, BANK_TRANSFER, or HOLD' })
  method: string;
}

export class ConfirmPaymentDto {
  @ApiProperty({ example: 'payment-intent-id-xyz' })
  paymentIntentId: string;
}
