import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { PartnerApplicationDto } from '../dto';
import { PartnerService } from '../services/partner.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Partners')
@ApiSecurity('X-API-Key')
@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get('programs')
  @ApiOperation({ summary: 'Get details of global partner program roles' })
  @ApiResponse({
    status: 200,
    description: 'Comparison matrix of partner tiers.',
  })
  getPrograms() {
    return this.partnerService.getPrograms();
  }

  @Post('applications')
  @ApiOperation({ summary: 'Submit a new partnership application' })
  @ApiResponse({ status: 201, description: 'Application submitted.' })
  submitApplication(@Body() body: PartnerApplicationDto) {
    return this.partnerService.submitApplication(body);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get dashboard widgets for authenticated partners' })
  @ApiResponse({ status: 200, description: 'Dashboard stats.' })
  getDashboard(@CurrentUser() user: AuthUser) {
    return this.partnerService.getDashboard(user.userId);
  }
}
