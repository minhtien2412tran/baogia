import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { OperatorService } from '../services/operator.service';
import { EmailTemplateService } from '../services/email-template.service';

@ApiTags('Admin Operators')
@ApiSecurity('X-API-Key')
@Controller('admin/operators')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('bearer')
export class AdminOperatorController {
  constructor(private readonly operators: OperatorService) {}

  @Get()
  @ApiOperation({ summary: 'List operators (hãng)' })
  list() {
    return this.operators.list();
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.operators.get(id);
  }

  @Post()
  create(@Body() body: Record<string, string>) {
    return this.operators.create(body as never);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Record<string, string>,
  ) {
    return this.operators.update(id, body as never);
  }

  @Post(':id/users')
  attachUser(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      userId?: number;
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      role?: string;
    },
  ) {
    return this.operators.attachUser(id, body);
  }

  @Delete(':id/users/:userId')
  detach(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.operators.detachUser(id, userId);
  }
}

@ApiTags('Admin Email Templates')
@ApiSecurity('X-API-Key')
@Controller('admin/email-templates')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('bearer')
export class AdminEmailTemplateController {
  constructor(private readonly templates: EmailTemplateService) {}

  @Get()
  @ApiOperation({ summary: 'List editable email templates' })
  list() {
    return this.templates.list();
  }

  @Get(':key')
  get(
    @Param('key') key: string,
    @Body() _unused?: unknown,
  ) {
    return this.templates.get(key, 'en');
  }

  @Patch(':key')
  upsert(
    @Param('key') key: string,
    @Body()
    body: {
      locale?: string;
      subject: string;
      htmlBody: string;
      textBody?: string;
    },
    @CurrentUser() user: AuthUser,
  ) {
    return this.templates.upsert({ ...body, key }, user.userId);
  }
}
