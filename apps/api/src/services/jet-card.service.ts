import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import {
  CreateJetCardPlanDto,
  JetCardEnquiryDto,
  UpdateJetCardPlanDto,
} from '../dto';

@Injectable()
export class JetCardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  private formatPlan(plan: {
    id: number;
    name: string;
    hours: number;
    validityYears: number;
    minNoticeHours: number;
    dailyMinHours: { toNumber?: () => number } | number;
    price: { toNumber?: () => number } | number;
  }) {
    return {
      id: plan.id,
      name: plan.name,
      hours: plan.hours,
      validityYears: plan.validityYears,
      minNoticeHours: plan.minNoticeHours,
      dailyMinHours: Number(plan.dailyMinHours),
      price: Number(plan.price),
    };
  }

  async getPlans() {
    const plans = await this.prisma.jetCardPlan.findMany({ orderBy: { hours: 'asc' } });
    return { plans: plans.map((p) => this.formatPlan(p)) };
  }

  async createEnquiry(body: JetCardEnquiryDto) {
    if (!body.isConsentAccepted) {
      throw new BadRequestException('Consent is required');
    }

    const record = await this.prisma.auditLog.create({
      data: {
        action: 'JET_CARD_ENQUIRY',
        details: {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone,
          message: body.message ?? null,
        },
      },
    });

    return {
      enquiryId: record.id,
      status: 'PENDING',
      message: 'Thank you for your interest. A Jet Card specialist will contact you shortly.',
    };
  }

  async getCardBalance(id: number) {
    const account = await this.prisma.jetCardAccount.findUnique({
      where: { id },
      include: {
        plan: true,
        transactions: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!account) throw new NotFoundException(`Jet Card account #${id} not found`);

    return {
      accountId: account.id,
      planName: account.plan.name,
      remainingHours: Number(account.remainingHours),
      expiryDate: account.expiresAt.toISOString(),
      transactions: account.transactions.map((t) => ({
        txnId: t.id,
        txnType: t.txnType,
        hoursDelta: Number(t.hoursDelta),
        date: t.createdAt.toISOString().slice(0, 10),
      })),
    };
  }

  async createPlan(dto: CreateJetCardPlanDto) {
    const plan = await this.prisma.jetCardPlan.create({
      data: {
        name: dto.name,
        hours: dto.hours,
        validityYears: dto.validityYears ?? 2,
        minNoticeHours: dto.minNoticeHours ?? 24,
        dailyMinHours: dto.dailyMinHours ?? 1.0,
        price: dto.price,
      },
    });
    await this.audit.log('JET_CARD_PLAN_CREATED', { planId: plan.id, name: plan.name });
    return this.formatPlan(plan);
  }

  async updatePlan(id: number, dto: UpdateJetCardPlanDto) {
    await this.findPlanOrThrow(id);
    const plan = await this.prisma.jetCardPlan.update({
      where: { id },
      data: {
        name: dto.name,
        hours: dto.hours,
        validityYears: dto.validityYears,
        minNoticeHours: dto.minNoticeHours,
        dailyMinHours: dto.dailyMinHours,
        price: dto.price,
      },
    });
    await this.audit.log('JET_CARD_PLAN_UPDATED', { planId: id });
    return this.formatPlan(plan);
  }

  async deletePlan(id: number) {
    await this.findPlanOrThrow(id);
    const accounts = await this.prisma.jetCardAccount.count({ where: { planId: id } });
    if (accounts > 0) {
      throw new BadRequestException('Cannot delete plan with active accounts');
    }
    await this.prisma.jetCardPlan.delete({ where: { id } });
    await this.audit.log('JET_CARD_PLAN_DELETED', { planId: id });
    return { message: 'Plan deleted', id };
  }

  private async findPlanOrThrow(id: number) {
    const plan = await this.prisma.jetCardPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException(`Jet Card plan #${id} not found`);
    return plan;
  }
}
