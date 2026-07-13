import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IntegrationsStatusService } from './services/integrations-status.service';
import { Public } from './auth/public.decorator';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly integrations: IntegrationsStatusService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'API root index',
    description:
      'Returns service name, status, and links to Swagger/OpenAPI/health. Public (no X-API-Key).',
  })
  getRoot() {
    return {
      name: 'JetVina API',
      status: 'ok',
      swagger: '/swagger',
      openapi: '/openapi.json',
      openapiYaml: '/openapi.yaml',
      health: '/health',
      integrations: '/integrations/status',
      apiGateway: '/api-gateway',
      uiAudit: '/api-gateway/ui-audit',
    };
  }

  @Public()
  @Get('health')
  @ApiOperation({
    summary: 'Liveness probe',
    description:
      'Lightweight health check for load balancers and deploy scripts. Public (no X-API-Key).',
  })
  getHealth() {
    return {
      status: 'ok',
      service: 'jetbay-be',
      env: process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development',
      version: process.env.APP_VERSION ?? '1.0.0',
    };
  }

  @Public()
  @Get('integrations/status')
  @ApiOperation({
    summary: 'Integration readiness flags',
    description:
      'Boolean readiness for JWT/DB/Redis and G4 integrations. Never returns secret values. Requires X-API-Key.',
  })
  getIntegrationsStatus() {
    return this.integrations.getStatus();
  }
}
