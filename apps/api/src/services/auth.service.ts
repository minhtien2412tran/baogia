import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import { LoginDto, RegisterDto } from '../dto';
import type { JwtPayload } from '../auth/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly jwt: JwtService,
  ) {}

  private signTokens(user: { id: number; email: string; role: string }) {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwt.sign(payload),
      refreshToken: this.jwt.sign({ sub: user.id, type: 'refresh' }, { expiresIn: '30d' }),
    };
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  private async verifyPassword(password: string, hash: string | null) {
    if (!hash) return false;
    return bcrypt.compare(password, hash);
  }

  async register(body: RegisterDto) {
    if (!body.password) throw new BadRequestException('Password is required');

    const existing = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (existing) throw new BadRequestException('Email already registered');

    const user = await this.prisma.user.create({
      data: {
        email: body.email,
        passwordHash: await this.hashPassword(body.password),
        accountType: body.accountType ?? 'INDIVIDUAL',
        role: 'USER',
      },
    });
    await this.audit.log('USER_REGISTERED', { userId: user.id }, user.id);
    return {
      message: 'User successfully registered',
      user: {
        id: user.id,
        email: user.email,
        accountType: user.accountType,
        role: user.role,
        status: user.status,
      },
      tokens: this.signTokens(user),
    };
  }

  async login(body: LoginDto) {
    if (!body.password) throw new UnauthorizedException('Invalid credentials');

    const user = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !(await this.verifyPassword(body.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.audit.log('USER_LOGIN', { userId: user.id }, user.id);
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        accountType: user.accountType,
        role: user.role,
      },
      tokens: this.signTokens(user),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken) as JwtPayload;
      if (payload.type !== 'refresh') throw new UnauthorizedException('Invalid refresh token');

      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || user.status !== 'ACTIVE') throw new UnauthorizedException('Invalid refresh token');

      return {
        accessToken: this.jwt.sign({
          sub: user.id,
          email: user.email,
          role: user.role,
        } satisfies JwtPayload),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
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
      role: user.role,
      companyId: user.companyId,
      status: user.status,
    };
  }
}
