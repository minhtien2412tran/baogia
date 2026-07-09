import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IntegrationsStatusService } from './services/integrations-status.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly integrations: IntegrationsStatusService,
  ) {}

  @Get()
  getRoot() {
    return {
      name: 'J-TA API',
      status: 'ok',
      swagger: '/swagger',
      openapi: '/openapi.json',
      health: '/health',
      integrations: '/integrations/status',
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

  /** Public readiness of JWT/DB/Redis + which G4 integrations are configured (no secrets). */
  @Get('integrations/status')
  getIntegrationsStatus() {
    return this.integrations.getStatus();
  }
}
