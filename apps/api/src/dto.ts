import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DB_LOCALES } from '@jetbay/i18n';

// --- AUTH DTOS ---

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: 'INDIVIDUAL', description: 'INDIVIDUAL or COMPANY' })
  @IsOptional()
  @IsIn(['INDIVIDUAL', 'COMPANY'])
  accountType?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class OAuthDto {
  @ApiProperty({ example: 'oauth-provider-token-xyz' })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class OtpSendDto {
  @ApiProperty({ example: '+84901234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'LOGIN', enum: ['LOGIN', 'REGISTER'] })
  @IsIn(['LOGIN', 'REGISTER'])
  purpose: 'LOGIN' | 'REGISTER';
}

export class OtpVerifyDto {
  @ApiProperty({ example: '+84901234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(4)
  code: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class UpdateAdminUserDto {
  @ApiPropertyOptional({ enum: ['USER', 'ADMIN'] })
  @IsOptional()
  @IsIn(['USER', 'ADMIN'])
  role?: string;

  @ApiPropertyOptional({ enum: ['ACTIVE', 'SUSPENDED'] })
  @IsOptional()
  @IsIn(['ACTIVE', 'SUSPENDED'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;
}

export class CreateGatewayPaymentDto {
  @ApiProperty({ example: 1 })
  bookingId: number;

  @ApiProperty({ example: 'onepay', enum: ['onepay', '9pay'] })
  @IsIn(['onepay', '9pay'])
  gateway: 'onepay' | '9pay';

  @ApiPropertyOptional({ example: 'http://localhost:3000/en-us/account' })
  @IsOptional()
  @IsString()
  returnUrl?: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh-token-xyz' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

// --- QUOTE DTOS ---

export class LegDto {
  @ApiProperty({ example: 'SGN', description: 'Origin airport IATA code' })
  @IsString()
  @IsNotEmpty()
  fromAirport: string;

  @ApiProperty({ example: 'HAN', description: 'Destination airport IATA code' })
  @IsString()
  @IsNotEmpty()
  toAirport: string;

  @ApiProperty({ example: '2026-12-01T12:00:00Z' })
  @IsString()
  @IsNotEmpty()
  departureDate: string;

  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(1)
  passengers: number;
}

export class SearchAircraftDto {
  @ApiProperty({ example: 'ONE_WAY', description: 'ONE_WAY, ROUND_TRIP, or MULTI_CITY' })
  @IsIn(['ONE_WAY', 'ROUND_TRIP', 'MULTI_CITY'])
  tripType: string;

  @ApiProperty({ type: [LegDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LegDto)
  legs: LegDto[];

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  locale?: string;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;
}

export class RequestQuoteDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+84900000000' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ type: [LegDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LegDto)
  legs: LegDto[];

  @ApiPropertyOptional({ example: 'Need a pet-friendly cabin.' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    example: 'ONE_WAY',
    enum: ['ONE_WAY', 'ROUND_TRIP', 'MULTI_CITY'],
  })
  @IsOptional()
  @IsIn(['ONE_WAY', 'ROUND_TRIP', 'MULTI_CITY'])
  tripType?: 'ONE_WAY' | 'ROUND_TRIP' | 'MULTI_CITY';

  @ApiProperty({ example: true })
  @IsBoolean()
  isConsentAccepted: boolean;
}

// --- FIXED PRICE DTOS ---

export class BookFixedPriceDto {
  @ApiProperty({ example: 1, description: 'Route ID' })
  @Type(() => Number)
  @IsInt()
  routeId: number;

  @ApiProperty({ example: 'LIGHT', description: 'Aircraft Category code' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: '2026-12-10' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 6 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  passengers: number;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;
}

// --- JET CARD DTOS ---

export class JetCardEnquiryDto {
  @ApiProperty({ example: 'Jane' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Smith' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'jane.smith@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 'Looking for a 25-hour Gold Card' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ type: [String], description: 'URLs from POST /enquiries/attachments' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachmentUrls?: string[];

  @ApiProperty({ example: true })
  @IsBoolean()
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
  @IsIn(['SERVICE', 'REFERRAL', 'OFFICIAL'])
  partnerType: string;

  @ApiProperty({ example: 'partner@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+84900000001' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: '+84900000001' })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiPropertyOptional({ example: 'wechat_id' })
  @IsOptional()
  @IsString()
  wechat?: string;
}

// --- NEWSLETTER DTO ---

export class SubscribeNewsletterDto {
  @ApiProperty({ example: 'news@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  locale?: string;
}

// --- PAYMENTS DTOS ---

export class PaymentIntentDto {
  @ApiProperty({ example: 123, description: 'Booking ID' })
  @Type(() => Number)
  @IsInt()
  bookingId: number;

  @ApiProperty({ example: 'CREDIT_CARD', description: 'CREDIT_CARD, BANK_TRANSFER, or HOLD' })
  @IsString()
  @IsNotEmpty()
  method: string;
}

export class ConfirmPaymentDto {
  @ApiProperty({ example: 'payment-intent-id-xyz' })
  @IsString()
  @IsNotEmpty()
  paymentIntentId: string;
}

// --- BOOKING DTOS ---

export class BookingContactDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+84900000000' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class BookingPassengerDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: 'AB1234567' })
  @IsOptional()
  @IsString()
  passportNumber?: string;

  @ApiPropertyOptional({ example: '1990-01-15' })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'US' })
  @IsOptional()
  @IsString()
  nationality?: string;
}

export class BookingItineraryLegDto {
  @ApiProperty({ example: 'LTN' })
  @IsString()
  @IsNotEmpty()
  fromAirport: string;

  @ApiProperty({ example: 'LBG' })
  @IsString()
  @IsNotEmpty()
  toAirport: string;

  @ApiProperty({ example: '2026-12-01T10:00:00Z' })
  @IsString()
  @IsNotEmpty()
  departureAt: string;
}

export class BookingItineraryDto {
  @ApiProperty({ example: 'ONE_WAY' })
  @IsString()
  @IsNotEmpty()
  tripType: string;

  @ApiProperty({ type: [BookingItineraryLegDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingItineraryLegDto)
  legs: BookingItineraryLegDto[];
}

export class CreateBookingDto {
  @ApiPropertyOptional({ example: 1, description: 'Quote request or offer ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  quoteId?: number;

  @ApiPropertyOptional({ example: 'CHARTER' })
  @IsOptional()
  @IsString()
  bookingType?: string;

  @ApiProperty({ type: BookingItineraryDto })
  @ValidateNested()
  @Type(() => BookingItineraryDto)
  itinerary: BookingItineraryDto;

  @ApiProperty({ type: [BookingPassengerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingPassengerDto)
  passengers: BookingPassengerDto[];

  @ApiProperty({ type: BookingContactDto })
  @ValidateNested()
  @Type(() => BookingContactDto)
  contact: BookingContactDto;
}

export class UpdateBookingStatusDto {
  @ApiProperty({
    example: 'confirmed',
    enum: ['draft', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
  })
  @IsIn(['draft', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])
  status: string;
}

// --- COMMERCIAL ADMIN DTOS ---

export class FixedPriceOptionDto {
  @ApiProperty({ example: 'LIGHT' })
  @IsString()
  @IsNotEmpty()
  categoryCode: string;

  @ApiProperty({ example: 13500 })
  @Type(() => Number)
  @Min(1)
  price: number;

  @ApiProperty({ example: 8 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  paxLimit: number;

  @ApiPropertyOptional({ example: 'Standard catering included' })
  @IsOptional()
  @IsString()
  includedTerms?: string;
}

export class CreateFixedPriceRouteDto {
  @ApiProperty({ example: 'london-to-paris' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'LTN' })
  @IsString()
  @IsNotEmpty()
  fromAirportIata: string;

  @ApiProperty({ example: 'LBG' })
  @IsString()
  @IsNotEmpty()
  toAirportIata: string;

  @ApiProperty({ example: 'Europe' })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiPropertyOptional({ example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ type: [FixedPriceOptionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FixedPriceOptionDto)
  options?: FixedPriceOptionDto[];
}

export class UpdateFixedPriceRouteDto {
  @ApiPropertyOptional({ example: 'london-to-paris' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'LTN' })
  @IsOptional()
  @IsString()
  fromAirportIata?: string;

  @ApiPropertyOptional({ example: 'LBG' })
  @IsOptional()
  @IsString()
  toAirportIata?: string;

  @ApiPropertyOptional({ example: 'Europe' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({ example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ type: [FixedPriceOptionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FixedPriceOptionDto)
  options?: FixedPriceOptionDto[];
}

export class CreateEmptyLegDto {
  @ApiProperty({ example: 'paris-to-geneva-empty-leg' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'LBG' })
  @IsString()
  @IsNotEmpty()
  fromAirportIata: string;

  @ApiProperty({ example: 'GVA' })
  @IsString()
  @IsNotEmpty()
  toAirportIata: string;

  @ApiProperty({ example: '2026-12-05T09:00:00Z' })
  @IsString()
  @IsNotEmpty()
  departAt: string;

  @ApiProperty({ example: 1, description: 'Aircraft model ID' })
  @Type(() => Number)
  @IsInt()
  aircraftModelId: number;

  @ApiProperty({ example: 4200 })
  @Type(() => Number)
  @Min(1)
  price: number;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  discountPct?: number;

  @ApiPropertyOptional({ example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateEmptyLegDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fromAirportIata?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  toAirportIata?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  departAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  aircraftModelId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  discountPct?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;
}

export class EmptyLegAlertSubscribeDto {
  @ApiProperty({ example: 'alerts@example.com' })
  email: string;

  @ApiProperty({ example: 'LTN' })
  fromAirport: string;

  @ApiProperty({ example: 'LBG' })
  toAirport: string;

  @ApiPropertyOptional({ example: 'en' })
  locale?: string;
}

export class EmptyLegRequestDto {
  @ApiProperty({ example: 'Jane' })
  firstName: string;

  @ApiProperty({ example: 'Smith' })
  lastName: string;

  @ApiProperty({ example: 'jane@example.com' })
  email: string;

  @ApiProperty({ example: '+44123456789' })
  phone: string;

  @ApiProperty({ example: 4 })
  passengers: number;

  @ApiPropertyOptional({ example: 'Flexible on departure time' })
  message?: string;

  @ApiProperty({ example: true })
  isConsentAccepted: boolean;
}

export class CreateJetCardPlanDto {
  @ApiProperty({ example: 'Gold Card' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 25 })
  @Type(() => Number)
  @Min(1)
  hours: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  validityYears?: number;

  @ApiPropertyOptional({ example: 24 })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minNoticeHours?: number;

  @ApiPropertyOptional({ example: 1.5 })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  dailyMinHours?: number;

  @ApiProperty({ example: 120000 })
  @Type(() => Number)
  @Min(1)
  price: number;
}

export class UpdateJetCardPlanDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  hours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  validityYears?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minNoticeHours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  dailyMinHours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  price?: number;
}

export class TravelCreditEnquiryDto {
  @ApiProperty({ example: 'Jane' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Smith' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+44123456789' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 1, description: 'Travel credit package ID' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  packageId: number;

  @ApiPropertyOptional({ example: 'Interested in corporate package' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ type: [String], description: 'URLs from POST /enquiries/attachments' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachmentUrls?: string[];

  @ApiProperty({ example: true })
  @IsBoolean()
  isConsentAccepted: boolean;
}

export class CreateTravelCreditPackageDto {
  @ApiProperty({ example: 'Starter' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1000 })
  @IsInt()
  @Min(1)
  creditAmount: number;

  @ApiProperty({ example: 1000 })
  @IsInt()
  @Min(1)
  priceUsd: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  bonusPct?: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsInt()
  @Min(1)
  validityMonths?: number;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateTravelCreditPackageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  creditAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  priceUsd?: number;

  @ApiPropertyOptional()
  @IsOptional()
  bonusPct?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  validityMonths?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class ReviewPartnerApplicationDto {
  @ApiProperty({ example: 'APPROVED', enum: ['APPROVED', 'REJECTED'] })
  @IsIn(['APPROVED', 'REJECTED'])
  status: 'APPROVED' | 'REJECTED';
}

// --- CONTENT CMS DTOS ---

export class ContentTranslationDto {
  @ApiProperty({ example: 'en', enum: [...DB_LOCALES] })
  @IsString()
  @IsNotEmpty()
  @IsIn([...DB_LOCALES, 'en-us'] as string[])
  locale: string;

  @ApiProperty({ example: 'Article Title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Full article body content...' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiPropertyOptional({ example: 'Short summary' })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional({ example: 'SEO Title' })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional({ example: 'SEO description' })
  @IsOptional()
  @IsString()
  seoDescription?: string;
}

export class CreateContentArticleDto {
  @ApiProperty({ example: 'news', enum: ['news', 'blog'] })
  @IsIn(['news', 'blog'])
  type: string;

  @ApiProperty({ example: 'jetbay-expands-fleet' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'PR Team' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/thumb.jpg' })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({ example: 'news' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'published', enum: ['draft', 'published'] })
  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: string;

  @ApiPropertyOptional({ example: '2026-06-25T00:00:00Z' })
  @IsOptional()
  @IsString()
  publishedAt?: string;

  @ApiProperty({ type: ContentTranslationDto })
  @ValidateNested()
  @Type(() => ContentTranslationDto)
  translation: ContentTranslationDto;
}

export class UpdateContentArticleDto {
  @ApiPropertyOptional({ example: 'news', enum: ['news', 'blog'] })
  @IsOptional()
  @IsIn(['news', 'blog'])
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: ['draft', 'published'] })
  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  publishedAt?: string;

  @ApiPropertyOptional({ type: ContentTranslationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContentTranslationDto)
  translation?: ContentTranslationDto;
}

export class UpdateQuoteStatusDto {
  @ApiProperty({
    example: 'OFFERED',
    enum: ['PENDING', 'OFFERED', 'EXPIRED', 'CONVERTED', 'CANCELLED'],
  })
  @IsIn(['PENDING', 'OFFERED', 'EXPIRED', 'CONVERTED', 'CANCELLED'])
  status: 'PENDING' | 'OFFERED' | 'EXPIRED' | 'CONVERTED' | 'CANCELLED';
}

export class CreateQuoteOfferDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  aircraftModelId: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  operatorId: number;

  @ApiProperty({ example: 18500 })
  @Type(() => Number)
  @Min(1)
  price: number;

  @ApiProperty({ example: '2026-12-31T23:59:59.000Z' })
  @IsString()
  @IsNotEmpty()
  expiresAt: string;

  @ApiPropertyOptional({ example: { base: 16000, fees: 2500 } })
  @IsOptional()
  pricingBreakdown?: Record<string, unknown>;
}

export class CreateAirportDto {
  @ApiProperty({ example: 'SGN' })
  @IsString()
  @IsNotEmpty()
  iata: string;

  @ApiProperty({ example: 'VVTS' })
  @IsString()
  @IsNotEmpty()
  icao: string;

  @ApiProperty({ example: 'Tan Son Nhat International Airport' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Ho Chi Minh City' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Vietnam' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiPropertyOptional({ example: 'Asia/Ho_Chi_Minh' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status?: string;

  @ApiPropertyOptional({ example: 'VN' })
  @IsOptional()
  @IsString()
  countryCode?: string;

  @ApiPropertyOptional({ example: 'AS' })
  @IsOptional()
  @IsString()
  continentCode?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  canParkAircraft?: boolean;

  @ApiPropertyOptional({ example: 450 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  landingFee?: number;

  @ApiPropertyOptional({ example: 90 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  parkingFee?: number;

  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  overnightFee?: number;

  @ApiPropertyOptional({ example: 180 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  handlingFee?: number;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  feeCurrency?: string;
}

export class UpdateAirportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  iata?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icao?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ enum: ['ACTIVE', 'INACTIVE'] })
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  countryCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  continentCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  canParkAircraft?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  landingFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  parkingFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  overnightFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  handlingFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  feeCurrency?: string;
}

export class CreateContentPageDto {
  @ApiProperty({ example: 'privacy-policy' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: 'published', enum: ['draft', 'published'] })
  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: string;

  @ApiProperty({ type: ContentTranslationDto })
  @ValidateNested()
  @Type(() => ContentTranslationDto)
  translation: ContentTranslationDto;
}

export class UpdateContentPageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ enum: ['draft', 'published'] })
  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: string;

  @ApiPropertyOptional({ type: ContentTranslationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContentTranslationDto)
  translation?: ContentTranslationDto;
}

export class CreateVideoDto {
  @ApiProperty({ example: 'inside-g650-cabin' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'https://cdn.example.com/video.mp4' })
  @IsString()
  @IsNotEmpty()
  videoUrl: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/thumb.jpg' })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({ example: 180 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({ enum: ['draft', 'published'] })
  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: string;

  @ApiProperty({ type: ContentTranslationDto })
  @ValidateNested()
  @Type(() => ContentTranslationDto)
  translation: ContentTranslationDto;
}

export class UpdateVideoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({ enum: ['draft', 'published'] })
  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: string;

  @ApiPropertyOptional({ type: ContentTranslationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContentTranslationDto)
  translation?: ContentTranslationDto;
}

export class CreateDestinationDto {
  @ApiProperty({ example: 'nassau' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'ISLAND', enum: ['ISLAND', 'SKI', 'GOLF'] })
  @IsIn(['ISLAND', 'SKI', 'GOLF'])
  category: string;

  @ApiProperty({ example: 'Nassau' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'The Bahamas' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({ enum: ['draft', 'published'] })
  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: string;

  @ApiProperty({ type: ContentTranslationDto })
  @ValidateNested()
  @Type(() => ContentTranslationDto)
  translation: ContentTranslationDto;
}

export class UpdateDestinationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['ISLAND', 'SKI', 'GOLF'])
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({ enum: ['draft', 'published'] })
  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: string;

  @ApiPropertyOptional({ type: ContentTranslationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContentTranslationDto)
  translation?: ContentTranslationDto;
}
