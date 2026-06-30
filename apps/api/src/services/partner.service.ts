import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import { PartnerApplicationDto } from '../dto';

@Injectable()
export class PartnerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getPrograms() {
    const programs = await this.prisma.partnerProgram.findMany({ orderBy: { code: 'asc' } });
    return {
      roles: programs.map((p) => {
        const benefits = (p.benefits as { commissionRate?: number; dashboardAccess?: string }) ?? {};
        const commission = benefits.commissionRate
          ? `${Math.round(benefits.commissionRate * 100)}%`
          : '—';
        return {
          code: p.code,
          name: p.name,
          commission,
          features: [
            benefits.dashboardAccess ? `${benefits.dashboardAccess} dashboard` : 'Partner portal',
            'Asset library',
            'Dedicated support',
          ],
        };
      }),
    };
  }

  async submitApplication(body: PartnerApplicationDto) {
    const program = await this.prisma.partnerProgram.findUnique({
      where: { code: body.partnerType.toUpperCase() },
    });
    if (!program) throw new BadRequestException(`Invalid partner type: ${body.partnerType}`);

    let user = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: body.email,
          phone: body.phone,
          accountType: 'INDIVIDUAL',
          role: 'USER',
        },
      });
    }

    const application = await this.prisma.partnerApplication.create({
      data: {
        userId: user.id,
        programId: program.id,
        whatsapp: body.whatsapp,
        wechat: body.wechat,
        reviewStatus: 'PENDING',
      },
    });

    await this.audit.log('PARTNER_APPLICATION', {
      applicationId: application.id,
      programCode: program.code,
      email: body.email,
    });

    return {
      applicationId: application.id,
      status: application.reviewStatus,
      message: 'Application submitted successfully. Review SLA is 3 working days.',
    };
  }

  async listApplicationsAdmin() {
    const applications = await this.prisma.partnerApplication.findMany({
      include: { user: true, program: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return {
      applications: applications.map((a) => ({
        id: a.id,
        email: a.user.email,
        phone: a.user.phone,
        program: a.program.name,
        programCode: a.program.code,
        status: a.reviewStatus,
        whatsapp: a.whatsapp,
        wechat: a.wechat,
        createdAt: a.createdAt.toISOString(),
      })),
    };
  }

  async getDashboard(userId: number) {
    const account = await this.prisma.partnerAccount.findFirst({
      where: { userId },
      include: { program: true },
    });
    if (!account) {
      throw new NotFoundException('No partner account found for this user');
    }

    const applications = await this.prisma.partnerApplication.count({ where: { userId } });
    const bookings = await this.prisma.booking.count({ where: { userId } });

    return {
      stats: {
        totalApplications: applications,
        activeBookings: bookings,
        program: account.program.name,
        dashboardPermissions: account.dashboardPermissions,
      },
      clientUpdates: [],
    };
  }
}
