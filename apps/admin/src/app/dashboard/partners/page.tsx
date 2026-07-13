'use client';

import { useCallback, useEffect, useState } from 'react';
import { scheduleUi } from '../../../lib/browser';
import { SectionTitle, DataTable, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { ConfirmDialog,  ActionBtn } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

export default function PartnersAdminPage() {
  const [rows, setRows] = useState<Record<string, React.ReactNode>[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [pendingReview, setPendingReview] = useState<{ id: number; status: 'APPROVED' | 'REJECTED' } | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .getPartnerApplications()
      .then((res) => {
        setRows(
          (res.applications as Record<string, unknown>[]).map((a) => {
            const id = Number(a.id);
            const status = String(a.status);
            const pending = status === 'PENDING';
            return {
              id: String(id),
              email: String(a.email),
              program: String(a.program),
              status,
              created: a.createdAt ? String(a.createdAt).slice(0, 10) : '—',
              actions: pending ? (
                <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <ActionBtn onClick={() => setPendingReview({ id: id, status: 'APPROVED' })}>Approve</ActionBtn>
                  <ActionBtn variant="danger" onClick={() => setPendingReview({ id: id, status: 'REJECTED' })}>
                    Reject
                  </ActionBtn>
                </span>
              ) : (
                '—'
              ),
            };
          }),
        );
      })
      .catch((e) => setMsg(e instanceof Error ? e.message : 'Load failed'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    scheduleUi(() => {
      void load();
    });
  }, [load]);

  async function review(id: number, status: 'APPROVED' | 'REJECTED') {
    try {
      await adminApi.reviewPartnerApplication(id, status);
      setMsg(`Application #${id} → ${status}`);
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Update failed');
    }
  }

  return (
    <AdminShell active="/dashboard/partners">
      <SectionTitle>Partner Applications</SectionTitle>
      {loading ? (
        <Muted>Loading applications…</Muted>
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'email', label: 'Email' },
            { key: 'program', label: 'Program' },
            { key: 'status', label: 'Status' },
            { key: 'created', label: 'Submitted' },
            { key: 'actions', label: 'Actions' },
          ]}
          rows={rows}
        />
      )}
      {msg && <p style={{ marginTop: 12, color: '#4ade80' }}>{msg}</p>}
          <ConfirmDialog
        open={pendingReview != null}
        title="Confirm review"
        message={pendingReview ? `Mark application #${pendingReview.id} as ${pendingReview.status}?` : ''}
        confirmLabel="Confirm"
        onCancel={() => setPendingReview(null)}
        onConfirm={() => {
          const p = pendingReview;
          setPendingReview(null);
          if (p) void review(p.id, p.status);
        }}
      />
    </AdminShell>
  );
}
