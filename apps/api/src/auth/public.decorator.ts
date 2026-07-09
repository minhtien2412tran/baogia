import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Skip ApiKeyGuard (health, probes). JWT still applies if JwtAuthGuard is used. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
