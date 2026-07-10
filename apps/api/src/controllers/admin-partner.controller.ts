import { Body, Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { PartnerService } from '../services/partner.service';
import { ReviewPartnerApplicationDto } from '../dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Admin Partners')
@ApiSecurity('X-API-Key')
@Controller('admin/partners')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('bearer')
export class AdminPartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get('applications')
  @ApiOperation({ summary: 'List partner applications (admin)' })
  listApplications() {
    return this.partnerService.listApplicationsAdmin();
  }

  @Patch('applications/:id')
  @ApiOperation({ summary: 'Approve or reject a partner application' })
  reviewApplication(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ReviewPartnerApplicationDto,
  ) {
    return this.partnerService.reviewApplication(id, body.status);
  }
}
