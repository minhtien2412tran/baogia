import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import { LoginDto, RegisterDto } from '../dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  private tokens(userId: number) {
    return {
      accessToken: `demo-token-${userId}-${Date.now()}`,
      refreshToken: `demo-refresh-${userId}`,
    };
  }

  async register(body: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (existing) throw new BadRequestException('Email already registered');

    const user = await this.prisma.user.create({
      data: {
        email: body.email,
        passwordHash: body.password ?? null,
        accountType: body.accountType ?? 'INDIVIDUAL',
      },
    });
    await this.audit.log('USER_REGISTERED', { userId: user.id }, user.id);
    return {
      message: 'User successfully registered',
      user: { id: user.id, email: user.email, accountType: user.accountType, status: user.status },
      tokens: this.tokens(user.id),
    };
  }

  async login(body: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    await this.audit.log('USER_LOGIN', { userId: user.id }, user.id);
    return {
      message: 'Login successful',
      user: { id: user.id, email: user.email, accountType: user.accountType },
      tokens: this.tokens(user.id),
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      accountType: user.accountType,
      companyId: user.companyId,
      status: user.status,
      roles: ['USER'],
    };
  }

  resolveUserId(authHeader?: string): number {
    if (!authHeader) return 1;
    const match = authHeader.match(/demo-token-(\d+)/);
    return match ? Number(match[1]) : 1;
  }
}
