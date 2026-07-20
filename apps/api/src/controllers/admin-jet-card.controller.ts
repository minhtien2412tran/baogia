import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { CreateJetCardPlanDto, UpdateJetCardPlanDto } from '../dto';
import { JetCardService } from '../services/jet-card.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StaffGuard } from '../auth/staff.guard';
import { PermissionGuard } from '../permissions/permission.guard';
import { RequirePermissions } from '../permissions/require-permissions.decorator';

@ApiTags('Admin Jet Card')
@ApiSecurity('X-API-Key')
@Controller('admin/jet-card/plans')
@UseGuards(JwtAuthGuard, StaffGuard, PermissionGuard)
@ApiBearerAuth('bearer')
export class AdminJetCardController {
  constructor(private readonly jetCardService: JetCardService) {}

  @Get()
  @RequirePermissions('jet_card.view')
  @ApiOperation({ summary: 'List Jet Card plans (admin)' })
  list() {
    return this.jetCardService.getPlans();
  }

  @Post()
  @RequirePermissions('jet_card.manage')
  @ApiOperation({ summary: 'Create Jet Card plan (admin)' })
  create(@Body() body: CreateJetCardPlanDto) {
    return this.jetCardService.createPlan(body);
  }

  @Patch(':id')
  @RequirePermissions('jet_card.manage')
  @ApiOperation({ summary: 'Update Jet Card plan (admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateJetCardPlanDto,
  ) {
    return this.jetCardService.updatePlan(id, body);
  }

  @Delete(':id')
  @RequirePermissions('jet_card.manage')
  @ApiOperation({ summary: 'Delete Jet Card plan (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jetCardService.deletePlan(id);
  }
}
