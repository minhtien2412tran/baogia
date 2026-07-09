'use client';

import { useRef } from 'react';
import { fieldStyle } from './AdminFormFields';

export function RichTextEditor({
  label,
  value,
  onChange,
  rows = 12,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function wrap(before: string, after: string) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, end + before.length);
    });
  }

  const btnStyle: React.CSSProperties = {
    padding: '4px 10px',
    marginRight: 6,
    marginBottom: 6,
    borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.15)',
    background: '#152535',
    color: '#f6efe2',
    cursor: 'pointer',
    fontSize: 13,
  };

  return (
    <label style={{ display: 'block', margin: '10px 0' }}>
      <span style={{ display: 'block', marginBottom: 4, fontSize: 13, opacity: 0.7 }}>{label}</span>
      <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap' }}>
        <button type="button" style={btnStyle} onClick={() => wrap('<strong>', '</strong>')}>
          Bold
        </button>
        <button type="button" style={btnStyle} onClick={() => wrap('<em>', '</em>')}>
          Italic
        </button>
        <button type="button" style={btnStyle} onClick={() => wrap('<h2>', '</h2>')}>
          H2
        </button>
        <button type="button" style={btnStyle} onClick={() => wrap('<p>', '</p>')}>
          Paragraph
        </button>
        <button type="button" style={btnStyle} onClick={() => wrap('<ul><li>', '</li></ul>')}>
          List
        </button>
        <button
          type="button"
          style={btnStyle}
          onClick={() => {
            const url = window.prompt('Link URL');
            if (url) wrap(`<a href="${url}">`, '</a>');
          }}
        >
          Link
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        style={{ ...fieldStyle, minHeight: rows * 22 }}
      />
    </label>
  );
}
