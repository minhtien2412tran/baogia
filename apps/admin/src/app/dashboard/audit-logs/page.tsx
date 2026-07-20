'use client';

import { useCallback, useEffect, useState } from 'react';
import { scheduleUi } from '../../../lib/browser';
import { SectionTitle, DataTable, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { ActionBtn, fieldStyle } from '../../../components/AdminFormFields';
import { usePermissions } from '../../../components/PermissionContext';
import { adminApi } from '../../../lib/api';

const WORKFLOWS = [
  { id: '', label: 'All workflows' },
  { id: 'quotes', label: 'Quotes' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'payments', label: 'Payments' },
  { id: 'contracts', label: 'Contracts' },
  { id: 'users', label: 'Users' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'content', label: 'Content' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'airports', label: 'Airports' },
] as const;

type AuditRow = {
  id: number;
  action: string;
  workflow?: string;
  userEmail?: string | null;
  userId?: number | null;
  ipAddress?: string | null;
  createdAt?: string;
  details?: unknown;
};

export default function AuditLogsPage() {
  const { can } = usePermissions();
  const [workflow, setWorkflow] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    if (!can('audit.view')) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    adminApi
      .getAuditLogs({
        page,
        limit: 40,
        workflow: workflow || undefined,
        q: q.trim() || undefined,
      })
      .then((res) => {
        setRows((res.data ?? []) as AuditRow[]);
        setTotalPages(Number(res.pagination?.totalPages ?? 1));
        setTotal(Number(res.pagination?.total ?? 0));
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Load failed'))
      .finally(() => setLoading(false));
  }, [page, workflow, q, can]);

  useEffect(() => {
    scheduleUi(() => {
      void load();
    });
  }, [load]);

  if (!can('audit.view')) {
    return (
      <AdminShell active="/dashboard/audit-logs">
        <SectionTitle>Audit Logs</SectionTitle>
        <Muted>Requires audit.view</Muted>
      </AdminShell>
    );
  }

  return (
    <AdminShell active="/dashboard/audit-logs">
      <SectionTitle>Audit Logs</SectionTitle>
      <Muted>
        Trail of existing ops workflows (quote → offer → booking → payment → contract). Filter by
        domain.
      </Muted>

      <div className="jb-tabs" role="tablist">
        {WORKFLOWS.map((w) => (
          <button
            key={w.id || 'all'}
            type="button"
            role="tab"
            aria-selected={workflow === w.id}
            className={`jb-tabs__btn${workflow === w.id ? ' is-active' : ''}`}
            onClick={() => {
              setWorkflow(w.id);
              setPage(1);
            }}
          >
            {w.label}
          </button>
        ))}
      </div>

      <div className="jb-audit__toolbar">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search action / email / IP"
          style={{ ...fieldStyle, maxWidth: 320 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setPage(1);
              void load();
            }
          }}
        />
        <ActionBtn
          onClick={() => {
            setPage(1);
            void load();
          }}
        >
          Search
        </ActionBtn>
        <Muted>
          {total} events · page {page}/{totalPages || 1}
        </Muted>
      </div>

      {error ? <p style={{ color: '#fca5a5' }}>{error}</p> : null}
      {loading ? (
        <Muted>Loading audit logs…</Muted>
      ) : (
        <>
          <DataTable
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'workflow', label: 'Workflow' },
              { key: 'action', label: 'Action' },
              { key: 'user', label: 'User' },
              { key: 'ip', label: 'IP' },
              { key: 'created', label: 'When' },
              { key: 'detail', label: 'Detail' },
            ]}
            rows={rows.map((l) => ({
              id: String(l.id),
              workflow: l.workflow ?? '—',
              action: l.action,
              user: String(l.userEmail ?? l.userId ?? '—'),
              ip: String(l.ipAddress ?? '—'),
              created: l.createdAt ? String(l.createdAt).slice(0, 19).replace('T', ' ') : '—',
              detail: (
                <ActionBtn
                  onClick={() => setExpanded(expanded === l.id ? null : l.id)}
                >
                  {expanded === l.id ? 'Hide' : 'View'}
                </ActionBtn>
              ),
            }))}
          />
          {expanded != null ? (
            <pre className="jb-audit__detail">
              {JSON.stringify(
                rows.find((r) => r.id === expanded)?.details ?? {},
                null,
                2,
              )}
            </pre>
          ) : null}
          <div className="jb-audit__pager">
            <ActionBtn disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </ActionBtn>
            <ActionBtn
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </ActionBtn>
          </div>
        </>
      )}
    </AdminShell>
  );
}
