import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AircraftService } from '../services/aircraft.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Admin Aircraft')
@Controller('admin/aircraft')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminAircraftController {
  constructor(private readonly aircraft: AircraftService) {}

  @Get('categories')
  @ApiOperation({ summary: 'List aircraft categories with models' })
  listCategories() {
    return this.aircraft.listCategories();
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create aircraft category' })
  createCategory(@Body() body: { code: string; label: string; maxPassengers?: number }) {
    return this.aircraft.createCategory(body);
  }

  @Patch('categories/:id')
  @ApiOperation({ summary: 'Update aircraft category' })
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { code?: string; label?: string; maxPassengers?: number },
  ) {
    return this.aircraft.updateCategory(id, body);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete aircraft category' })
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.aircraft.deleteCategory(id);
  }

  @Get('models')
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiOperation({ summary: 'List aircraft models' })
  listModels(@Query('categoryId') categoryId?: string) {
    return this.aircraft.listModels(categoryId ? Number(categoryId) : undefined);
  }

  @Post('models')
  @ApiOperation({ summary: 'Create aircraft model' })
  createModel(
    @Body()
    body: {
      manufacturer: string;
      model: string;
      categoryId: number;
      rangeKm?: number;
      speedKmh?: number;
      sleepCapacity?: number;
    },
  ) {
    return this.aircraft.createModel(body);
  }

  @Patch('models/:id')
  @ApiOperation({ summary: 'Update aircraft model' })
  updateModel(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      manufacturer?: string;
      model?: string;
      categoryId?: number;
      rangeKm?: number;
      speedKmh?: number;
      sleepCapacity?: number;
    },
  ) {
    return this.aircraft.updateModel(id, body);
  }

  @Delete('models/:id')
  @ApiOperation({ summary: 'Delete aircraft model' })
  deleteModel(@Param('id', ParseIntPipe) id: number) {
    return this.aircraft.deleteModel(id);
  }
}
