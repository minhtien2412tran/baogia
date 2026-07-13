'use client';

import { useRef } from 'react';
import { AppIcon } from './AppIcon';

type Props = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  min?: string;
};

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
        <button
          type="button"
          className="jb-date-trigger icon-btn"
          onClick={openPicker}
          aria-label={`${label} — open calendar`}
        >
          <AppIcon name="calendar" size="md" aria-hidden />
        </button>
      </div>
    </label>
  );
}
