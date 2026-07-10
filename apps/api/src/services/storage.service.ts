import { Injectable, Logger } from '@nestjs/common';
import * as Minio from 'minio';
import { randomUUID } from 'crypto';

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

  constructor() {
    const endpoint = process.env.MINIO_ENDPOINT?.trim();
    this.bucket = process.env.MINIO_BUCKET ?? 'jetbay-uploads';
    this.publicBase = (process.env.API_PUBLIC_URL ?? 'http://127.0.0.1:4000').replace(/\/$/, '');

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
    return this.client !== null;
  }

  async ping(): Promise<'ok' | 'error' | 'not_configured'> {
    if (!this.client) return 'not_configured';
    try {
      await this.client.bucketExists(this.bucket);
      return 'ok';
    } catch (e) {
      this.logger.warn(`MinIO ping failed: ${e instanceof Error ? e.message : e}`);
      return 'error';
    }
  }

  private async ensureBucket() {
    if (!this.client) throw new Error('MinIO is not configured');
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) await this.client.makeBucket(this.bucket, 'us-east-1');
  }

  buildPublicUrl(key: string): string {
    const objectKey = key.startsWith('media/') ? key.slice('media/'.length) : key;
    return `${this.publicBase}/media/${encodeURIComponent(objectKey)}`;
  }

  async upload(buffer: Buffer, originalName: string, contentType: string): Promise<StoredObject> {
    if (!this.client) throw new Error('MinIO is not configured. Set MINIO_ENDPOINT in environment.');
    await this.ensureBucket();

    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
    const key = `media/${Date.now()}-${randomUUID().slice(0, 8)}-${safeName}`;

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

  async list(prefix = 'media/'): Promise<StoredObject[]> {
    if (!this.client) return [];
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
          lastModified: obj.lastModified?.toISOString() ?? new Date().toISOString(),
        });
      });
      stream.on('error', reject);
      stream.on('end', () => resolve());
    });

    return items.sort((a, b) => b.lastModified.localeCompare(a.lastModified));
  }

  async getObject(key: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string; size: number }> {
    if (!this.client) throw new Error('MinIO is not configured');
    const stat = await this.client.statObject(this.bucket, key);
    const stream = await this.client.getObject(this.bucket, key);
    return {
      stream,
      contentType: stat.metaData?.['content-type'] ?? 'application/octet-stream',
      size: stat.size,
    };
  }

  async delete(key: string): Promise<void> {
    if (!this.client) throw new Error('MinIO is not configured');
    await this.client.removeObject(this.bucket, key);
  }
}
