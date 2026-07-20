import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import {
  RegisterDto,
  LoginDto,
  OAuthDto,
  RefreshTokenDto,
  OtpSendDto,
  OtpVerifyDto,
  UpdateProfileDto,
} from '../dto';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';

@ApiTags('Auth')
@ApiSecurity('X-API-Key')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/register')
  @Throttle({ auth: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('auth/login')
  @Throttle({ auth: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: 'Authenticate user with email and password' })
  @ApiResponse({ status: 200, description: 'Authentication successful.' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('auth/oauth/google')
  @Throttle({ auth: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: 'Authenticate via Google ID token' })
  googleLogin(@Body() body: OAuthDto) {
    return this.authService.loginWithGoogle(body.token);
  }

  @Post('auth/oauth/apple')
  @Throttle({ auth: { limit: 10, ttl: 60_000 } })
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
  @Throttle({ auth: { limit: 10, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Verify OTP and login (auto-register if new phone)',
  })
  verifyOtpLogin(@Body() body: OtpVerifyDto) {
    return this.authService.verifyOtpLogin(body.phone, body.code);
  }

  @Post('auth/otp/verify-register')
  @Throttle({ auth: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Verify OTP and register new account' })
  verifyOtpRegister(@Body() body: OtpVerifyDto) {
    return this.authService.verifyOtpRegister(
      body.phone,
      body.code,
      body.email,
    );
  }

  @Post('auth/logout')
  @Throttle({ auth: { limit: 20, ttl: 60_000 } })
  @ApiOperation({ summary: 'Revoke refresh token' })
  logout(@Body() body: RefreshTokenDto) {
    return this.authService.logout(body.refreshToken);
  }

  @Post('auth/refresh')
  @Throttle({ auth: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }

  @Get('me')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser() user: AuthUser) {
    return this.authService.getProfile(user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Update current user profile' })
  updateProfile(
    @Body() body: UpdateProfileDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.authService.updateProfile(user.userId, body);
  }

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  @ApiOperation({ summary: 'Upload current user avatar' })
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File | undefined,
    @CurrentUser() user: AuthUser,
  ) {
    if (!file) throw new BadRequestException('file is required');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      throw new BadRequestException('Avatar must be JPEG, PNG, or WebP');
    }
    return this.authService.updateAvatar(user.userId, file);
  }
}
