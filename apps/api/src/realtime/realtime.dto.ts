import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateConversationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  bookingId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  subject?: string;
}

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  content: string;
}

export class ConversationIdDto {
  @IsString()
  @IsNotEmpty()
  conversationId: string;
}

export class CallTargetDto extends ConversationIdDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  toUserId: number;
}

export class CallSignalDto extends ConversationIdDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  toUserId: number;

  @IsNotEmpty()
  signal: unknown;
}
