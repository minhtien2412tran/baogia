import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateJetCardPlanDto, UpdateJetCardPlanDto } from '../dto';
import { JetCardService } from '../services/jet-card.service';

@ApiTags('Admin Jet Card')
@Controller('admin/jet-card/plans')
export class AdminJetCardController {
  constructor(private readonly jetCardService: JetCardService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List Jet Card plans (admin)' })
  list() {
    return this.jetCardService.getPlans();
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Jet Card plan (admin)' })
  create(@Body() body: CreateJetCardPlanDto) {
    return this.jetCardService.createPlan(body);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Jet Card plan (admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateJetCardPlanDto) {
    return this.jetCardService.updatePlan(id, body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Jet Card plan (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jetCardService.deletePlan(id);
  }
}
