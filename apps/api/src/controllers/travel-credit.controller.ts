import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RedeemCreditsDto, TravelCreditEnquiryDto } from '../dto';
import { TravelCreditService } from '../services/travel-credit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Travel Credits')
@Controller('travel-credits')
export class TravelCreditController {
  constructor(private readonly travelCreditService: TravelCreditService) {}

  @Get('packages')
  @ApiOperation({ summary: 'Get travel credit packages' })
  @ApiResponse({ status: 200, description: 'Available packages.' })
  getPackages() {
    return this.travelCreditService.getPackages();
  }

  @Post('enquiries')
  @ApiOperation({ summary: 'Submit a travel credit enquiry' })
  @ApiResponse({ status: 201, description: 'Enquiry received.' })
  createEnquiry(@Body() body: TravelCreditEnquiryDto) {
    return this.travelCreditService.createEnquiry(body);
  }

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get current user Travel Credit balance' })
  @ApiResponse({ status: 200, description: 'Balance details.' })
  getCreditsBalance(@CurrentUser() user: AuthUser) {
    return this.travelCreditService.getBalance(user.userId);
  }

  @Post('redeem')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Redeem Travel Credits for a booking' })
  @ApiResponse({ status: 200, description: 'Credits redeemed.' })
  redeemCredits(@Body() body: RedeemCreditsDto, @CurrentUser() user: AuthUser) {
    return this.travelCreditService.redeem(body, user.userId);
  }
}

@ApiTags('Admin Travel Credits')
@Controller('admin/travel-credits')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('bearer')
export class AdminTravelCreditController {
  constructor(private readonly travelCreditService: TravelCreditService) {}

  @Get('transactions')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOperation({ summary: 'List travel credit transactions (admin)' })
  getTransactions(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.travelCreditService.getAdminTransactions(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }
}
