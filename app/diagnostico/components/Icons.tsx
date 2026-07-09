type IconProps = { className?: string };

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function UserIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 2" />
    </svg>
  );
}

export function ActivityIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 12h3l2-6 4 12 2-6h5" />
    </svg>
  );
}

export function LeafIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 20c-1.2-5.6 1.6-11 9-13 3 5.4 2 12-4 14-2 .7-4-.2-5-1z" />
      <path d="M6 20c2-2.4 4.4-4.6 9-7" />
    </svg>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />
    </svg>
  );
}

export function HeartIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 20s-7-4.4-9.5-9C.9 7.5 2.6 4 6 4c2 0 3.5 1.2 6 4 2.5-2.8 4-4 6-4 3.4 0 5.1 3.5 3.5 7-2.5 4.6-9.5 9-9.5 9z" />
    </svg>
  );
}

export function AlertTriangleIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 4L2.5 20h19L12 4z" />
      <path d="M12 10.5v4.2" />
      <circle cx="12" cy="17.6" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SparklesIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
    </svg>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function DropletIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3s6 6.8 6 11a6 6 0 01-12 0c0-4.2 6-11 6-11z" />
    </svg>
  );
}

export function WineIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M7 3h10l-1 7a4 4 0 01-8 0L7 3z" />
      <path d="M12 14v7M8.5 21h7" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 010 1.415l-7.404 7.404a1 1 0 01-1.415 0L3.296 9.52a1 1 0 111.415-1.414l3.475 3.474 6.696-6.696a1 1 0 011.415 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function EnvelopeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.5 6.5L12 13l8.5-6.5" />
    </svg>
  );
}
