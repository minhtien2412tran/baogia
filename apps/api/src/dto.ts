import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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

  @ApiProperty({ example: true })
  @IsBoolean()
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
  bookingId: number;

  @ApiProperty({ example: 'CREDIT_CARD', description: 'CREDIT_CARD, BANK_TRANSFER, or HOLD' })
  method: string;
}

export class ConfirmPaymentDto {
  @ApiProperty({ example: 'payment-intent-id-xyz' })
  paymentIntentId: string;
}

// --- BOOKING DTOS ---

export class BookingContactDto {
  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '+84900000000' })
  phone: string;
}

export class BookingPassengerDto {
  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiPropertyOptional({ example: 'AB1234567' })
  passportNumber?: string;

  @ApiPropertyOptional({ example: '1990-01-15' })
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'US' })
  nationality?: string;
}

export class BookingItineraryLegDto {
  @ApiProperty({ example: 'LTN' })
  fromAirport: string;

  @ApiProperty({ example: 'LBG' })
  toAirport: string;

  @ApiProperty({ example: '2026-12-01T10:00:00Z' })
  departureAt: string;
}

export class BookingItineraryDto {
  @ApiProperty({ example: 'ONE_WAY' })
  tripType: string;

  @ApiProperty({ type: [BookingItineraryLegDto] })
  legs: BookingItineraryLegDto[];
}

export class CreateBookingDto {
  @ApiPropertyOptional({ example: 1, description: 'Quote request or offer ID' })
  quoteId?: number;

  @ApiProperty({ example: 'CHARTER' })
  bookingType?: string;

  @ApiProperty({ type: BookingItineraryDto })
  itinerary: BookingItineraryDto;

  @ApiProperty({ type: [BookingPassengerDto] })
  passengers: BookingPassengerDto[];

  @ApiProperty({ type: BookingContactDto })
  contact: BookingContactDto;
}

export class UpdateBookingStatusDto {
  @ApiProperty({
    example: 'confirmed',
    enum: ['draft', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
  })
  status: string;
}

// --- COMMERCIAL ADMIN DTOS ---

export class FixedPriceOptionDto {
  @ApiProperty({ example: 'LIGHT' })
  categoryCode: string;

  @ApiProperty({ example: 13500 })
  price: number;

  @ApiProperty({ example: 8 })
  paxLimit: number;

  @ApiPropertyOptional({ example: 'Standard catering included' })
  includedTerms?: string;
}

export class CreateFixedPriceRouteDto {
  @ApiProperty({ example: 'london-to-paris' })
  slug: string;

  @ApiProperty({ example: 'LTN' })
  fromAirportIata: string;

  @ApiProperty({ example: 'LBG' })
  toAirportIata: string;

  @ApiProperty({ example: 'Europe' })
  region: string;

  @ApiPropertyOptional({ example: 'ACTIVE' })
  status?: string;

  @ApiPropertyOptional({ type: [FixedPriceOptionDto] })
  options?: FixedPriceOptionDto[];
}

export class UpdateFixedPriceRouteDto {
  @ApiPropertyOptional({ example: 'london-to-paris' })
  slug?: string;

  @ApiPropertyOptional({ example: 'LTN' })
  fromAirportIata?: string;

  @ApiPropertyOptional({ example: 'LBG' })
  toAirportIata?: string;

  @ApiPropertyOptional({ example: 'Europe' })
  region?: string;

  @ApiPropertyOptional({ example: 'ACTIVE' })
  status?: string;

  @ApiPropertyOptional({ type: [FixedPriceOptionDto] })
  options?: FixedPriceOptionDto[];
}

export class CreateEmptyLegDto {
  @ApiProperty({ example: 'paris-to-geneva-empty-leg' })
  slug: string;

  @ApiProperty({ example: 'LBG' })
  fromAirportIata: string;

  @ApiProperty({ example: 'GVA' })
  toAirportIata: string;

  @ApiProperty({ example: '2026-12-05T09:00:00Z' })
  departAt: string;

  @ApiProperty({ example: 1, description: 'Aircraft model ID' })
  aircraftModelId: number;

  @ApiProperty({ example: 4200 })
  price: number;

  @ApiPropertyOptional({ example: 60 })
  discountPct?: number;

  @ApiPropertyOptional({ example: 'ACTIVE' })
  status?: string;
}

export class UpdateEmptyLegDto {
  @ApiPropertyOptional()
  slug?: string;

  @ApiPropertyOptional()
  fromAirportIata?: string;

  @ApiPropertyOptional()
  toAirportIata?: string;

  @ApiPropertyOptional()
  departAt?: string;

  @ApiPropertyOptional()
  aircraftModelId?: number;

  @ApiPropertyOptional()
  price?: number;

  @ApiPropertyOptional()
  discountPct?: number;

  @ApiPropertyOptional()
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
  name: string;

  @ApiProperty({ example: 25 })
  hours: number;

  @ApiPropertyOptional({ example: 2 })
  validityYears?: number;

  @ApiPropertyOptional({ example: 24 })
  minNoticeHours?: number;

  @ApiPropertyOptional({ example: 1.5 })
  dailyMinHours?: number;

  @ApiProperty({ example: 120000 })
  price: number;
}

export class UpdateJetCardPlanDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  hours?: number;

  @ApiPropertyOptional()
  validityYears?: number;

  @ApiPropertyOptional()
  minNoticeHours?: number;

  @ApiPropertyOptional()
  dailyMinHours?: number;

  @ApiPropertyOptional()
  price?: number;
}

export class TravelCreditEnquiryDto {
  @ApiProperty({ example: 'Jane' })
  firstName: string;

  @ApiProperty({ example: 'Smith' })
  lastName: string;

  @ApiProperty({ example: 'jane@example.com' })
  email: string;

  @ApiProperty({ example: '+44123456789' })
  phone: string;

  @ApiProperty({ example: 1, description: 'Travel credit package ID' })
  packageId: number;

  @ApiPropertyOptional({ example: 'Interested in corporate package' })
  message?: string;

  @ApiProperty({ example: true })
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
  @ApiProperty({ example: 'en' })
  locale: string;

  @ApiProperty({ example: 'Article Title' })
  title: string;

  @ApiProperty({ example: 'Full article body content...' })
  body: string;

  @ApiPropertyOptional({ example: 'Short summary' })
  excerpt?: string;

  @ApiPropertyOptional({ example: 'SEO Title' })
  seoTitle?: string;

  @ApiPropertyOptional({ example: 'SEO description' })
  seoDescription?: string;
}

export class CreateContentArticleDto {
  @ApiProperty({ example: 'news', enum: ['news', 'blog'] })
  type: string;

  @ApiProperty({ example: 'jetbay-expands-fleet' })
  slug: string;

  @ApiProperty({ example: 'PR Team' })
  author?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/thumb.jpg' })
  thumbnail?: string;

  @ApiPropertyOptional({ example: 'news' })
  category?: string;

  @ApiPropertyOptional({ example: 'published', enum: ['draft', 'published'] })
  status?: string;

  @ApiPropertyOptional({ example: '2026-06-25T00:00:00Z' })
  publishedAt?: string;

  @ApiProperty({ type: ContentTranslationDto })
  translation: ContentTranslationDto;
}

export class UpdateContentArticleDto {
  @ApiPropertyOptional()
  slug?: string;

  @ApiPropertyOptional()
  author?: string;

  @ApiPropertyOptional()
  thumbnail?: string;

  @ApiPropertyOptional()
  category?: string;

  @ApiPropertyOptional({ enum: ['draft', 'published'] })
  status?: string;

  @ApiPropertyOptional()
  publishedAt?: string;

  @ApiPropertyOptional({ type: ContentTranslationDto })
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
}

export class CreateContentPageDto {
  @ApiProperty({ example: 'privacy-policy' })
  slug: string;

  @ApiPropertyOptional({ example: 'published', enum: ['draft', 'published'] })
  status?: string;

  @ApiProperty({ type: ContentTranslationDto })
  translation: ContentTranslationDto;
}

export class UpdateContentPageDto {
  @ApiPropertyOptional()
  slug?: string;

  @ApiPropertyOptional({ enum: ['draft', 'published'] })
  status?: string;

  @ApiPropertyOptional({ type: ContentTranslationDto })
  translation?: ContentTranslationDto;
}

export class CreateVideoDto {
  @ApiProperty({ example: 'inside-g650-cabin' })
  slug: string;

  @ApiProperty({ example: 'https://cdn.example.com/video.mp4' })
  videoUrl: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/thumb.jpg' })
  thumbnail?: string;

  @ApiPropertyOptional({ example: 180 })
  duration?: number;

  @ApiPropertyOptional({ enum: ['draft', 'published'] })
  status?: string;

  @ApiProperty({ type: ContentTranslationDto })
  translation: ContentTranslationDto;
}

export class UpdateVideoDto {
  @ApiPropertyOptional()
  slug?: string;

  @ApiPropertyOptional()
  videoUrl?: string;

  @ApiPropertyOptional()
  thumbnail?: string;

  @ApiPropertyOptional()
  duration?: number;

  @ApiPropertyOptional({ enum: ['draft', 'published'] })
  status?: string;

  @ApiPropertyOptional({ type: ContentTranslationDto })
  translation?: ContentTranslationDto;
}

export class CreateDestinationDto {
  @ApiProperty({ example: 'nassau' })
  slug: string;

  @ApiProperty({ example: 'ISLAND', enum: ['ISLAND', 'SKI', 'GOLF'] })
  category: string;

  @ApiProperty({ example: 'Nassau' })
  city: string;

  @ApiProperty({ example: 'The Bahamas' })
  country: string;

  @ApiPropertyOptional()
  thumbnail?: string;

  @ApiPropertyOptional({ enum: ['draft', 'published'] })
  status?: string;

  @ApiProperty({ type: ContentTranslationDto })
  translation: ContentTranslationDto;
}

export class UpdateDestinationDto {
  @ApiPropertyOptional()
  slug?: string;

  @ApiPropertyOptional()
  category?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  thumbnail?: string;

  @ApiPropertyOptional({ enum: ['draft', 'published'] })
  status?: string;

  @ApiPropertyOptional({ type: ContentTranslationDto })
  translation?: ContentTranslationDto;
}
