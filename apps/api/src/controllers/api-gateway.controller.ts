import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiGatewayService } from '../services/api-gateway.service';
import { Public } from '../auth/public.decorator';

@ApiTags('API Gateway')
@Controller('api-gateway')
export class ApiGatewayController {
  constructor(private readonly gateway: ApiGatewayService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'API gateway catalog — all public endpoints grouped by tag' })
  @ApiResponse({ status: 200, description: 'Endpoint catalog with links to Swagger and UI audit.' })
  getCatalog() {
    return this.gateway.getCatalog();
  }

  @Public()
  @Get('ui-audit')
  @ApiOperation({ summary: 'Audit matrix: web sample UI pages vs API endpoints' })
  @ApiResponse({
    status: 200,
    description: 'Per-page and per-endpoint coverage for the JETBAY sample web UI.',
  })
  getUiAudit() {
    return this.gateway.getUiAudit();
  }
}
