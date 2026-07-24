import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as Minio from 'minio';
import { randomUUID } from 'crypto';
import { createReadStream, promises as fs } from 'fs';
import * as path from 'path';

export type StoredObject = {
  key: string;
  url: string;
  size: number;
  contentType: string;
  lastModified: string;
};

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: Minio.Client | null;
  private readonly bucket: string;
  private readonly publicBase: string;
  private readonly localRoot: string | null;

  constructor() {
    const endpoint = process.env.MINIO_ENDPOINT?.trim();
    this.bucket = process.env.MINIO_BUCKET ?? 'jetbay-uploads';
    this.publicBase = (
      process.env.API_PUBLIC_URL ?? 'http://127.0.0.1:4000'
    ).replace(/\/$/, '');
    this.localRoot = process.env.UPLOAD_PATH?.trim() || null;

    if (endpoint) {
      this.client = new Minio.Client({
        endPoint: endpoint,
        port: Number(process.env.MINIO_PORT ?? 9000),
        useSSL: process.env.MINIO_USE_SSL === 'true',
        accessKey: process.env.MINIO_ACCESS_KEY ?? 'minio_admin',
        secretKey: process.env.MINIO_SECRET_KEY ?? 'minio_password',
      });
    } else {
      this.client = null;
    }
  }

  isConfigured(): boolean {
    return this.client !== null || this.localRoot !== null;
  }

  usesLocalDisk(): boolean {
    return !this.client && this.localRoot !== null;
  }

  async ping(): Promise<'ok' | 'error' | 'not_configured' | 'local'> {
    if (this.client) {
      try {
        await this.client.bucketExists(this.bucket);
        return 'ok';
      } catch (e) {
        this.logger.warn(
          `MinIO ping failed: ${e instanceof Error ? e.message : e}`,
        );
        return 'error';
      }
    }
    if (this.localRoot) {
      try {
        await fs.mkdir(this.localRoot, { recursive: true });
        return 'local';
      } catch {
        return 'error';
      }
    }
    return 'not_configured';
  }

  buildPublicUrl(key: string): string {
    const objectKey = key.startsWith('media/')
      ? key.slice('media/'.length)
      : key;
    const encoded = objectKey.split('/').map(encodeURIComponent).join('/');
    return `${this.publicBase}/media/${encoded}`;
  }

  private sanitizeName(originalName: string): string {
    return originalName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
  }

  private buildKey(folder: string, originalName: string): string {
    const safeName = this.sanitizeName(originalName);
    const prefix = folder
      .replace(/[^a-zA-Z0-9/_-]/g, '')
      .replace(/^\/+|\/+$/g, '');
    return `media/${prefix}/${Date.now()}-${randomUUID().slice(0, 8)}-${safeName}`;
  }

  private localPath(key: string): string {
    if (!this.localRoot) {
      throw new ServiceUnavailableException({
        code: 'SERVICE_UNAVAILABLE',
        message: 'Local upload path is not configured',
      });
    }
    return path.join(this.localRoot, key);
  }

  async upload(
    buffer: Buffer,
    originalName: string,
    contentType: string,
    folder = 'uploads',
  ): Promise<StoredObject> {
    const key = this.buildKey(folder, originalName);

    if (this.client) {
      await this.ensureBucket();
      await this.client.putObject(this.bucket, key, buffer, buffer.length, {
        'Content-Type': contentType,
      });
      return {
        key,
        url: this.buildPublicUrl(key),
        size: buffer.length,
        contentType,
        lastModified: new Date().toISOString(),
      };
    }

    if (this.localRoot) {
      const filePath = this.localPath(key);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, buffer);
      return {
        key,
        url: this.buildPublicUrl(key),
        size: buffer.length,
        contentType,
        lastModified: new Date().toISOString(),
      };
    }

    throw new ServiceUnavailableException({
      code: 'SERVICE_UNAVAILABLE',
      message: 'No storage configured. Set MINIO_ENDPOINT or UPLOAD_PATH.',
    });
  }

  async list(prefix = 'media/'): Promise<StoredObject[]> {
    if (this.client) {
      await this.ensureBucket();
      const items: StoredObject[] = [];
      const stream = this.client.listObjectsV2(this.bucket, prefix, true);

      await new Promise<void>((resolve, reject) => {
        stream.on('data', (obj) => {
          if (!obj.name || obj.size === undefined) return;
          items.push({
            key: obj.name,
            url: this.buildPublicUrl(obj.name),
            size: obj.size,
            contentType: 'application/octet-stream',
            lastModified:
              obj.lastModified?.toISOString() ?? new Date().toISOString(),
          });
        });
        stream.on('error', reject);
        stream.on('end', () => resolve());
      });

      return items.sort((a, b) => b.lastModified.localeCompare(a.lastModified));
    }

    if (this.localRoot) {
      const root = path.join(this.localRoot, prefix);
      const items: StoredObject[] = [];
      try {
        await this.walkLocal(root, prefix, items);
      } catch {
        return [];
      }
      return items.sort((a, b) => b.lastModified.localeCompare(a.lastModified));
    }

    return [];
  }

  private async walkLocal(
    dir: string,
    keyPrefix: string,
    items: StoredObject[],
  ): Promise<void> {
    let entries: import('node:fs').Dirent[];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      const key = `${keyPrefix}${entry.name}`.replace(/\\/g, '/');
      if (entry.isDirectory()) {
        await this.walkLocal(full, `${key}/`, items);
      } else if (entry.isFile()) {
        const stat = await fs.stat(full);
        items.push({
          key,
          url: this.buildPublicUrl(key),
          size: stat.size,
          contentType: 'application/octet-stream',
          lastModified: stat.mtime.toISOString(),
        });
      }
    }
  }

  async getObject(key: string): Promise<{
    stream: NodeJS.ReadableStream;
    contentType: string;
    size: number;
  }> {
    if (this.client) {
      const stat = await this.client.statObject(this.bucket, key);
      const stream = await this.client.getObject(this.bucket, key);
      return {
        stream,
        contentType: String(
          (stat.metaData as Record<string, string> | undefined)?.['content-type'] ??
            'application/octet-stream',
        ),
        size: Number(stat.size),
      };
    }

    if (this.localRoot) {
      const filePath = this.localPath(key);
      const stat = await fs.stat(filePath);
      return {
        stream: createReadStream(filePath),
        contentType: 'application/octet-stream',
        size: stat.size,
      };
    }

    throw new ServiceUnavailableException({
      code: 'SERVICE_UNAVAILABLE',
      message: 'Storage is not configured',
    });
  }

  async delete(key: string): Promise<void> {
    if (this.client) {
      await this.client.removeObject(this.bucket, key);
      return;
    }
    if (this.localRoot) {
      await fs.unlink(this.localPath(key));
      return;
    }
    throw new ServiceUnavailableException({
      code: 'SERVICE_UNAVAILABLE',
      message: 'Storage is not configured',
    });
  }

  private async ensureBucket() {
    if (!this.client) {
      throw new ServiceUnavailableException({
        code: 'SERVICE_UNAVAILABLE',
        message: 'MinIO is not configured',
      });
    }    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) await this.client.makeBucket(this.bucket, 'us-east-1');
  }
}
