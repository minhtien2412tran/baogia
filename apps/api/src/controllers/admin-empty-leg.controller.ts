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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateEmptyLegDto, UpdateEmptyLegDto } from '../dto';
import { EmptyLegService } from '../services/empty-leg.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Admin Empty Legs')
@Controller('admin/empty-legs')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('bearer')
export class AdminEmptyLegController {
  constructor(private readonly emptyLegService: EmptyLegService) {}

  @Get()
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'List all empty legs (admin)' })
  getAll() {
    return this.emptyLegService.getAll('all');
  }

  @Post()
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Create empty leg offer (admin)' })
  create(@Body() body: CreateEmptyLegDto) {
    return this.emptyLegService.create(body);
  }

  @Patch(':id')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Update empty leg offer (admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateEmptyLegDto) {
    return this.emptyLegService.update(id, body);
  }

  @Delete(':id')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Delete empty leg offer (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.emptyLegService.delete(id);
  }
}
