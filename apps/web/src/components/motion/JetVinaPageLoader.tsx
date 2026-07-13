'use client';

import { useEffect, useState } from 'react';

/** Full-page loader inspired by jetvina.com — gold plane + progress bar. */
export function JetVinaPageLoader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const t1 = window.setInterval(() => {
      setProgress((p) => (p >= 92 ? p : p + Math.random() * 14 + 4));
    }, 180);
    const done = () => {
      setProgress(100);
      window.setTimeout(() => setVisible(false), 320);
    };
    if (document.readyState === 'complete') {
      window.setTimeout(done, 480);
    } else {
      window.addEventListener('load', () => window.setTimeout(done, 280), { once: true });
      window.setTimeout(done, 2200);
    }
    return () => {
      window.clearInterval(t1);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="jb-page-loader" aria-busy="true" aria-live="polite">
      <div className="jb-page-loader__inner">
        <div className="jb-page-loader__mark">JETVINA</div>
        <svg className="jb-page-loader__plane" viewBox="0 0 64 64" aria-hidden>
          <path
            fill="currentColor"
            d="M62 30.5 38 28l-8-18h-4l6 18H16L8 22H5l5 10L5 42h3l8-6h16l-6 18h4l8-18 24-2.5z"
          />
        </svg>
        <div className="jb-page-loader__track">
          <div className="jb-page-loader__bar" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <p className="jb-page-loader__hint">Preparing your flight…</p>
      </div>
    </div>
  );
}
