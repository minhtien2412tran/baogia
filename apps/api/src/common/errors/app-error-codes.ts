/** Stable machine-readable codes for Web/Admin clients (JetBay báo giá scope). */
export const AppErrorCode = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  PRISMA_UNIQUE: 'PRISMA_UNIQUE',
  PRISMA_NOT_FOUND: 'PRISMA_NOT_FOUND',
  PRISMA_FOREIGN_KEY: 'PRISMA_FOREIGN_KEY',
} as const;

export type AppErrorCode = (typeof AppErrorCode)[keyof typeof AppErrorCode];

export type ApiErrorBody = {
  statusCode: number;
  code: AppErrorCode;
  message: string | string[];
  error: string;
  path?: string;
  timestamp: string;
  requestId?: string;
  details?: unknown;
};

export function statusToCode(status: number): AppErrorCode {
  switch (status) {
    case 400:
      return AppErrorCode.BAD_REQUEST;
    case 401:
      return AppErrorCode.UNAUTHORIZED;
    case 403:
      return AppErrorCode.FORBIDDEN;
    case 404:
      return AppErrorCode.NOT_FOUND;
    case 409:
      return AppErrorCode.CONFLICT;
    case 413:
      return AppErrorCode.PAYLOAD_TOO_LARGE;
    case 429:
      return AppErrorCode.TOO_MANY_REQUESTS;
    case 503:
      return AppErrorCode.SERVICE_UNAVAILABLE;
    default:
      return status >= 500
        ? AppErrorCode.INTERNAL_ERROR
        : AppErrorCode.BAD_REQUEST;
  }
}

export function httpErrorName(status: number): string {
  const names: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    413: 'Payload Too Large',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    503: 'Service Unavailable',
  };
  return names[status] ?? 'Error';
}
