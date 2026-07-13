import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

export type OAuthProfile = {
  provider: 'GOOGLE' | 'APPLE';
  subject: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

@Injectable()
export class OAuthService {
  private readonly logger = new Logger(OAuthService.name);
  private googleClient: OAuth2Client | null = null;
  private appleJwks = jwksClient({
    jwksUri: 'https://appleid.apple.com/auth/keys',
    cache: true,
    rateLimit: true,
  });

  private getGoogleClient(): OAuth2Client | null {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) return null;
    if (!this.googleClient) {
      this.googleClient = new OAuth2Client(clientId);
    }
    return this.googleClient;
  }

  async verifyGoogleToken(idToken: string): Promise<OAuthProfile> {
    const client = this.getGoogleClient();
    if (!client) {
      throw new BadRequestException({
        message:
          'Google OAuth is not configured. Set GOOGLE_CLIENT_ID in environment.',
        status: 'NOT_CONFIGURED',
      });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      throw new BadRequestException('Invalid Google token payload');
    }

    return {
      provider: 'GOOGLE',
      subject: payload.sub,
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
    };
  }

  async verifyAppleToken(identityToken: string): Promise<OAuthProfile> {
    const clientId = process.env.APPLE_CLIENT_ID;
    if (!clientId) {
      throw new BadRequestException({
        message:
          'Apple OAuth is not configured. Set APPLE_CLIENT_ID in environment.',
        status: 'NOT_CONFIGURED',
      });
    }

    const decoded = jwt.decode(identityToken, { complete: true });
    if (!decoded || typeof decoded === 'string' || !decoded.header.kid) {
      throw new BadRequestException('Invalid Apple identity token');
    }

    const key = await this.appleJwks.getSigningKey(decoded.header.kid);
    const signingKey = key.getPublicKey();
    const payload = jwt.verify(identityToken, signingKey, {
      algorithms: ['RS256'],
      issuer: 'https://appleid.apple.com',
      audience: clientId,
    }) as jwt.JwtPayload;

    if (!payload.sub) throw new BadRequestException('Invalid Apple token');

    const email = payload.email as string | undefined;
    if (!email) {
      throw new BadRequestException(
        'Apple account email not shared. Enable email scope.',
      );
    }

    return {
      provider: 'APPLE',
      subject: payload.sub,
      email,
    };
  }
}
