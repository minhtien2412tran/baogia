import {
  Controller,
  Get,
  Post,
  Delete,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { StorageService } from '../services/storage.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { Public } from '../auth/public.decorator';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
]);

function toStorageKey(relativePath: string): string {
  const decoded = decodeURIComponent(relativePath);
  if (decoded.includes('..'))
    throw new BadRequestException('Invalid object key');
  const clean = decoded.replace(/^\/+/, '').replace(/\/+$/, '');
  if (!clean) throw new BadRequestException('Invalid object key');
  return clean.startsWith('media/') ? clean : `media/${clean}`;
}

/** NestJS 11 / path-to-regexp — wildcard param may be truncated; prefer full URL path. */
function objectKeyFromRequest(
  req: Request,
  routePrefix: '/media/' | '/admin/media/',
): string {
  const pathname = (req.originalUrl ?? req.url ?? '').split('?')[0];
  if (pathname.startsWith(routePrefix)) {
    return toStorageKey(decodeURIComponent(pathname.slice(routePrefix.length)));
  }

  const params = req.params as Record<string, string>;
  const fromParams = params['0'] ?? params['path'] ?? params['splat'];
  if (fromParams) return toStorageKey(fromParams);

  throw new BadRequestException('Invalid object key');
}

@ApiTags('Media')
@ApiSecurity('X-API-Key')
@Controller()
export class MediaController {
  constructor(private readonly storage: StorageService) {}

  @Get('admin/media')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'List uploaded media objects' })
  async listMedia() {
    const objects = await this.storage.list();
    return {
      configured: this.storage.isConfigured(),
      objects,
    };
  }

  @Post('admin/media/upload')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Upload a media file to MinIO' })
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }),
  )
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('file is required');
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      throw new BadRequestException(`Unsupported file type: ${file.mimetype}`);
    }
    const stored = await this.storage.upload(
      file.buffer,
      file.originalname,
      file.mimetype,
    );
    return { message: 'Uploaded', ...stored };
  }

  @Delete('admin/media/*')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Delete a media object' })
  async deleteMedia(@Req() req: Request) {
    const key = objectKeyFromRequest(req, '/admin/media/');
    await this.storage.delete(key);
    return { message: 'Deleted', key };
  }

  @Public()
  @Get('media/*')
  @ApiOperation({ summary: 'Serve a media file (MinIO or local UPLOAD_PATH)' })
  async serveMedia(@Req() req: Request, @Res() res: Response) {
    if (!this.storage.isConfigured())
      throw new NotFoundException('Media storage not configured');
    const key = objectKeyFromRequest(req, '/media/');
    try {
      const { stream, contentType, size } = await this.storage.getObject(key);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Length', String(size));
      res.setHeader('Cache-Control', 'public, max-age=86400');
      stream.pipe(res);
    } catch {
      throw new NotFoundException('File not found');
    }
  }
}
