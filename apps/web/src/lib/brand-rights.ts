export type BrandRightsStatus =
  | 'UNVERIFIED'
  | 'OWNED'
  | 'LICENSED'
  | 'CLIENT_PROVIDED'
  | 'PUBLIC_DOMAIN'
  | 'PROHIBITED';

const PUBLISHABLE = new Set<BrandRightsStatus>([
  'OWNED',
  'LICENSED',
  'CLIENT_PROVIDED',
  'PUBLIC_DOMAIN',
]);

export function canPublishBrandLogo(status: BrandRightsStatus | string): boolean {
  return PUBLISHABLE.has(status as BrandRightsStatus);
}
