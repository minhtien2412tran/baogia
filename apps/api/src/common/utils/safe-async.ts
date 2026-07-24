import { Logger } from '@nestjs/common';

const defaultLogger = new Logger('SafeAsync');

/**
 * Fire-and-forget with guaranteed rejection logging (no unhandledRejection).
 * Use for mail / notify side-effects that must not fail the HTTP response.
 */
export function fireAndForget(
  label: string,
  work: Promise<unknown>,
  logger: Logger = defaultLogger,
): void {
  void work.catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error(`[${label}] ${msg}`, err instanceof Error ? err.stack : undefined);
  });
}
