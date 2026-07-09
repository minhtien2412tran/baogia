'use client';

import { useState } from 'react';

export function FaqAccordion({ items }: { items: ReadonlyArray<{ q: string; a: string }> }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="jb-faq">
      {items.map((item, i) => (
        <div key={item.q} className={`jb-faq-item${open === i ? ' open' : ''}`}>
          <button
            type="button"
            className="jb-faq-trigger"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span>{item.q}</span>
            <span className="jb-faq-chevron" aria-hidden>{open === i ? '−' : '+'}</span>
          </button>
          {open === i && <div className="jb-faq-panel"><p>{item.a}</p></div>}
        </div>
      ))}
    </div>
  );
}
