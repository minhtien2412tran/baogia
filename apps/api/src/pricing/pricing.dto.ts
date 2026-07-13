import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PricingEstimateDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  aircraftId!: number;

  @ApiProperty({
    example: 2,
    description: 'Passenger departure airport id (e.g. HAN)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  fromAirportId!: number;

  @ApiProperty({
    example: 3,
    description: 'Passenger arrival airport id (e.g. SGN)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  toAirportId!: number;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  passengerCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  departureAt?: string;

  @ApiPropertyOptional({ description: 'Persist immutable PricingEstimate row' })
  @IsOptional()
  persist?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  bookingId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  quoteRequestId?: number;
}
