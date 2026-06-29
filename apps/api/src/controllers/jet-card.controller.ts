import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JetCardEnquiryDto, RedeemCreditsDto } from '../dto';

@ApiTags('Jet Card & Travel Credits')
@Controller()
export class JetCardController {
  @Get('jet-card/plans')
  @ApiOperation({ summary: 'Get Jet Card membership plans' })
  @ApiResponse({ status: 200, description: 'List of available Jet Card membership plans.' })
  getPlans() {
    return {
      plans: [
        { id: 1, name: 'Silver Card', hours: 10, minNoticeHours: 48, price: 50000.0 },
        { id: 2, name: 'Gold Card', hours: 25, minNoticeHours: 24, price: 120000.0 },
        { id: 3, name: 'Platinum Card', hours: 50, minNoticeHours: 12, price: 220000.0 }
      ]
    };
  }

  @Post('jet-card/enquiries')
  @ApiOperation({ summary: 'Submit a Jet Card membership enquiry' })
  @ApiResponse({ status: 201, description: 'Enquiry received successfully.' })
  createEnquiry(@Body() body: JetCardEnquiryDto) {
    return {
      enquiryId: 44,
      status: 'PENDING',
      message: 'Thank you for your interest. A Jet Card specialist will contact you shortly.',
    };
  }

  @Get('jet-card/accounts/:id/balance')
  @ApiOperation({ summary: 'Get remaining Jet Card hours and details' })
  @ApiParam({ name: 'id', type: 'number', description: 'Account ID' })
  @ApiResponse({ status: 200, description: 'Card balance details.' })
  getCardBalance(@Param('id') id: number) {
    return {
      accountId: Number(id),
      planName: 'Gold Card',
      remainingHours: 18.5,
      expiryDate: '2027-06-29T15:00:00Z',
      transactions: [
        { txnId: 501, txnType: 'DEDUCTION', hoursDelta: -6.5, date: '2026-06-20' },
        { txnId: 402, txnType: 'TOP_UP', hoursDelta: 25.0, date: '2026-01-10' }
      ]
    };
  }

  @Get('travel-credits/balance')
  @ApiOperation({ summary: 'Get current user/company Travel Credit balance' })
  @ApiResponse({ status: 200, description: 'Balance details.' })
  getCreditsBalance() {
    return {
      credits: 2450.00,
      currency: 'USD',
      expirySummary: [
        { amount: 1500.0, expiresAt: '2027-12-31T23:59:59Z' },
        { amount: 950.0, expiresAt: '2028-06-30T23:59:59Z' }
      ]
    };
  }

  @Post('travel-credits/redeem')
  @ApiOperation({ summary: 'Redeem Travel Credits for a specific booking' })
  @ApiResponse({ status: 200, description: 'Credits successfully redeemed and booking price updated.' })
  redeemCredits(@Body() body: RedeemCreditsDto) {
    return {
      bookingId: body.bookingId,
      creditsRedeemed: body.credits,
      originalPrice: 12500.0,
      newPrice: 12000.0,
      currency: 'USD',
      message: 'Credits redeemed successfully.',
    };
  }
}
