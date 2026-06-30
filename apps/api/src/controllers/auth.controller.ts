import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto, LoginDto, OAuthDto, RefreshTokenDto } from '../dto';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('auth/login')
  @ApiOperation({ summary: 'Authenticate user with email and password' })
  @ApiResponse({ status: 200, description: 'Authentication successful.' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('auth/oauth/google')
  @ApiOperation({ summary: 'Authenticate via Google OAuth (demo stub)' })
  googleLogin(@Body() _body: OAuthDto) {
    return {
      message: 'Google OAuth is not configured. Use email/password login.',
      status: 'NOT_CONFIGURED',
    };
  }

  @Post('auth/oauth/apple')
  @ApiOperation({ summary: 'Authenticate via Apple OAuth (demo stub)' })
  appleLogin(@Body() _body: OAuthDto) {
    return {
      message: 'Apple OAuth is not configured. Use email/password login.',
      status: 'NOT_CONFIGURED',
    };
  }

  @Post('auth/refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser() user: AuthUser) {
    return this.authService.getProfile(user.userId);
  }
}
