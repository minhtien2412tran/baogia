'use client';

import { useEffect, useState } from 'react';
import { SectionTitle, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { adminApi } from '../../../lib/api';

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

export default function SettingsAdminPage() {
  const [health, setHealth] = useState<HealthPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '(not set)';

  useEffect(() => {
    adminApi
      .getHealth()
      .then((data) => setHealth(data as HealthPayload))
      .catch((e) => setError(e instanceof Error ? e.message : 'Unable to load health'))
      .finally(() => setLoading(false));
  }, []);

  const overall = statusTone(health?.status);
  const services = health?.services ?? {};

  return (
    <AdminShell active="/dashboard/settings">
      <div className="jb-settings">
        <header className="jb-settings__hero">
          <p className="jb-settings__eyebrow">Operations</p>
          <SectionTitle>System Settings</SectionTitle>
          <Muted>Runtime health for API, database, cache, and object storage.</Muted>
        </header>

        <section className="jb-settings__panel" aria-label="API connection">
          <div className="jb-settings__panel-head">
            <h3 className="jb-settings__panel-title">API endpoint</h3>
            <span className={`jb-settings__pill jb-settings__pill--${loading ? 'unknown' : error ? 'bad' : 'ok'}`}>
              {loading ? 'Checking' : error ? 'Unreachable' : 'Connected'}
            </span>
          </div>
          <code className="jb-settings__endpoint">{apiUrl}</code>
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
                  <div className="jb-settings__status-value">{String(health.status ?? 'unknown')}</div>
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
      </div>
    </AdminShell>
  );
}
