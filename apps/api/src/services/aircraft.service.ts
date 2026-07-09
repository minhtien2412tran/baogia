import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';

@Injectable()
export class AircraftService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async listCategories() {
    const categories = await this.prisma.aircraftCategory.findMany({
      include: { models: { orderBy: { model: 'asc' } } },
      orderBy: { code: 'asc' },
    });
    return { categories };
  }

  async listModels(categoryId?: number) {
    const models = await this.prisma.aircraftModel.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: { category: true },
      orderBy: [{ manufacturer: 'asc' }, { model: 'asc' }],
    });
    return { models };
  }

  async createCategory(body: { code: string; label: string; maxPassengers?: number }) {
    const category = await this.prisma.aircraftCategory.create({
      data: {
        code: body.code.toUpperCase(),
        label: body.label,
        maxPassengers: body.maxPassengers ?? 8,
      },
    });
    await this.audit.log('AIRCRAFT_CATEGORY_CREATED', { categoryId: category.id });
    return category;
  }

  async updateCategory(
    id: number,
    body: { code?: string; label?: string; maxPassengers?: number },
  ) {
    await this.findCategoryOrThrow(id);
    return this.prisma.aircraftCategory.update({
      where: { id },
      data: {
        code: body.code?.toUpperCase(),
        label: body.label,
        maxPassengers: body.maxPassengers,
      },
    });
  }

  async deleteCategory(id: number) {
    await this.findCategoryOrThrow(id);
    const modelCount = await this.prisma.aircraftModel.count({ where: { categoryId: id } });
    if (modelCount > 0) {
      throw new BadRequestException('Remove aircraft models before deleting category');
    }
    await this.prisma.aircraftCategory.delete({ where: { id } });
    return { message: 'Category deleted' };
  }

  async createModel(body: {
    manufacturer: string;
    model: string;
    categoryId: number;
    rangeKm?: number;
    speedKmh?: number;
    sleepCapacity?: number;
  }) {
    await this.findCategoryOrThrow(body.categoryId);
    const created = await this.prisma.aircraftModel.create({
      data: body,
      include: { category: true },
    });
    await this.audit.log('AIRCRAFT_MODEL_CREATED', { modelId: created.id });
    return created;
  }

  async updateModel(
    id: number,
    body: {
      manufacturer?: string;
      model?: string;
      categoryId?: number;
      rangeKm?: number;
      speedKmh?: number;
      sleepCapacity?: number;
    },
  ) {
    await this.findModelOrThrow(id);
    if (body.categoryId) await this.findCategoryOrThrow(body.categoryId);
    return this.prisma.aircraftModel.update({
      where: { id },
      data: body,
      include: { category: true },
    });
  }

  async deleteModel(id: number) {
    await this.findModelOrThrow(id);
    const inUse = await this.prisma.emptyLegOffer.count({ where: { aircraftModelId: id } });
    if (inUse > 0) throw new BadRequestException('Model is referenced by empty leg offers');
    await this.prisma.aircraftModel.delete({ where: { id } });
    return { message: 'Model deleted' };
  }

  private async findCategoryOrThrow(id: number) {
    const c = await this.prisma.aircraftCategory.findUnique({ where: { id } });
    if (!c) throw new NotFoundException(`Category ${id} not found`);
    return c;
  }

  private async findModelOrThrow(id: number) {
    const m = await this.prisma.aircraftModel.findUnique({ where: { id } });
    if (!m) throw new NotFoundException(`Model ${id} not found`);
    return m;
  }
}
