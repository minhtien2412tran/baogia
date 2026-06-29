import { Controller, Get, Post, Body, Headers, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { RedeemCreditsDto, TravelCreditEnquiryDto } from '../dto';
import { TravelCreditService } from '../services/travel-credit.service';

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
  @ApiHeader({ name: 'X-User-Id', required: false })
  @ApiOperation({ summary: 'Get current user Travel Credit balance' })
  @ApiResponse({ status: 200, description: 'Balance details.' })
  getCreditsBalance(@Headers('x-user-id') userId?: string) {
    return this.travelCreditService.getBalance(userId ? Number(userId) : 1);
  }

  @Post('redeem')
  @ApiHeader({ name: 'X-User-Id', required: false })
  @ApiOperation({ summary: 'Redeem Travel Credits for a booking' })
  @ApiResponse({ status: 200, description: 'Credits redeemed.' })
  redeemCredits(
    @Body() body: RedeemCreditsDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.travelCreditService.redeem(body, userId ? Number(userId) : 1);
  }
}

@ApiTags('Admin Travel Credits')
@Controller('admin/travel-credits')
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
