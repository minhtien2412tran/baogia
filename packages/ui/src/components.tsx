import React from 'react';
import { colors, fonts, layout } from './tokens';

export function PageShell({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.text, fontFamily: fonts.sans }}>
      {title && (
        <title>{title}</title>
      )}
      <div style={{ maxWidth: layout.maxWidth, margin: '0 auto', padding: '24px 20px 48px' }}>
        {children}
      </div>
    </div>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      padding: 24,
      border: `1px solid ${colors.border}`,
      borderRadius: layout.cardRadius,
      background: colors.bgCard,
      ...style,
    }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ color: colors.accent, fontSize: 22, margin: '0 0 16px' }}>{children}</h2>;
}

export function Muted({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <p
      className={className}
      style={{ color: colors.textMuted, margin: '0 0 12px', lineHeight: 1.6, ...style }}
    >
      {children}
    </p>
  );
}

export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' }) {
  const bg = variant === 'success' ? 'rgba(74,222,128,0.15)' : variant === 'warning' ? 'rgba(241,217,154,0.15)' : 'rgba(138,180,255,0.15)';
  const color = variant === 'success' ? colors.success : variant === 'warning' ? colors.accent : colors.link;
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 999, fontSize: 12, background: bg, color }}>
      {children}
    </span>
  );
}

export function Button({ children, onClick, type = 'button', variant = 'primary', disabled }: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
}) {
  const isPrimary = variant === 'primary';
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: '10px 20px',
        borderRadius: 8,
        border: isPrimary ? 'none' : `1px solid ${colors.border}`,
        background: isPrimary ? colors.accent : 'transparent',
        color: isPrimary ? colors.bg : colors.text,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
}

export function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      {label && <span style={{ display: 'block', marginBottom: 4, fontSize: 13, color: colors.textMuted }}>{label}</span>}
      <input
        {...props}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 8,
          border: `1px solid ${colors.border}`,
          background: '#0d1a24',
          color: colors.text,
          fontSize: 15,
          boxSizing: 'border-box',
        }}
      />
    </label>
  );
}

export function DataTable({ columns, rows }: {
  columns: { key: string; label: string }[];
  rows: Record<string, React.ReactNode>[];
}) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ textAlign: 'left', padding: '10px 12px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: 24, textAlign: 'center', color: colors.textMuted }}>No data</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.key} style={{ padding: '10px 12px', borderBottom: `1px solid ${colors.border}` }}>{row[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SiteHeader({ locale = 'en' }: { locale?: string }) {
  const links = [
    { href: `/${locale}/fixed-price-charter`, label: 'Fixed Price' },
    { href: `/${locale}/empty-leg`, label: 'Empty Legs' },
    { href: `/${locale}/jet-card`, label: 'Jet Card' },
    { href: `/${locale}/news`, label: 'News' },
    { href: `/${locale}/login`, label: 'Login' },
  ];
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
      <a href={`/${locale}`} style={{ color: colors.accent, fontWeight: 700, fontSize: 20, textDecoration: 'none' }}>JetBay</a>
      <nav style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {links.map((l) => (
          <a key={l.href} href={l.href} style={{ color: colors.textMuted, textDecoration: 'none', fontSize: 14 }}>{l.label}</a>
        ))}
      </nav>
    </header>
  );
}

export function LoadingState() {
  return <p style={{ color: colors.textMuted }}>Loading...</p>;
}

export function ErrorState({ message }: { message: string }) {
  return <p style={{ color: colors.error }}>{message}</p>;
}
