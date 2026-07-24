import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import {
  ApiErrorBody,
  AppErrorCode,
  httpErrorName,
  statusToCode,
} from '../errors/app-error-codes';

type MappedException = {
  status: number;
  code: AppErrorCode;
  message: string | string[];
  details?: unknown;
  logAsError: boolean;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      // WS / RPC: log only — gateway handles its own disconnects
      this.logger.error(
        `Non-HTTP exception: ${this.stringifyUnknown(exception)}`,
      );
      return;
    }

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const requestId = this.resolveRequestId(req);
    const mapped = this.mapException(exception);
    const isProd =
      process.env.APP_ENV === 'production' ||
      process.env.NODE_ENV === 'production';

    let message = mapped.message;
    if (isProd && mapped.status >= 500) {
      message = 'Internal server error';
    }

    const body: ApiErrorBody = {
      statusCode: mapped.status,
      code: mapped.code,
      message,
      error: httpErrorName(mapped.status),
      path: req.originalUrl ?? req.url,
      timestamp: new Date().toISOString(),
      requestId,
    };
    if (mapped.details !== undefined && !(isProd && mapped.status >= 500)) {
      body.details = mapped.details;
    }

    if (mapped.logAsError || mapped.status >= 500) {
      this.logger.error(
        `${req.method} ${body.path} → ${mapped.status} [${mapped.code}] rid=${requestId}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else if (mapped.status >= 400) {
      this.logger.warn(
        `${req.method} ${body.path} → ${mapped.status} [${mapped.code}] rid=${requestId} :: ${this.stringifyMessage(message)}`,
      );
    }

    res.setHeader('X-Request-Id', requestId);
    res.status(mapped.status).json(body);
  }

  private mapException(exception: unknown): MappedException {
    if (exception instanceof HttpException) {
      return this.mapHttpException(exception);
    }
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.mapPrisma(exception);
    }
    if (exception instanceof Prisma.PrismaClientValidationError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        code: AppErrorCode.VALIDATION_FAILED,
        message: 'Invalid database query input',
        logAsError: true,
      };
    }

    const raw =
      exception instanceof Error
        ? exception.message
        : this.stringifyUnknown(exception);

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: AppErrorCode.INTERNAL_ERROR,
      message: raw || 'Internal server error',
      logAsError: true,
    };
  }

  private mapHttpException(exception: HttpException): MappedException {
    const status = exception.getStatus();
    const payload = exception.getResponse();
    let message: string | string[] = exception.message;
    let details: unknown;
    let code = statusToCode(status);

    if (typeof payload === 'string') {
      message = payload;
    } else if (payload && typeof payload === 'object') {
      const obj = payload as Record<string, unknown>;
      if (typeof obj.message === 'string' || Array.isArray(obj.message)) {
        message = obj.message as string | string[];
      } else if (obj.message && typeof obj.message === 'object') {
        // e.g. ForbiddenException({ statusCode, message, required })
        message =
          typeof (obj.message as { message?: unknown }).message === 'string'
            ? ((obj.message as { message: string }).message)
            : exception.message;
        details = obj.message;
      }
      if (Array.isArray(obj.message)) {
        code = AppErrorCode.VALIDATION_FAILED;
      }
      if (typeof obj.code === 'string' && obj.code.trim()) {
        code = obj.code as AppErrorCode;
      }
      if (obj.required !== undefined) {
        details = { ...(typeof details === 'object' && details ? details : {}), required: obj.required };
      }
      if (obj.details !== undefined) {
        details = obj.details;
      }
    }

    return {
      status,
      code,
      message,
      details,
      logAsError: status >= 500,
    };
  }

  private mapPrisma(
    err: Prisma.PrismaClientKnownRequestError,
  ): MappedException {
    switch (err.code) {
      case 'P2002':
        return {
          status: HttpStatus.CONFLICT,
          code: AppErrorCode.PRISMA_UNIQUE,
          message: 'A record with this unique value already exists',
          details: { target: err.meta?.target },
          logAsError: false,
        };
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          code: AppErrorCode.PRISMA_NOT_FOUND,
          message: 'Record not found',
          logAsError: false,
        };
      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          code: AppErrorCode.PRISMA_FOREIGN_KEY,
          message: 'Related record is missing or still referenced',
          details: { field: err.meta?.field_name },
          logAsError: false,
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          code: AppErrorCode.INTERNAL_ERROR,
          message: `Database error (${err.code})`,
          logAsError: true,
        };
    }
  }

  private resolveRequestId(req: Request): string {
    const header = req.headers['x-request-id'];
    if (typeof header === 'string' && header.trim()) return header.trim().slice(0, 64);
    if (Array.isArray(header) && header[0]?.trim()) {
      return header[0].trim().slice(0, 64);
    }
    return randomUUID();
  }

  private stringifyMessage(message: string | string[]): string {
    return Array.isArray(message) ? message.join('; ') : message;
  }

  private stringifyUnknown(value: unknown): string {
    if (value instanceof Error) return value.message;
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
}
