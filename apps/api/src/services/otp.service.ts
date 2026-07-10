import { BadRequestException, Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from './sms.service';

const OTP_TTL_MS = 5 * 60 * 1000;

@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sms: SmsService,
  ) {}

  private normalizePhone(phone: string): string {
    const cleaned = phone.replace(/\s+/g, '');
    if (!/^\+?[0-9]{8,15}$/.test(cleaned)) {
      throw new BadRequestException('Invalid phone number format');
    }
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  }

  private generateCode(): string {
    return String(randomInt(100000, 1000000));
  }

  async sendOtp(phone: string, purpose: 'LOGIN' | 'REGISTER') {
    const normalized = this.normalizePhone(phone);
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await this.prisma.otpCode.updateMany({
      where: { phone: normalized, purpose, usedAt: null },
      data: { usedAt: new Date() },
    });

    await this.prisma.otpCode.create({
      data: { phone: normalized, code, purpose, expiresAt },
    });

    const result = await this.sms.sendOtp(normalized, code);

    return {
      phone: normalized,
      purpose,
      expiresInSeconds: OTP_TTL_MS / 1000,
      sent: result.sent,
      ...(result.devCode ? { devCode: result.devCode, message: 'Dev mode: use devCode from response' } : {}),
    };
  }

  async verifyOtp(phone: string, code: string, purpose: 'LOGIN' | 'REGISTER') {
    const normalized = this.normalizePhone(phone);
    const record = await this.prisma.otpCode.findFirst({
      where: {
        phone: normalized,
        purpose,
        code,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestException('Invalid or expired OTP code');
    }

    await this.prisma.otpCode.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });

    return { phone: normalized, verified: true };
  }
}
