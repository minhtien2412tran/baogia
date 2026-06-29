import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PartnerApplicationDto } from '../dto';

@ApiTags('Partners')
@Controller('partners')
export class PartnerController {
  @Get('programs')
  @ApiOperation({ summary: 'Get details of global partner program roles' })
  @ApiResponse({ status: 200, description: 'Comparison matrix of partner tiers.' })
  getPrograms() {
    return {
      roles: [
        { code: 'REFERRAL', name: 'Referral Partner', commission: '3%', features: ['Portal access', 'Asset library'] },
        { code: 'SERVICE', name: 'Service Partner', commission: '5%', features: ['Client dashboard', 'Signing system', '24/7 ops'] },
        { code: 'OFFICIAL', name: 'Official Partner', commission: '7%', features: ['Joint PR', 'Smart API integration', 'Supplier contracts'] }
      ]
    };
  }

  @Post('applications')
  @ApiOperation({ summary: 'Submit a new partnership application' })
  @ApiResponse({ status: 201, description: 'Application submitted.' })
  submitApplication(@Body() body: PartnerApplicationDto) {
    return {
      applicationId: 88,
      status: 'PENDING',
      message: 'Application submitted successfully. Review SLA is 3 working days.',
    };
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard widgets and client updates for partners' })
  @ApiResponse({ status: 200, description: 'Dashboard stats.' })
  getDashboard() {
    return {
      stats: {
        totalLeads: 12,
        activeQuotes: 4,
        confirmedBookings: 2,
        totalCommissionEarned: 5800.0,
      },
      clientUpdates: [
        { id: 1, clientName: 'Alice Johnson', status: 'Quote Sent', route: 'London - Paris' },
        { id: 2, clientName: 'Bob Smith', status: 'Agreement Signed', route: 'New York - Miami' }
      ]
    };
  }
}
