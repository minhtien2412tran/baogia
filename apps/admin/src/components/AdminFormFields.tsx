'use client';

import { AppIcon } from './ui/AppIcon';
import { colors } from '@jetbay/ui';

export const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: 10,
  borderRadius: 8,
  background: '#0d1a24',
  color: '#f6efe2',
  border: '1px solid rgba(255,255,255,0.1)',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

export function AdminField({
  label,
  value,
  onChange,
  type = 'text',
  rows = 1,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label style={{ display: 'block', margin: '10px 0' }}>
      <span style={{ display: 'block', marginBottom: 4, fontSize: 13, opacity: 0.7 }}>{label}</span>
      {rows > 1 ? (
        <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={rows} style={fieldStyle} required={required} />
      ) : (
        <input type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} style={fieldStyle} required={required} />
      )}
    </label>
  );
}

export function AdminPanel({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div
      style={{
        marginBottom: 24,
        padding: 16,
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        background: colors.bgCard,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0, color: colors.accent }}>{title}</h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            style={{
              background: 'none',
              border: 'none',
              color: colors.textMuted,
              cursor: 'pointer',
              display: 'inline-flex',
              padding: 4,
            }}
          >
            <AppIcon name="close" size="sm" aria-hidden />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export function ActionBtn({
  children,
  onClick,
  variant = 'ghost',
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'ghost' | 'danger' | 'primary';
  disabled?: boolean;
}) {
  const bg =
    variant === 'danger' ? 'rgba(239,68,68,0.15)' : variant === 'primary' ? colors.accent : 'transparent';
  const color = variant === 'primary' ? '#0d1a24' : variant === 'danger' ? '#f87171' : colors.textMuted;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '4px 10px',
        borderRadius: 6,
        border: `1px solid ${colors.border}`,
        background: bg,
        color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 13,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

/** Accessible confirm dialog — replaces window.confirm for admin destructive actions. */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        style={{
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          padding: 20,
          maxWidth: 420,
          width: '100%',
        }}
      >
        <h3 id="confirm-dialog-title" style={{ margin: '0 0 8px', color: colors.accent }}>
          {title}
        </h3>
        <p style={{ margin: '0 0 16px', color: colors.textMuted }}>{message}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <ActionBtn onClick={onCancel}>Cancel</ActionBtn>
          <ActionBtn variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </ActionBtn>
        </div>
      </div>
    </div>
  );
}
