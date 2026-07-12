import {
  BadRequestException,
  Controller,
  Post,
  Req,
  Res,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { Public } from '../auth/public.decorator';
import { DocuSignService } from '../integrations/docusign/docusign.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class DocuSignWebhookController {
  constructor(private readonly docusign: DocuSignService) {}

  @Public()
  @Post('docusign')
  @HttpCode(200)
  @ApiOperation({ summary: 'DocuSign Connect webhook (idempotent)' })
  async handle(@Req() req: Request & { rawBody?: Buffer }, @Res() res: Response) {
    const raw = req.rawBody ?? Buffer.from(JSON.stringify(req.body ?? {}));
    const signature =
      (req.headers['x-docusign-signature-1'] as string | undefined) ??
      (req.headers['x-docusign-signature'] as string | undefined);

    if (!this.docusign.verifyWebhookSignature(raw, signature)) {
      throw new BadRequestException('Invalid DocuSign webhook signature');
    }

    const result = await this.docusign.handleWebhook(
      (req.body ?? {}) as {
        eventId?: string;
        envelopeId?: string;
        event?: string;
        status?: string;
      },
    );
    return res.status(200).json(result);
  }
}
