'use client';

import { useEffect, useState } from 'react';
import { Card, SectionTitle, DataTable, Muted, colors } from '@jetbay/ui';
import { AdminShell } from '../../components/AdminShell';
import { ActionBtn } from '../../components/AdminFormFields';
import { adminApi } from '../../lib/api';
import {
  DEFAULT_DASHBOARD_WIDGETS,
  getDashboardWidgetOrder,
  reorderList,
  setDashboardWidgetOrder,
  type DashboardWidgetId,
} from '../../lib/adminPrefs';

const WIDGET_LABELS: Record<DashboardWidgetId, string> = {
  stats: 'Stats',
  revenue: 'Revenue demo',
  quotes: 'Recent quotes',
  bookings: 'Recent bookings',
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [quotes, setQuotes] = useState<unknown[]>([]);
  const [bookings, setBookings] = useState<unknown[]>([]);
  const [revenue, setRevenue] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<DashboardWidgetId[]>([
    ...DEFAULT_DASHBOARD_WIDGETS,
  ]);
  const [dragId, setDragId] = useState<DashboardWidgetId | null>(null);
  const [reorderMode, setReorderMode] = useState(false);

  function load() {
    setError(null);
    Promise.all([
      adminApi.getStats(),
      adminApi.getRecentQuotes(),
      adminApi.getRecentBookings(),
      adminApi.getRevenue(),
    ])
      .then(([s, q, b, r]) => {
        setStats(s);
        setQuotes(q);
        setBookings(b);
        setRevenue(r);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Dashboard load failed'));
  }

  useEffect(() => {
    setWidgets(getDashboardWidgetOrder());
    load();
  }, []);

  function onDrop(target: DashboardWidgetId) {
    if (!dragId || dragId === target || !reorderMode) return;
    const from = widgets.indexOf(dragId);
    const to = widgets.indexOf(target);
    if (from < 0 || to < 0) return;
    const next = reorderList(widgets, from, to);
    setWidgets(next);
    setDashboardWidgetOrder(next);
    setDragId(null);
  }

  function renderWidget(id: DashboardWidgetId) {
    if (id === 'stats') {
      return stats ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 12,
          }}
        >
          {Object.entries(stats)
            .filter(([k]) => k !== 'generatedAt')
            .map(([k, v]) => (
              <Card key={k}>
                <div style={{ fontSize: 24, color: colors.accent }}>{v}</div>
                <Muted>{k}</Muted>
              </Card>
            ))}
        </div>
      ) : (
        <Muted>Loading stats…</Muted>
      );
    }
    if (id === 'revenue') {
      return revenue ? (
        <Card>
          <strong>Revenue (demo):</strong> USD {Number(revenue.totalRevenue).toLocaleString()}
        </Card>
      ) : (
        <Muted>Loading revenue…</Muted>
      );
    }
    if (id === 'quotes') {
      return (
        <>
          <DataTable
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'email', label: 'Email' },
              { key: 'status', label: 'Status' },
              { key: 'route', label: 'Route' },
            ]}
            rows={(quotes as Record<string, React.ReactNode>[]).map((q) => ({
              id: (
                <a href={`/dashboard/quotes/${q.id}`} style={{ color: '#7dd3fc' }}>
                  {q.id as React.ReactNode}
                </a>
              ),
              email: q.email,
              status: q.status,
              route: q.route ?? '—',
            }))}
          />
          {!quotes.length && <Muted>No recent quotes.</Muted>}
        </>
      );
    }
    return (
      <>
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'email', label: 'Email' },
            { key: 'status', label: 'Status' },
          ]}
          rows={(bookings as Record<string, React.ReactNode>[]).map((b) => ({
            id: (
              <a href={`/dashboard/bookings/${b.id}`} style={{ color: '#7dd3fc' }}>
                {b.id as React.ReactNode}
              </a>
            ),
            email: b.email,
            status: b.status,
          }))}
        />
        {!bookings.length && <Muted>No recent bookings.</Muted>}
      </>
    );
  }

  return (
    <AdminShell active="/dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <SectionTitle>Dashboard Overview</SectionTitle>
        <ActionBtn onClick={() => setReorderMode((v) => !v)}>
          {reorderMode ? 'Done drag layout' : 'Drag widgets'}
        </ActionBtn>
      </div>
      {reorderMode ? (
        <Muted>Kéo thả các khối để đổi thứ tự — lưu trên trình duyệt này.</Muted>
      ) : null}
      {error && (
        <Card style={{ marginBottom: 16 }}>
          <p style={{ color: '#fca5a5' }}>{error}</p>
          <button type="button" onClick={load}>
            Retry
          </button>
        </Card>
      )}

      <div className="jb-dash-widgets">
        {widgets.map((id) => (
          <section
            key={id}
            className={`jb-dash-widget${reorderMode ? ' is-draggable' : ''}`}
            draggable={reorderMode}
            onDragStart={() => setDragId(id)}
            onDragOver={(e) => {
              if (reorderMode) e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              onDrop(id);
            }}
          >
            <header className="jb-dash-widget__head">
              <h3>
                {reorderMode ? '⋮⋮ ' : ''}
                {WIDGET_LABELS[id]}
              </h3>
            </header>
            {renderWidget(id)}
          </section>
        ))}
      </div>
    </AdminShell>
  );
}
