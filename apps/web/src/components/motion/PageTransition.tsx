'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/**
 * Soft fade + slide when navigating between locale routes.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [content, setContent] = useState(children);
  const prevPath = useRef(pathname);
  const pending = useRef(children);

  pending.current = children;

  useEffect(() => {
    if (pathname === prevPath.current) {
      setContent(children);
      return;
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      prevPath.current = pathname;
      setContent(pending.current);
      setVisible(true);
      return;
    }

    setVisible(false);
    const swap = setTimeout(() => {
      prevPath.current = pathname;
      setContent(pending.current);
      requestAnimationFrame(() => setVisible(true));
    }, 240);

    return () => clearTimeout(swap);
  }, [pathname, children]);

  return (
    <div className={`jb-page-transition${visible ? ' jb-page-transition--in' : ' jb-page-transition--out'}`}>
      {content}
    </div>
  );
}
