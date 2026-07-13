/** Permission catalog — source of truth for RBAC strings. */
export const PERMISSIONS = [
  'booking.view',
  'booking.create',
  'booking.update',
  'booking.cancel',
  'quote.view',
  'quote.create',
  'pricing.estimate',
  'pricing.view_cost',
  'aircraft.view',
  'aircraft.view_location',
  'aircraft.update_location',
  'airport.view',
  'airport.manage',
  'empty_leg.view',
  'empty_leg.manage',
  'contract.view',
  'contract.create',
  'contract.submit_approval',
  'contract.approve',
  'contract.reject',
  'contract.request_changes',
  'contract.send_docusign',
  'permission.manage',
  'user.manage',
  'content_source.view',
  'content_source.manage',
  'content_sync.discover',
  'content_sync.preview',
  'content_sync.run',
  'content_sync.review',
  'content_sync.publish',
  'content_sync.rollback',
  'content_rights.view',
  'content_rights.approve',
  'content_media.view',
  'content_media.sync',
  'content_media.review',
  'content_media.approve',
  'content_media.approve_staging',
  'content_media.approve_production',
  'content_media.block',
  'content_rewrite.approve',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export function isPermission(value: string): value is Permission {
  return (PERMISSIONS as readonly string[]).includes(value);
}

/** ADMIN bypasses catalog checks. */
export const ADMIN_ROLE = 'ADMIN';
