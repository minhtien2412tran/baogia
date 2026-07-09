import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot() {
    return {
      name: 'J-TA API',
      status: 'ok',
      swagger: '/swagger',
      openapi: '/openapi.json',
      apiGateway: '/api-gateway',
      uiAudit: '/api-gateway/ui-audit',
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'jetbay-be',
      env: process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development',
      version: process.env.APP_VERSION ?? '1.0.0',
    };
  }
}
