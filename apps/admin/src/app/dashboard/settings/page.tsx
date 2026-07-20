'use client';

import { useEffect, useState } from 'react';
import { SectionTitle, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { ActionBtn, AdminField } from '../../../components/AdminFormFields';
import { usePermissions } from '../../../components/PermissionContext';
import { adminApi } from '../../../lib/api';
import { PLATFORM } from '../../../lib/platform';
import {
  DEFAULT_NAV_SECTIONS,
  NAV_SECTION_LABELS,
  setNavGroupOrder,
  setNavSectionToggles,
  setDashboardWidgetOrder,
  DEFAULT_DASHBOARD_WIDGETS,
  type NavSectionId,
  getNavSectionToggles,
  clearLegacyNavOrder,
} from '../../../lib/adminPrefs';
import { NAV_GROUPS } from '../../../lib/adminNav';

type HealthPayload = {
  status?: string;
  timestamp?: string;
  services?: Record<string, { status?: string; uptime?: number } | string>;
};

function statusTone(value: string | undefined): 'ok' | 'warn' | 'bad' | 'unknown' {
  const v = (value ?? '').toLowerCase();
  if (['ok', 'healthy', 'up', 'connected', 'ready'].includes(v)) return 'ok';
  if (['degraded', 'warn', 'warning', 'slow'].includes(v)) return 'warn';
  if (['error', 'down', 'fail', 'failed', 'unhealthy'].includes(v)) return 'bad';
  return 'unknown';
}

function formatUptime(seconds: number | undefined) {
  if (seconds == null || !Number.isFinite(seconds)) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

type Tab = 'health' | 'layout' | 'brand';

export default function SettingsAdminPage() {
  const { can } = usePermissions();
  const [tab, setTab] = useState<Tab>('health');
  const [health, setHealth] = useState<HealthPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sections, setSections] = useState(() => ({ ...DEFAULT_NAV_SECTIONS }));
  const [brand, setBrand] = useState<Record<string, string>>({});
  const [brandMsg, setBrandMsg] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '(not set)';

  useEffect(() => {
    setSections(getNavSectionToggles());
  }, []);

  useEffect(() => {
    adminApi
      .getHealth()
      .then((data) => setHealth(data as HealthPayload))
      .catch((e) => setError(e instanceof Error ? e.message : 'Unable to load health'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab !== 'brand' || !can('settings.manage')) return;
    adminApi
      .getBrandSettings()
      .then((data) => {
        const flat: Record<string, string> = {};
        for (const [k, v] of Object.entries(data)) {
          if (typeof v === 'string' || typeof v === 'number') flat[k] = String(v);
        }
        setBrand(flat);
      })
      .catch((e) => setBrandMsg(e instanceof Error ? e.message : 'Brand load failed'));
  }, [tab, can]);

  const overall = statusTone(health?.status);
  const services = health?.services ?? {};

  function toggleSection(id: NavSectionId) {
    const next = { ...sections, [id]: !sections[id] };
    setSections(next);
    setNavSectionToggles(next);
    window.dispatchEvent(new Event('jetvina-admin-prefs'));
  }

  function resetLayout() {
    clearLegacyNavOrder();
    setNavGroupOrder(NAV_GROUPS.map((g) => g.id));
    setDashboardWidgetOrder([...DEFAULT_DASHBOARD_WIDGETS]);
    setNavSectionToggles({ ...DEFAULT_NAV_SECTIONS });
    setSections({ ...DEFAULT_NAV_SECTIONS });
    window.dispatchEvent(new Event('jetvina-admin-prefs'));
  }

  async function saveBrand() {
    setBrandMsg('');
    try {
      await adminApi.patchBrandSettings(brand);
      setBrandMsg('Brand settings saved');
    } catch (e) {
      setBrandMsg(e instanceof Error ? e.message : 'Save failed');
    }
  }

  return (
    <AdminShell active="/dashboard/settings">
      <div className="jb-settings">
        <header className="jb-settings__hero">
          <p className="jb-settings__eyebrow">Operations</p>
          <SectionTitle>System Settings</SectionTitle>
          <Muted>Health, menu layout (drag in sidebar), brand, and section toggles.</Muted>
        </header>

        <div className="jb-tabs" role="tablist">
          {(
            [
              ['health', 'Health'],
              ['layout', 'Layout & tabs'],
              ['brand', 'Brand'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={`jb-tabs__btn${tab === id ? ' is-active' : ''}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'health' ? (
          <>
            <section className="jb-settings__panel" aria-label="API connection">
              <div className="jb-settings__panel-head">
                <h3 className="jb-settings__panel-title">API endpoint</h3>
                <span
                  className={`jb-settings__pill jb-settings__pill--${loading ? 'unknown' : error ? 'bad' : 'ok'}`}
                >
                  {loading ? 'Checking' : error ? 'Unreachable' : 'Connected'}
                </span>
              </div>
              <code className="jb-settings__endpoint">{apiUrl}</code>
              <ul style={{ marginTop: 12, paddingLeft: 18, lineHeight: 1.7, fontSize: 14 }}>
                <li>
                  Admin:{' '}
                  <a href={PLATFORM.admin} target="_blank" rel="noreferrer">
                    {PLATFORM.admin}
                  </a>
                </li>
                <li>
                  Web:{' '}
                  <a href={PLATFORM.web} target="_blank" rel="noreferrer">
                    {PLATFORM.web}
                  </a>
                </li>
                <li>
                  Swagger:{' '}
                  <a href={PLATFORM.docs} target="_blank" rel="noreferrer">
                    {PLATFORM.docs}
                  </a>
                </li>
              </ul>
            </section>

            {loading ? (
              <Muted>Loading health…</Muted>
            ) : error ? (
              <p className="jb-form-error">{error}</p>
            ) : health ? (
              <>
                <section className="jb-settings__overview" aria-label="Overall status">
                  <div className={`jb-settings__status jb-settings__status--${overall}`}>
                    <span className="jb-settings__status-dot" aria-hidden />
                    <div>
                      <div className="jb-settings__status-label">Platform</div>
                      <div className="jb-settings__status-value">
                        {String(health.status ?? 'unknown')}
                      </div>
                    </div>
                  </div>
                  {health.timestamp && (
                    <div className="jb-settings__meta">
                      <span className="jb-settings__meta-label">Checked</span>
                      <span className="jb-settings__meta-value">
                        {new Date(health.timestamp).toLocaleString()}
                      </span>
                    </div>
                  )}
                </section>

                <div className="jb-settings__grid">
                  {Object.entries(services).map(([name, raw]) => {
                    const svc = typeof raw === 'object' && raw ? raw : { status: String(raw) };
                    const tone = statusTone(svc.status);
                    const uptime = formatUptime(svc.uptime);
                    return (
                      <article key={name} className={`jb-settings__card jb-settings__card--${tone}`}>
                        <div className="jb-settings__card-top">
                          <h4 className="jb-settings__card-name">{name}</h4>
                          <span className={`jb-settings__pill jb-settings__pill--${tone}`}>
                            {String(svc.status ?? '—')}
                          </span>
                        </div>
                        {uptime && <p className="jb-settings__card-meta">Uptime {uptime}</p>}
                      </article>
                    );
                  })}
                </div>
              </>
            ) : (
              <Muted>Unable to load health status</Muted>
            )}
          </>
        ) : null}

        {tab === 'layout' ? (
          <section className="jb-settings__panel">
            <h3 className="jb-settings__panel-title">Menu section toggles</h3>
            <Muted>Hide whole nav groups. Reorder individual links via “Reorder menu” in the sidebar.</Muted>
            <div className="jb-settings__toggles">
              {(Object.keys(NAV_SECTION_LABELS) as NavSectionId[]).map((id) => (
                <label key={id} className="jb-settings__toggle">
                  <input
                    type="checkbox"
                    checked={sections[id] !== false}
                    onChange={() => toggleSection(id)}
                  />
                  <span>{NAV_SECTION_LABELS[id]}</span>
                </label>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <ActionBtn onClick={resetLayout}>Reset menu + dashboard layout</ActionBtn>
            </div>
          </section>
        ) : null}

        {tab === 'brand' ? (
          <section className="jb-settings__panel">
            {!can('settings.manage') ? (
              <Muted>Requires settings.manage to edit brand.</Muted>
            ) : (
              <>
                <Muted>Public brand fields used by web/admin.</Muted>
                {['brandName', 'logoPrimary', 'logoLight', 'logoDark', 'favicon', 'ogImage'].map(
                  (key) => (
                    <AdminField
                      key={key}
                      label={key}
                      value={brand[key] ?? ''}
                      onChange={(v) => setBrand((b) => ({ ...b, [key]: v }))}
                    />
                  ),
                )}
                <ActionBtn onClick={() => void saveBrand()}>Save brand</ActionBtn>
                {brandMsg ? <p>{brandMsg}</p> : null}
              </>
            )}
          </section>
        ) : null}
      </div>
    </AdminShell>
  );
}
