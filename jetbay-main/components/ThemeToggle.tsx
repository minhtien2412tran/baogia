'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setTimeout(() => setMounted(true), 0);
    }
    return () => { isMounted = false; };
  }, []);

  if (!mounted) {
    return (
      <button
        className="relative flex items-center justify-center w-10 h-10 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#152033] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1A263D] transition-colors shadow-sm"
        aria-label="Toggle theme"
      >
        <span className="w-[18px] h-[18px]" />
      </button>
    );
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      className="relative flex items-center justify-center w-10 h-10 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#152033] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1A263D] transition-colors shadow-sm"
      aria-label="Toggle theme"
    >
      <Sun size={18} className="absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon size={18} className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}
