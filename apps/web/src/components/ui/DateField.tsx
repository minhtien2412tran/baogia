'use client';

import { useRef } from 'react';

type Props = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  min?: string;
};

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="currentColor">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z" />
    </svg>
  );
}

export function DateField({ id, label, value, onChange, required, min }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    const el = inputRef.current;
    if (!el) return;
    if (typeof el.showPicker === 'function') {
      el.showPicker();
    } else {
      el.focus();
    }
  }

  return (
    <label className="jb-field jb-field--date" htmlFor={id}>
      <span className="jb-field-label">{label}</span>
      <div className="jb-date-input-wrap">
        <input
          ref={inputRef}
          id={id}
          type="date"
          className="jb-date-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          min={min}
        />
        <button type="button" className="jb-date-trigger" onClick={openPicker} aria-label={`${label} — open calendar`}>
          <CalendarIcon />
        </button>
      </div>
    </label>
  );
}
