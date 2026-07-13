'use client';

import type { SVGProps } from 'react';

export type AppIconName =
  | 'menu'
  | 'close'
  | 'chevronDown'
  | 'chevronRight'
  | 'arrowLeft'
  | 'arrowRight'
  | 'arrowLeftRight'
  | 'search'
  | 'calendar'
  | 'clock'
  | 'users'
  | 'user'
  | 'mapPin'
  | 'plane'
  | 'planeTakeoff'
  | 'planeLanding'
  | 'phone'
  | 'mail'
  | 'globe'
  | 'currency'
  | 'shieldCheck'
  | 'badgeCheck'
  | 'fileSignature'
  | 'ban'
  | 'xCircle'
  | 'loader'
  | 'download'
  | 'upload'
  | 'edit'
  | 'trash'
  | 'eye'
  | 'filter'
  | 'sort'
  | 'check'
  | 'alert'
  | 'info'
  | 'plus'
  | 'minus';

export type AppIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_PX: Record<AppIconSize, number> = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const PATHS: Record<AppIconName, string> = {
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  chevronDown: 'M6 9l6 6 6-6',
  chevronRight: 'M9 6l6 6-6 6',
  arrowLeft: 'M15 6l-6 6 6 6M9 12h12',
  arrowRight: 'M9 6l6 6-6 6M3 12h12',
  arrowLeftRight: 'M7 8h14M17 4l4 4-4 4M17 16H3M7 12l-4 4 4 4',
  search: 'M11 11a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm7 7-4.2-4.2',
  calendar: 'M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  mapPin: 'M12 21s7-5.33 7-11a7 7 0 1 0-14 0c0 5.67 7 11 7 11zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  plane: 'M10 21l2-7 8-2-8-2-2-7-2 7-8 2 8 2 2 7z',
  planeTakeoff: 'M3 17l5-2 4-8 2 1-2 6 6 2 1 2-16 3v-4z',
  planeLanding: 'M3 8l16-3 1 2-6 2 2 6-2 1-4-8-5 2V8z',
  phone: 'M6 3h3l2 5-2 1a12 12 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z',
  mail: 'M4 6h16v12H4V6zm0 0l8 7 8-7',
  globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a16 16 0 0 1 0 20M12 2a16 16 0 0 0 0 20',
  currency: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  shieldCheck: 'M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3zm-2 10l2 2 4-4',
  badgeCheck: 'M9 12l2 2 4-4M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
  fileSignature: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6zM14 3v6h6M8 17h4M8 13h2m4 2c1 0 2-.5 2-1.5S15 12 14 12s-2 .5-2 1.5',
  ban: 'M4.9 4.9l14.2 14.2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
  xCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM15 9l-6 6M9 9l6 6',
  loader: 'M12 3v3M12 18v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M3 12h3M18 12h3M4.9 19.1l2.1-2.1M17 7l2.1-2.1',
  download: 'M12 4v12m0 0l-4-4m4 4l4-4M5 20h14',
  upload: 'M12 20V8m0 0l4 4m-4-4L8 12M5 4h14',
  edit: 'M4 20h4l10-10-4-4L4 16v4zm11-13l4 4',
  trash: 'M4 7h16M9 7V5h6v2m-8 0l1 12h8l1-12',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  filter: 'M4 5h16l-6 7v5l-4 2v-7L4 5z',
  sort: 'M8 6v12M8 18l-3-3M8 18l3-3M16 18V6m0 0l-3 3m3-3l3 3',
  check: 'M5 12l5 5L20 7',
  alert: 'M12 9v4m0 4h.01M10.3 4.3L2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-7v-4m0-4h.01',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
};

type Props = {
  name: AppIconName;
  size?: AppIconSize | number;
  strokeWidth?: number;
  className?: string;
  title?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
} & Omit<SVGProps<SVGSVGElement>, 'name' | 'width' | 'height'>;

export function AppIcon({
  name,
  size = 'md',
  strokeWidth = 1.75,
  className,
  title,
  'aria-hidden': ariaHidden,
  ...rest
}: Props) {
  const px = typeof size === 'number' ? size : SIZE_PX[size];
  const hidden = title ? false : ariaHidden !== false && ariaHidden !== 'false';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={['app-icon', className].filter(Boolean).join(' ')}
      aria-hidden={hidden ? true : undefined}
      role={title ? 'img' : undefined}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <path d={PATHS[name]} />
    </svg>
  );
}

export function iconSizePx(size: AppIconSize | number): number {
  return typeof size === 'number' ? size : SIZE_PX[size];
}
