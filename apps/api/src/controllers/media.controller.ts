import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';
import { StorageService } from '../services/storage.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
]);

function toStorageKey(objectKey: string): string {
  const decoded = decodeURIComponent(objectKey);
  if (decoded.includes('..') || decoded.includes('/')) {
    throw new BadRequestException('Invalid object key');
  }
  return `media/${decoded}`;
}

@ApiTags('Media')
@Controller()
export class MediaController {
  constructor(private readonly storage: StorageService) {}

  @Get('admin/media')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Upload a media file to MinIO' })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('file is required');
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      throw new BadRequestException(`Unsupported file type: ${file.mimetype}`);
    }
    const stored = await this.storage.upload(file.buffer, file.originalname, file.mimetype);
    return { message: 'Uploaded', ...stored };
  }

  @Delete('admin/media/:objectKey')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a media object' })
  async deleteMedia(@Param('objectKey') objectKey: string) {
    const key = toStorageKey(objectKey);
    await this.storage.delete(key);
    return { message: 'Deleted', key };
  }

  @Get('media/:objectKey')
  @ApiOperation({ summary: 'Serve a media file from MinIO' })
  async serveMedia(@Param('objectKey') objectKey: string, @Res() res: Response) {
    if (!this.storage.isConfigured()) throw new NotFoundException('Media storage not configured');
    const key = toStorageKey(objectKey);
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
