import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JetCardEnquiryDto } from '../dto';
import { JetCardService } from '../services/jet-card.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Jet Card')
@Controller('jet-card')
export class JetCardController {
  constructor(private readonly jetCardService: JetCardService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get Jet Card membership plans' })
  @ApiResponse({ status: 200, description: 'List of available Jet Card membership plans.' })
  getPlans() {
    return this.jetCardService.getPlans();
  }

  @Post('enquiries')
  @ApiOperation({ summary: 'Submit a Jet Card membership enquiry' })
  @ApiResponse({ status: 201, description: 'Enquiry received successfully.' })
  createEnquiry(@Body() body: JetCardEnquiryDto) {
    return this.jetCardService.createEnquiry(body);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'List Jet Card accounts for the current user' })
  getMyAccounts(@CurrentUser() user: AuthUser) {
    return this.jetCardService.getUserAccounts(user.userId);
  }

  @Get('accounts/:id/balance')
  @ApiOperation({ summary: 'Get remaining Jet Card hours and details' })
  @ApiParam({ name: 'id', type: 'number', description: 'Account ID' })
  @ApiResponse({ status: 200, description: 'Card balance details.' })
  getCardBalance(@Param('id', ParseIntPipe) id: number) {
    return this.jetCardService.getCardBalance(id);
  }
}
