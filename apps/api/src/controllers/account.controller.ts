import { Controller, Get, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { AccountService } from '../services/account.service';

@ApiTags('Account')
@ApiSecurity('X-API-Key')
@Controller('account')
export class AccountController {
  constructor(private readonly account: AccountService) {}

  @Get('dashboard')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary:
      'Aggregated account dashboard — profile, bookings, quotes, payments, documents, memberships',
  })
  @ApiResponse({
    status: 200,
    description: 'Full account snapshot for web My Account UI',
  })
  getDashboard(@CurrentUser() user: AuthUser) {
    return this.account.getDashboard(user.userId, user.email);
  }
}
