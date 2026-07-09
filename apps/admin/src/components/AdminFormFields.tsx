'use client';

import { colors } from '@j-ta/ui';

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
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} style={fieldStyle} required={required} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={fieldStyle} required={required} />
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
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer' }}>
            ✕
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
  onClick: () => void;
  variant?: 'ghost' | 'danger';
  disabled?: boolean;
}) {
  const color = variant === 'danger' ? '#f87171' : colors.link;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        background: 'none',
        border: 'none',
        color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 13,
        padding: '2px 6px',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}
