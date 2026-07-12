export const PERMISSION_KEYS = [
  'CANCEL_BOOKING',
  'CANCEL_QUOTE',
  'CANCEL_CONTRACT',
  'VOID_DOCUSIGN',
  'APPROVE_CONTRACT',
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const PERMISSION_EFFECTS = ['INHERIT', 'ALLOW', 'DENY'] as const;
export type PermissionEffect = (typeof PERMISSION_EFFECTS)[number];

export const OPEN_CONTRACT_STATUSES = [
  'DRAFT',
  'PENDING_APPROVAL',
  'APPROVED',
  'SENT',
] as const;
