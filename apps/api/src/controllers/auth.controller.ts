import { Controller, Post, Get, Body, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto, LoginDto, OAuthDto, RefreshTokenDto } from '../dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  @Post('auth/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  register(@Body() body: RegisterDto) {
    return {
      message: 'User successfully registered',
      user: {
        id: 1,
        email: body.email,
        accountType: body.accountType ?? 'INDIVIDUAL',
        status: 'ACTIVE',
      },
      tokens: {
        accessToken: 'mock-access-token-xyz',
        refreshToken: 'mock-refresh-token-xyz',
      },
    };
  }

  @Post('auth/login')
  @ApiOperation({ summary: 'Authenticate user with email and password' })
  @ApiResponse({ status: 200, description: 'Authentication successful.' })
  login(@Body() body: LoginDto) {
    return {
      message: 'Login successful',
      user: {
        id: 1,
        email: body.email,
        accountType: 'INDIVIDUAL',
      },
      tokens: {
        accessToken: 'mock-access-token-xyz',
        refreshToken: 'mock-refresh-token-xyz',
      },
    };
  }

  @Post('auth/oauth/google')
  @ApiOperation({ summary: 'Authenticate via Google OAuth' })
  @ApiResponse({ status: 200, description: 'Google authentication successful.' })
  googleLogin(@Body() body: OAuthDto) {
    return {
      message: 'Google login successful',
      user: {
        id: 2,
        email: 'google.user@example.com',
        accountType: 'INDIVIDUAL',
      },
      tokens: {
        accessToken: 'mock-google-access-token-xyz',
        refreshToken: 'mock-google-refresh-token-xyz',
      },
    };
  }

  @Post('auth/oauth/apple')
  @ApiOperation({ summary: 'Authenticate via Apple OAuth' })
  @ApiResponse({ status: 200, description: 'Apple authentication successful.' })
  appleLogin(@Body() body: OAuthDto) {
    return {
      message: 'Apple login successful',
      user: {
        id: 3,
        email: 'apple.user@example.com',
        accountType: 'INDIVIDUAL',
      },
      tokens: {
        accessToken: 'mock-apple-access-token-xyz',
        refreshToken: 'mock-apple-refresh-token-xyz',
      },
    };
  }

  @Post('auth/refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully.' })
  refresh(@Body() body: RefreshTokenDto) {
    return {
      accessToken: 'mock-new-access-token-abc',
    };
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns profile details.' })
  getProfile(@Headers('authorization') authHeader: string) {
    return {
      id: 1,
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+84900000000',
      accountType: 'INDIVIDUAL',
      companyId: null,
      status: 'ACTIVE',
      roles: ['USER'],
      consents: [
        { subject: 'PRIVACY_POLICY', version: '1.0', acceptedAt: '2026-06-29T00:00:00Z' }
      ]
    };
  }
}
