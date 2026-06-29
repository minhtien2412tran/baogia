import { Controller, Post, Get, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto, LoginDto, OAuthDto, RefreshTokenDto } from '../dto';
import { AuthService } from '../services/auth.service';

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
  @ApiOperation({ summary: 'Authenticate via Google OAuth' })
  googleLogin(@Body() body: OAuthDto) {
    return {
      message: 'Google login successful',
      user: { id: 2, email: 'google.user@example.com', accountType: 'INDIVIDUAL' },
      tokens: { accessToken: 'mock-google-access-token-xyz', refreshToken: 'mock-google-refresh-token-xyz' },
    };
  }

  @Post('auth/oauth/apple')
  @ApiOperation({ summary: 'Authenticate via Apple OAuth' })
  appleLogin(@Body() body: OAuthDto) {
    return {
      message: 'Apple login successful',
      user: { id: 3, email: 'apple.user@example.com', accountType: 'INDIVIDUAL' },
      tokens: { accessToken: 'mock-apple-access-token-xyz', refreshToken: 'mock-apple-refresh-token-xyz' },
    };
  }

  @Post('auth/refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@Body() body: RefreshTokenDto) {
    return { accessToken: 'mock-new-access-token-abc' };
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Headers('authorization') authHeader: string) {
    const userId = this.authService.resolveUserId(authHeader);
    return this.authService.getProfile(userId);
  }
}
