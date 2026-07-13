'use client';

import { useCallback, useEffect, useState } from 'react';
import { scheduleUi } from '../../../lib/browser';
import { SectionTitle, Muted, Button } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { AdminField, AdminPanel } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

type Effect = 'INHERIT' | 'ALLOW' | 'DENY';

export default function PermissionsPage() {
  const [catalog, setCatalog] = useState<string[]>([]);
  const [mine, setMine] = useState<string[]>([]);
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('2');
  const [ticks, setTicks] = useState<Record<string, Effect>>({});
  const [scopeCountry, setScopeCountry] = useState('VN');
  const [scopeType, setScopeType] = useState('COUNTRY');
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    Promise.all([
      adminApi.getPermissionCatalog().catch(() => ({ permissions: [] as string[] })),
      adminApi.getMyPermissions(),
    ])
      .then(([cat, me]) => {
        setCatalog(cat.permissions ?? []);
        setMine(me.permissions ?? []);
        setRole(me.role ?? '');
        const init: Record<string, Effect> = {};
        for (const p of cat.permissions ?? []) init[p] = 'INHERIT';
        setTicks(init);
      })
      .catch((e: Error) => setMsg(e.message));
  }, []);

  useEffect(() => {
    scheduleUi(() => {
      void load();
    });
  }, [load]);

  async function loadUser() {
    try {
      const d = await adminApi.getUserPermissionDetail(Number(userId));
      const next: Record<string, Effect> = {};
      for (const p of catalog) next[p] = 'INHERIT';
      for (const o of (d.overrides as Array<{ permission: string; effect: Effect }>) ?? []) {
        next[o.permission] = o.effect;
      }
      setTicks(next);
      const scopes = (d.scopes as Array<{ scopeType?: string; countryCode?: string }>) ?? [];
      if (scopes[0]?.countryCode) {
        setScopeType(scopes[0].scopeType ?? 'COUNTRY');
        setScopeCountry(scopes[0].countryCode);
      }
      setMsg(`Loaded user ${userId}`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Load failed');
    }
  }

  async function saveTicks() {
    try {
      const overrides = Object.entries(ticks)
        .filter(([, effect]) => effect !== 'INHERIT')
        .map(([permission, effect]) => ({ permission, effect }));
      await adminApi.setUserPermissionOverrides(Number(userId), overrides);
      setMsg(`Saved ${overrides.length} overrides for user ${userId}`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Save failed');
    }
  }

  async function saveScope() {
    try {
      if (scopeType === 'ALL') {
        await adminApi.setUserAirportScopes(Number(userId), [{ scopeType: 'ALL' }]);
      } else if (scopeType === 'NONE') {
        await adminApi.setUserAirportScopes(Number(userId), [{ scopeType: 'NONE' }]);
      } else {
        await adminApi.setUserAirportScopes(Number(userId), [
          { scopeType: 'COUNTRY', countryCode: scopeCountry },
        ]);
      }
      setMsg(`Saved airport scope ${scopeType} for user ${userId}`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Scope failed');
    }
  }

  return (
    <AdminShell active="/dashboard/permissions">
      <SectionTitle>Permissions & airport scope</SectionTitle>
      <Muted>
        Tick ALLOW / DENY / INHERIT per user. Resolution: DENY &gt; ALLOW &gt; ROLE. Your role:{' '}
        {role || '—'}.
      </Muted>
      {msg ? <p>{msg}</p> : null}

      <AdminPanel title="Effective permissions (me)">
        <Muted>{mine.length ? mine.join(', ') : 'None / admin bypass'}</Muted>
      </AdminPanel>

      <AdminPanel title="Edit user (tick options)">
        <AdminField label="User ID" value={userId} onChange={setUserId} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <Button type="button" onClick={loadUser}>
            Load user
          </Button>
          <Button type="button" onClick={saveTicks}>
            Save permission ticks
          </Button>
        </div>
        <div style={{ display: 'grid', gap: 8, maxHeight: 360, overflow: 'auto' }}>
          {catalog.map((p) => (
            <label key={p} style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 13 }}>
              <code style={{ minWidth: 200 }}>{p}</code>
              {(['INHERIT', 'ALLOW', 'DENY'] as Effect[]).map((eff) => (
                <span key={eff}>
                  <input
                    type="radio"
                    name={`perm-${p}`}
                    checked={ticks[p] === eff}
                    onChange={() => setTicks((t) => ({ ...t, [p]: eff }))}
                  />{' '}
                  {eff}
                </span>
              ))}
            </label>
          ))}
        </div>
      </AdminPanel>

      <AdminPanel title="Airport scope (what airports this user can see)">
        <label style={{ display: 'block', marginBottom: 8 }}>
          Scope type{' '}
          <select value={scopeType} onChange={(e) => setScopeType(e.target.value)}>
            <option value="ALL">ALL</option>
            <option value="COUNTRY">COUNTRY</option>
            <option value="NONE">NONE</option>
          </select>
        </label>
        {scopeType === 'COUNTRY' ? (
          <AdminField label="Country code" value={scopeCountry} onChange={setScopeCountry} />
        ) : null}
        <Button type="button" onClick={saveScope}>
          Save airport scope
        </Button>
        <Muted>
          Example: COUNTRY=VN → sales.vn only lists HAN/SGN/… when calling admin airports.
        </Muted>
      </AdminPanel>
    </AdminShell>
  );
}
