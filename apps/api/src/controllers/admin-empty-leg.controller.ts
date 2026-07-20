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
import { CreateEmptyLegDto, UpdateEmptyLegDto } from '../dto';
import { EmptyLegService } from '../services/empty-leg.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StaffGuard } from '../auth/staff.guard';
import { PermissionGuard } from '../permissions/permission.guard';
import { RequirePermissions } from '../permissions/require-permissions.decorator';

@ApiTags('Admin Empty Legs')
@ApiSecurity('X-API-Key')
@Controller('admin/empty-legs')
@UseGuards(JwtAuthGuard, StaffGuard, PermissionGuard)
@ApiBearerAuth('bearer')
export class AdminEmptyLegController {
  constructor(private readonly emptyLegService: EmptyLegService) {}

  @Get()
  @RequirePermissions('empty_leg.view')
  @ApiOperation({ summary: 'List all empty legs (admin)' })
  getAll() {
    return this.emptyLegService.getAll('all');
  }

  @Post()
  @RequirePermissions('empty_leg.manage')
  @ApiOperation({ summary: 'Create empty leg offer (admin)' })
  create(@Body() body: CreateEmptyLegDto) {
    return this.emptyLegService.create(body);
  }

  @Patch(':id')
  @RequirePermissions('empty_leg.manage')
  @ApiOperation({ summary: 'Update empty leg offer (admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEmptyLegDto,
  ) {
    return this.emptyLegService.update(id, body);
  }

  @Delete(':id')
  @RequirePermissions('empty_leg.manage')
  @ApiOperation({ summary: 'Delete empty leg offer (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.emptyLegService.delete(id);
  }
}
