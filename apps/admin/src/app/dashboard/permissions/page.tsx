'use client';

import { useCallback, useEffect, useState } from 'react';
import { SectionTitle, Muted, Button } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { AdminField, AdminPanel } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

export default function PermissionsPage() {
  const [catalog, setCatalog] = useState<string[]>([]);
  const [mine, setMine] = useState<string[]>([]);
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('2');
  const [detail, setDetail] = useState<string>('');
  const [denyPerm, setDenyPerm] = useState('booking.cancel');
  const [scopeCountry, setScopeCountry] = useState('VN');
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    Promise.all([adminApi.getPermissionCatalog().catch(() => ({ permissions: [] })), adminApi.getMyPermissions()])
      .then(([cat, me]) => {
        setCatalog(cat.permissions ?? []);
        setMine(me.permissions ?? []);
        setRole(me.role ?? '');
      })
      .catch((e: Error) => setMsg(e.message));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function loadUser() {
    try {
      const d = await adminApi.getUserPermissionDetail(Number(userId));
      setDetail(JSON.stringify(d, null, 2));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Load failed');
    }
  }

  async function applyDeny() {
    try {
      await adminApi.setUserPermissionOverrides(Number(userId), [
        { permission: denyPerm, effect: 'DENY' },
      ]);
      setMsg(`DENY ${denyPerm} on user ${userId}`);
      loadUser();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Override failed');
    }
  }

  async function applyCountryScope() {
    try {
      await adminApi.setUserAirportScopes(Number(userId), [
        { scopeType: 'COUNTRY', countryCode: scopeCountry },
      ]);
      setMsg(`Scope COUNTRY=${scopeCountry} on user ${userId}`);
      loadUser();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Scope failed');
    }
  }

  return (
    <AdminShell active="/dashboard/permissions">
      <SectionTitle>Permissions & airport scope</SectionTitle>
      <Muted>
        Resolution: DENY &gt; ALLOW &gt; ROLE inherit. Your role: {role || '—'}.
      </Muted>
      {msg ? <p>{msg}</p> : null}

      <AdminPanel title="Effective permissions (me)">
        <Muted>{mine.length ? mine.join(', ') : 'None / admin bypass'}</Muted>
      </AdminPanel>

      <AdminPanel title="Catalog">
        <Muted>{catalog.join(', ') || 'Load as ADMIN with permission.manage'}</Muted>
      </AdminPanel>

      <AdminPanel title="Edit user overrides / scope">
        <AdminField label="User ID" value={userId} onChange={setUserId} />
        <AdminField label="DENY permission" value={denyPerm} onChange={setDenyPerm} />
        <AdminField label="Country scope" value={scopeCountry} onChange={setScopeCountry} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          <Button type="button" onClick={loadUser}>
            Load user
          </Button>
          <Button type="button" onClick={applyDeny}>
            Apply DENY
          </Button>
          <Button type="button" onClick={applyCountryScope}>
            Set country scope
          </Button>
        </div>
        {detail ? (
          <pre style={{ marginTop: 12, fontSize: 12, overflow: 'auto' }}>{detail}</pre>
        ) : null}
      </AdminPanel>
    </AdminShell>
  );
}
