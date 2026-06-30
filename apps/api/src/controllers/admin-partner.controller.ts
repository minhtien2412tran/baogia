import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PartnerService } from '../services/partner.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Admin Partners')
@Controller('admin/partners')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminPartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get('applications')
  @ApiOperation({ summary: 'List partner applications (admin)' })
  listApplications() {
    return this.partnerService.listApplicationsAdmin();
  }
}
