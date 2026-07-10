import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../../controllers/auth.controller';
import { AuthService } from '../../services/auth.service';
import { OtpService } from '../../services/otp.service';
import { OAuthService } from '../../services/oauth.service';
import { JwtStrategy } from '../../auth/jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [AuthService, OtpService, OAuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
