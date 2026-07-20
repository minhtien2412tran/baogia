import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createHash, randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';
import { CustomerCareService } from './customer-care/customer-care.service';
import { OAuthService, type OAuthProfile } from './oauth.service';
import { OtpService } from './otp.service';
import { LoginDto, RegisterDto, UpdateProfileDto } from '../dto';
import { StorageService } from './storage.service';
import type { JwtPayload } from '../auth/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly jwt: JwtService,
    private readonly oauth: OAuthService,
    private readonly otp: OtpService,
    private readonly customerCare: CustomerCareService,
    private readonly storage: StorageService,
  ) {}

  private hashRefreshToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private refreshSecret() {
    return (
      process.env.REFRESH_TOKEN_SECRET ??
      process.env.JWT_SECRET ??
      'dev-jetbay-secret-change-in-production'
    );
  }

  private async issueTokens(user: { id: number; email: string; role: string }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const refreshToken = this.jwt.sign(
      { sub: user.id, type: 'refresh', jti: randomUUID() },
      { secret: this.refreshSecret(), expiresIn: '30d' },
    );
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashRefreshToken(refreshToken),
        expiresAt,
      },
    });

    return {
      accessToken: this.jwt.sign(payload),
      refreshToken,
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

    const existing = await this.prisma.user.findUnique({
      where: { email: body.email },
    });
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
    void this.customerCare.onUserRegistered({
      userId: user.id,
      email: user.email,
      locale: body.locale,
    });
    return {
      message: 'User successfully registered',
      user: {
        id: user.id,
        publicId: user.publicId,
        email: user.email,
        accountType: user.accountType,
        role: user.role,
        status: user.status,
      },
      tokens: await this.issueTokens(user),
    };
  }

  async login(body: LoginDto) {
    if (!body.password) throw new UnauthorizedException('Invalid credentials');

    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });
    if (
      !user ||
      !(await this.verifyPassword(body.password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.audit.log('USER_LOGIN', { userId: user.id }, user.id);
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        publicId: user.publicId,
        email: user.email,
        accountType: user.accountType,
        role: user.role,
      },
      tokens: await this.issueTokens(user),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: this.refreshSecret(),
      });
      if (payload.type !== 'refresh')
        throw new UnauthorizedException('Invalid refresh token');

      const tokenHash = this.hashRefreshToken(refreshToken);
      const stored = await this.prisma.refreshToken.findUnique({
        where: { tokenHash },
      });
      if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user || user.status !== 'ACTIVE')
        throw new UnauthorizedException('Invalid refresh token');

      return {
        accessToken: this.jwt.sign({
          sub: user.id,
          email: user.email,
          role: user.role,
        } satisfies JwtPayload),
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    const tokenHash = this.hashRefreshToken(refreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { message: 'Logged out' };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    return {
      publicId: user.publicId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      whatsapp: user.whatsapp,
      zalo: user.zalo,
      address: user.address,
      city: user.city,
      country: user.country,
      preferredLocale: user.preferredLocale,
      facebookUrl: user.facebookUrl,
      instagramUrl: user.instagramUrl,
      linkedinUrl: user.linkedinUrl,
      accountType: user.accountType,
      role: user.role,
      companyId: user.companyId,
      status: user.status,
    };
  }

  async updateProfile(userId: number, body: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        whatsapp: body.whatsapp,
        zalo: body.zalo,
        address: body.address,
        city: body.city,
        country: body.country,
        preferredLocale: body.preferredLocale,
        facebookUrl: body.facebookUrl,
        instagramUrl: body.instagramUrl,
        linkedinUrl: body.linkedinUrl,
        accountType: body.accountType,
      },
    });
    await this.audit.log('USER_PROFILE_UPDATED', { fields: Object.keys(body) }, userId);
    return this.getProfile(user.id);
  }

  async updateAvatar(userId: number, file: Express.Multer.File) {
    const stored = await this.storage.upload(
      file.buffer,
      file.originalname,
      file.mimetype,
      `avatars/${userId}`,
    );
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: stored.url },
    });
    await this.audit.log('USER_AVATAR_UPDATED', { key: stored.key }, userId);
    return { ...this.getProfileResult(user), avatarUrl: stored.url };
  }

  private getProfileResult(user: {
    id: number;
    publicId: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    accountType: string;
    whatsapp: string | null;
    zalo: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    preferredLocale: string | null;
    facebookUrl: string | null;
    instagramUrl: string | null;
    linkedinUrl: string | null;
    role: string;
    companyId: number | null;
    status: string;
    avatarUrl: string | null;
  }) {
    return {
      publicId: user.publicId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      whatsapp: user.whatsapp,
      zalo: user.zalo,
      address: user.address,
      city: user.city,
      country: user.country,
      preferredLocale: user.preferredLocale,
      facebookUrl: user.facebookUrl,
      instagramUrl: user.instagramUrl,
      linkedinUrl: user.linkedinUrl,
      accountType: user.accountType,
      role: user.role,
      companyId: user.companyId,
      status: user.status,
    };
  }

  private async authResponse(user: {
    id: number;
    publicId: string;
    email: string;
    role: string;
    accountType: string;
  }) {
    return {
      message: 'Authentication successful',
      user: {
        id: user.id,
        publicId: user.publicId,
        email: user.email,
        accountType: user.accountType,
        role: user.role,
      },
      tokens: await this.issueTokens(user),
    };
  }

  async loginWithGoogle(idToken: string) {
    const profile = await this.oauth.verifyGoogleToken(idToken);
    return await this.loginWithOAuthProfile(profile);
  }

  async loginWithApple(identityToken: string) {
    const profile = await this.oauth.verifyAppleToken(identityToken);
    return await this.loginWithOAuthProfile(profile);
  }

  private async loginWithOAuthProfile(profile: OAuthProfile) {
    const existingProvider = await this.prisma.userAuthProvider.findUnique({
      where: { providerSubject: profile.subject },
      include: { user: true },
    });

    if (existingProvider) {
      await this.audit.log(
        'OAUTH_LOGIN',
        { provider: profile.provider },
        existingProvider.userId,
      );
      return await this.authResponse(existingProvider.user);
    }

    let user = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          accountType: 'INDIVIDUAL',
          role: 'USER',
        },
      });
      await this.audit.log(
        'USER_REGISTERED_OAUTH',
        { provider: profile.provider },
        user.id,
      );
      void this.customerCare.onUserRegistered({
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
      });
    }

    await this.prisma.userAuthProvider.create({
      data: {
        userId: user.id,
        provider: profile.provider,
        providerSubject: profile.subject,
        email: profile.email,
      },
    });

    await this.audit.log(
      'OAUTH_LOGIN',
      { provider: profile.provider },
      user.id,
    );
    return await this.authResponse(user);
  }

  async sendOtp(phone: string, purpose: 'LOGIN' | 'REGISTER') {
    return this.otp.sendOtp(phone, purpose);
  }

  async verifyOtpLogin(phone: string, code: string) {
    const { phone: normalized } = await this.otp.verifyOtp(
      phone,
      code,
      'LOGIN',
    );
    let user = await this.prisma.user.findFirst({
      where: { phone: normalized },
    });
    if (!user) {
      const email = `${normalized.replace(/\D/g, '')}@phone.jetbay.local`;
      user = await this.prisma.user.create({
        data: {
          email,
          phone: normalized,
          accountType: 'INDIVIDUAL',
          role: 'USER',
        },
      });
      await this.audit.log(
        'USER_REGISTERED_OTP',
        { phone: normalized },
        user.id,
      );
    }
    await this.audit.log('OTP_LOGIN', { phone: normalized }, user.id);
    return await this.authResponse(user);
  }

  async verifyOtpRegister(phone: string, code: string, email?: string) {
    const { phone: normalized } = await this.otp.verifyOtp(
      phone,
      code,
      'REGISTER',
    );
    const userEmail =
      email ?? `${normalized.replace(/\D/g, '')}@phone.jetbay.local`;

    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ phone: normalized }, { email: userEmail }] },
    });
    if (existing)
      throw new BadRequestException('Phone or email already registered');

    const user = await this.prisma.user.create({
      data: {
        email: userEmail,
        phone: normalized,
        accountType: 'INDIVIDUAL',
        role: 'USER',
      },
    });
    await this.audit.log('USER_REGISTERED_OTP', { phone: normalized }, user.id);
    void this.customerCare.onUserRegistered({
      userId: user.id,
      email: userEmail,
    });
    return {
      message: 'User successfully registered',
      user: {
        id: user.id,
        publicId: user.publicId,
        email: user.email,
        accountType: user.accountType,
        role: user.role,
        status: user.status,
      },
      tokens: await this.issueTokens(user),
    };
  }
}
