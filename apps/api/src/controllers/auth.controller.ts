import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto, LoginDto, OAuthDto, RefreshTokenDto, OtpSendDto, OtpVerifyDto } from '../dto';
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
  @ApiOperation({ summary: 'Authenticate via Google ID token' })
  googleLogin(@Body() body: OAuthDto) {
    return this.authService.loginWithGoogle(body.token);
  }

  @Post('auth/oauth/apple')
  @ApiOperation({ summary: 'Authenticate via Apple identity token' })
  appleLogin(@Body() body: OAuthDto) {
    return this.authService.loginWithApple(body.token);
  }

  @Post('auth/otp/send')
  @Throttle({ auth: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Send SMS OTP for login or register' })
  sendOtp(@Body() body: OtpSendDto) {
    return this.authService.sendOtp(body.phone, body.purpose);
  }

  @Post('auth/otp/verify-login')
  @ApiOperation({ summary: 'Verify OTP and login (auto-register if new phone)' })
  verifyOtpLogin(@Body() body: OtpVerifyDto) {
    return this.authService.verifyOtpLogin(body.phone, body.code);
  }

  @Post('auth/otp/verify-register')
  @ApiOperation({ summary: 'Verify OTP and register new account' })
  verifyOtpRegister(@Body() body: OtpVerifyDto) {
    return this.authService.verifyOtpRegister(body.phone, body.code, body.email);
  }

  @Post('auth/logout')
  @ApiOperation({ summary: 'Revoke refresh token' })
  logout(@Body() body: RefreshTokenDto) {
    return this.authService.logout(body.refreshToken);
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
