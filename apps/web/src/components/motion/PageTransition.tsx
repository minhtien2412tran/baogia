'use client';

import { usePathname } from 'next/navigation';

/**
 * Soft fade when navigating between locale routes (CSS keyframes on remount).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="jb-page-transition jb-page-transition--in">
      {children}
    </div>
  );
}
