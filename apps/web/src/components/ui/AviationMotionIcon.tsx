'use client';

import type { SVGProps } from 'react';

export type AviationIconName =
  | 'plane'
  | 'takeoff'
  | 'landing'
  | 'swapRoute'
  | 'calendar'
  | 'passengers'
  | 'plus'
  | 'minus'
  | 'addLeg'
  | 'shield'
  | 'concierge'
  | 'jetStar'
  | 'compass'
  | 'radar'
  | 'globeRoute'
  | 'searchFlight';

type MotionKind =
  | 'none'
  | 'float'
  | 'bob'
  | 'spin-slow'
  | 'pulse'
  | 'takeoff'
  | 'landing'
  | 'swap'
  | 'radar-sweep'
  | 'route-dash';

const SIZE = { xs: 14, sm: 16, md: 20, lg: 24, xl: 28 } as const;

type Props = {
  name: AviationIconName;
  size?: keyof typeof SIZE | number;
  motion?: MotionKind;
  className?: string;
  title?: string;
} & Omit<SVGProps<SVGSVGElement>, 'name' | 'width' | 'height'>;

/** Inline SVG aviation / travel icons with CSS motion hooks. */
export function AviationMotionIcon({
  name,
  size = 'md',
  motion = 'none',
  className,
  title,
  ...rest
}: Props) {
  const px = typeof size === 'number' ? size : SIZE[size];
  const motionClass = motion !== 'none' ? `jb-avi-icon--${motion}` : '';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      className={['jb-avi-icon', `jb-avi-icon--${name}`, motionClass, className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <IconGlyph name={name} />
    </svg>
  );
}

function IconGlyph({ name }: { name: AviationIconName }) {
  switch (name) {
    case 'plane':
      return (
        <g className="jb-avi-glyph" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
          <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" fill="currentColor" stroke="none" />
        </g>
      );
    case 'takeoff':
      return (
        <g stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M3 19h18" opacity="0.35" />
          <path className="jb-avi-plane-body" d="M3.5 15.5 8 14l5.5-7.5 2 .8-2.2 5.8 5.8 1.6.9 1.7-14.5 2.1z" fill="currentColor" stroke="none" />
          <path className="jb-avi-trail" d="M2 18c2-1 4-.8 6 0" opacity="0.55" />
        </g>
      );
    case 'landing':
      return (
        <g stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M3 19h18" opacity="0.35" />
          <path className="jb-avi-plane-body" d="M3.5 12.5 18.5 9l.9 1.7-5.8 1.6 1.6 5.5-2 .7L8 13.5l-4.5 1z" fill="currentColor" stroke="none" />
          <path className="jb-avi-trail" d="M16 17c2 .6 4 .4 6-.2" opacity="0.55" />
        </g>
      );
    case 'swapRoute':
      return (
        <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path className="jb-avi-swap-a" d="M7 8h11M14 5l4 3-4 3" />
          <path className="jb-avi-swap-b" d="M17 16H6M10 13l-4 3 4 3" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" opacity="0.7" />
        </g>
      );
    case 'calendar':
      return (
        <g stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <rect x="3.5" y="5" width="17" height="15" rx="2" />
          <path d="M8 3.5V7M16 3.5V7M3.5 10h17" />
          <path className="jb-avi-cal-plane" d="M9.5 16.5 12 15.5l4-1.1-4-.4-1-2.8-.9 2.7-3.6.5 3.6.5.9 2.6z" fill="currentColor" stroke="none" />
        </g>
      );
    case 'passengers':
      return (
        <g stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="9" cy="8" r="2.6" />
          <path d="M4.5 18.5c.4-2.6 2.4-4 4.5-4s4.1 1.4 4.5 4" />
          <circle cx="16.5" cy="9" r="2.1" opacity="0.85" />
          <path d="M14 18.5c.3-1.8 1.5-3 3-3 1.2 0 2.2.7 2.7 1.8" opacity="0.85" />
        </g>
      );
    case 'plus':
      return (
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 6v12M6 12h12" />
        </g>
      );
    case 'minus':
      return (
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 12h12" />
        </g>
      );
    case 'addLeg':
      return (
        <g stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="12" cy="12" r="8.5" opacity="0.4" />
          <path d="M12 8v8M8 12h8" />
          <path d="M16.5 7.2 18 6.5" opacity="0.6" />
        </g>
      );
    case 'shield':
      return (
        <g stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M12 3.5 19 6.2v5.3c0 4.4-3 7.5-7 8.8-4-1.3-7-4.4-7-8.8V6.2L12 3.5z" />
          <path className="jb-avi-check" d="M9.2 12.2 11.2 14l3.8-4" />
        </g>
      );
    case 'concierge':
      return (
        <g stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M5 14a7 7 0 0 1 14 0" />
          <path d="M5 14v2.5a1.5 1.5 0 0 0 1.5 1.5H9" />
          <path d="M19 14v2.5a1.5 1.5 0 0 1-1.5 1.5H15" />
          <circle cx="12" cy="18.5" r="1.2" fill="currentColor" stroke="none" />
          <path d="M12 7V5.5" />
          <circle cx="12" cy="4.2" r="0.8" fill="currentColor" stroke="none" />
        </g>
      );
    case 'jetStar':
      return (
        <g fill="currentColor">
          <path
            className="jb-avi-star"
            d="M12 3.2l1.7 4.2 4.6.4-3.5 3 1.1 4.4L12 13.6 8.1 15.2l1.1-4.4-3.5-3 4.6-.4L12 3.2z"
            opacity="0.95"
          />
        </g>
      );
    case 'compass':
      return (
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="12" cy="12" r="8.5" />
          <path className="jb-avi-compass-needle" d="M12 7.2 14.8 14 12 12.4 9.2 14z" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
        </g>
      );
    case 'radar':
      return (
        <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none">
          <circle cx="12" cy="12" r="8.2" opacity="0.35" />
          <circle cx="12" cy="12" r="5.2" opacity="0.45" />
          <circle cx="12" cy="12" r="2.2" opacity="0.55" />
          <path className="jb-avi-radar-sweep" d="M12 12 18.5 7.5" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </g>
      );
    case 'globeRoute':
      return (
        <g stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" fill="none">
          <circle cx="12" cy="12" r="8.2" />
          <path d="M4 12h16M12 4c2.4 2.2 3.6 5 3.6 8s-1.2 5.8-3.6 8c-2.4-2.2-3.6-5-3.6-8s1.2-5.8 3.6-8z" opacity="0.7" />
          <path className="jb-avi-route" d="M5.5 15.5c3-1 6.5-1.5 10.5-4.5" strokeDasharray="2 3" />
        </g>
      );
    case 'searchFlight':
      return (
        <g stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="10.5" cy="10.5" r="5.5" />
          <path d="M15 15l4.5 4.5" />
          <path className="jb-avi-plane-body" d="M8.2 11.8 10.2 11.2l2.8-.7-2.2-.2-.5-1.4-.5 1.3-2 .3 2 .3.5 1.3z" fill="currentColor" stroke="none" />
        </g>
      );
    default:
      return null;
  }
}
