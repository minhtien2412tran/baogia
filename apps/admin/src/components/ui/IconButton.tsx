'use client';

import type { ButtonHTMLAttributes } from 'react';
import { AppIcon, type AppIconName, type AppIconSize } from './AppIcon';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  name: AppIconName;
  label: string;
  size?: AppIconSize | number;
  iconClassName?: string;
};

/** Icon-only control — `label` is required for accessibility (not title-only). */
export function IconButton({
  name,
  label,
  size = 'md',
  className,
  iconClassName,
  type = 'button',
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={['icon-btn', className].filter(Boolean).join(' ')}
      aria-label={label}
      {...rest}
    >
      <AppIcon name={name} size={size} className={iconClassName} aria-hidden />
    </button>
  );
}
