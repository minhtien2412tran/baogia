import { PermissionService } from './permission.service';
import type { PermissionKey } from '../constants/permissions';

describe('PermissionService defaults', () => {
  const svc = Object.create(PermissionService.prototype) as PermissionService;

  it('ADMIN inherits ALLOW for all keys', () => {
    const keys: PermissionKey[] = [
      'CANCEL_BOOKING',
      'CANCEL_QUOTE',
      'CANCEL_CONTRACT',
      'VOID_DOCUSIGN',
      'APPROVE_CONTRACT',
    ];
    for (const k of keys) {
      expect(svc.defaultAllowed('ADMIN', k)).toBe(true);
    }
  });

  it('USER may cancel booking by default but not approve/void', () => {
    expect(svc.defaultAllowed('USER', 'CANCEL_BOOKING')).toBe(true);
    expect(svc.defaultAllowed('USER', 'APPROVE_CONTRACT')).toBe(false);
    expect(svc.defaultAllowed('USER', 'VOID_DOCUSIGN')).toBe(false);
    expect(svc.defaultAllowed('USER', 'CANCEL_QUOTE')).toBe(false);
  });
});
