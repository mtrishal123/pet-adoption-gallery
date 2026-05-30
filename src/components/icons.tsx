/**
 * Inline SVG icon components.
 *
 * Bundling icons as tiny components (rather than pulling in an icon library)
 * keeps the dependency footprint small and lets each icon inherit `currentColor`
 * so it adapts to the active theme automatically. All are marked
 * `aria-hidden` — callers provide accessible labels on the surrounding control.
 */
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...props,
});

export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const HeartIcon = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? 'currentColor' : 'none'}>
    <path d="M19.5 5.5a5 5 0 0 0-7.5.6 5 5 0 0 0-7.5-.6 5.2 5.2 0 0 0 0 7.4L12 20l7.5-7.1a5.2 5.2 0 0 0 0-7.4Z" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const DownloadIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
);

export const SunIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
  </svg>
);

export const MoonIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z" />
  </svg>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const PawIcon = (p: IconProps) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <ellipse cx="5.5" cy="12.5" rx="1.7" ry="2.3" />
    <ellipse cx="9.5" cy="8.5" rx="1.8" ry="2.4" />
    <ellipse cx="14.5" cy="8.5" rx="1.8" ry="2.4" />
    <ellipse cx="18.5" cy="12.5" rx="1.7" ry="2.3" />
    <path d="M12 12.5c-2.5 0-4.6 1.7-5.2 4-.4 1.6.8 3 2.4 3 .9 0 1.8-.4 2.8-.4s1.9.4 2.8.4c1.6 0 2.8-1.4 2.4-3-.6-2.3-2.7-4-5.2-4Z" />
  </svg>
);
