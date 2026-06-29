// J-TA Clean-room Clone UI Route
import React from 'react';

export default function Page(props: any) {
  return (
    <div style={{
      padding: '40px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#f6efe2',
      background: '#071018',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '30px',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.03)'
      }}>
        <h1 style={{ color: '#f1d99a', marginBottom: '8px' }}>Manage Jet Cards</h1>
        <p style={{ color: '#b7b0a5', fontSize: '15px' }}>
          This is a clean-room UI skeleton page for the J-TA Admin Dashboard route:
        </p>
        <code style={{
          display: 'block',
          padding: '12px',
          background: '#000',
          borderRadius: '8px',
          color: '#8ab4ff',
          fontSize: '13px'
        }}>apps/admin/src/app/dashboard/jet-card/page.tsx</code>
      </div>
    </div>
  );
}
