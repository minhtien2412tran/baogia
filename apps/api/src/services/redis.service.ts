import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private connectPromise: Promise<void> | null = null;

  isConfigured(): boolean {
    return Boolean(process.env.REDIS_URL);
  }

  onModuleInit() {
    const url = process.env.REDIS_URL?.trim();
    if (!url) return;
    this.client = new Redis(url, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    });
    this.client.on('error', (err) =>
      this.logger.warn(`Redis error: ${err.message}`),
    );
    this.connectPromise = this.client.connect().catch((err) => {
      this.logger.warn(
        `Redis connect failed: ${err instanceof Error ? err.message : err}`,
      );
    });
  }

  private async ensureConnected(): Promise<Redis | null> {
    if (!this.client) return null;
    if (this.connectPromise) await this.connectPromise;
    return this.client;
  }

  async ping(): Promise<'ok' | 'error' | 'not_configured'> {
    const redis = await this.ensureConnected();
    if (!redis) return 'not_configured';
    try {
      const pong = await redis.ping();
      return pong === 'PONG' ? 'ok' : 'error';
    } catch (e) {
      this.logger.warn(
        `Redis ping failed: ${e instanceof Error ? e.message : e}`,
      );
      return 'error';
    }
  }

  async get(key: string): Promise<string | null> {
    const redis = await this.ensureConnected();
    if (!redis) return null;
    try {
      return await redis.get(key);
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const redis = await this.ensureConnected();
    if (!redis) return;
    try {
      if (ttlSeconds) await redis.set(key, value, 'EX', ttlSeconds);
      else await redis.set(key, value);
    } catch (e) {
      this.logger.warn(
        `Redis set failed: ${e instanceof Error ? e.message : e}`,
      );
    }
  }

  async del(key: string): Promise<void> {
    const redis = await this.ensureConnected();
    if (!redis) return;
    try {
      await redis.del(key);
    } catch {
      /* ignore */
    }
  }

  onModuleDestroy() {
    this.client?.disconnect();
  }
}
