'use client';

import { useEffect, useState } from 'react';
import { Card, SectionTitle, DataTable, Muted, colors } from '@jetbay/ui';
import { AdminShell } from '../../components/AdminShell';
import { adminApi } from '../../lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [quotes, setQuotes] = useState<unknown[]>([]);
  const [bookings, setBookings] = useState<unknown[]>([]);
  const [revenue, setRevenue] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setError(null);
    Promise.all([
      adminApi.getStats(),
      adminApi.getRecentQuotes(),
      adminApi.getRecentBookings(),
      adminApi.getRevenue(),
    ]).then(([s, q, b, r]) => { setStats(s); setQuotes(q); setBookings(b); setRevenue(r); })
      .catch((e) => setError(e instanceof Error ? e.message : 'Dashboard load failed'));
  }

  useEffect(() => { load(); }, []);

  return (
    <AdminShell active="/dashboard">
      <SectionTitle>Dashboard Overview</SectionTitle>
      {error && (
        <Card style={{ marginBottom: 16 }}>
          <p style={{ color: '#fca5a5' }}>{error}</p>
          <button type="button" onClick={load}>Retry</button>
        </Card>
      )}
      {stats ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          {Object.entries(stats).filter(([k]) => k !== 'generatedAt').map(([k, v]) => (
            <Card key={k}><div style={{ fontSize: 24, color: colors.accent }}>{v}</div><Muted>{k}</Muted></Card>
          ))}
        </div>
      ) : <Muted>Loading stats...</Muted>}
      {revenue && <Card style={{ marginBottom: 24 }}><strong>Revenue (demo):</strong> USD {Number(revenue.totalRevenue).toLocaleString()}</Card>}
      <SectionTitle>Recent Quotes</SectionTitle>
      <DataTable
        columns={[{ key: 'id', label: 'ID' }, { key: 'email', label: 'Email' }, { key: 'status', label: 'Status' }, { key: 'route', label: 'Route' }]}
        rows={(quotes as Record<string, React.ReactNode>[]).map((q) => ({ id: q.id, email: q.email, status: q.status, route: q.route ?? '—' }))}
      />
      {!quotes.length && <Muted>No recent quotes.</Muted>}
      <div style={{ marginTop: 24 }}>
        <SectionTitle>Recent Bookings</SectionTitle>
        <DataTable
          columns={[{ key: 'id', label: 'ID' }, { key: 'email', label: 'Email' }, { key: 'status', label: 'Status' }]}
          rows={(bookings as Record<string, React.ReactNode>[]).map((b) => ({ id: b.id, email: b.email, status: b.status }))}
        />
        {!bookings.length && <Muted>No recent bookings.</Muted>}
      </div>
    </AdminShell>
  );
}
