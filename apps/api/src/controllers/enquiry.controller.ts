import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { StorageService } from '../services/storage.service';

const ENQUIRY_FILE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const MAX_BYTES = 5 * 1024 * 1024;

@ApiTags('Enquiries')
@ApiSecurity('X-API-Key')
@Controller('enquiries')
export class EnquiryController {
  constructor(private readonly storage: StorageService) {}

  @Post('attachments')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an attachment for a sales enquiry (PDF/image, max 5MB)' })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_BYTES } }))
  async uploadAttachment(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('file is required');
    if (!ENQUIRY_FILE_TYPES.has(file.mimetype)) {
      throw new BadRequestException(`Unsupported file type: ${file.mimetype}`);
    }
    if (!this.storage.isConfigured()) {
      throw new BadRequestException('File storage is not configured on the server');
    }

    const stored = await this.storage.upload(
      file.buffer,
      file.originalname,
      file.mimetype,
      'enquiries',
    );
    return {
      message: 'Uploaded',
      filename: file.originalname,
      ...stored,
    };
  }
}
