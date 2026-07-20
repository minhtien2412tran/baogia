import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import {
  CreateConversationDto,
  SendMessageDto,
} from './realtime.dto';
import { RealtimeService } from './realtime.service';

@ApiTags('Realtime')
@ApiBearerAuth('bearer')
@Controller('realtime')
@UseGuards(JwtAuthGuard)
export class RealtimeController {
  constructor(private readonly realtime: RealtimeService) {}

  @Post('conversations')
  create(
    @CurrentUser() user: AuthUser,
    @Body() body: CreateConversationDto,
  ) {
    return this.realtime.createConversation(user.userId, user.role, body);
  }

  @Get('conversations')
  list(@CurrentUser() user: AuthUser) {
    return this.realtime.listConversations(user.userId, user.role);
  }

  @Get('conversations/:publicId')
  get(
    @Param('publicId') publicId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.realtime.getConversation(publicId, user.userId, user.role);
  }

  @Post('conversations/:publicId/join')
  joinAsStaff(
    @Param('publicId') publicId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.realtime.joinAsStaff(publicId, user.userId, user.role);
  }

  @Get('conversations/:publicId/messages')
  messages(
    @Param('publicId') publicId: string,
    @CurrentUser() user: AuthUser,
    @Query('cursor') cursor?: string,
  ) {
    const parsedCursor = cursor ? Number(cursor) : undefined;
    return this.realtime.listMessages(
      publicId,
      user.userId,
      user.role,
      Number.isInteger(parsedCursor) && parsedCursor! > 0
        ? parsedCursor
        : undefined,
    );
  }

  @Post('conversations/:publicId/messages')
  sendMessage(
    @Param('publicId') publicId: string,
    @CurrentUser() user: AuthUser,
    @Body() body: SendMessageDto,
  ) {
    return this.realtime.sendMessage(
      publicId,
      user.userId,
      user.role,
      body,
    );
  }

  @Patch('conversations/:publicId/read')
  markRead(
    @Param('publicId') publicId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.realtime.markRead(publicId, user.userId, user.role);
  }
}
