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
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Admin Jet Card')
@ApiSecurity('X-API-Key')
@Controller('admin/jet-card/plans')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('bearer')
export class AdminJetCardController {
  constructor(private readonly jetCardService: JetCardService) {}

  @Get()
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'List Jet Card plans (admin)' })
  list() {
    return this.jetCardService.getPlans();
  }

  @Post()
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Create Jet Card plan (admin)' })
  create(@Body() body: CreateJetCardPlanDto) {
    return this.jetCardService.createPlan(body);
  }

  @Patch(':id')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Update Jet Card plan (admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateJetCardPlanDto,
  ) {
    return this.jetCardService.updatePlan(id, body);
  }

  @Delete(':id')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Delete Jet Card plan (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jetCardService.deletePlan(id);
  }
}
