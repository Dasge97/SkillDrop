import type { ReactNode } from 'react';

// Set de iconos de línea (affordances de UI). Portado del diseño.
const ICONS: Record<string, ReactNode> = {
  home: (<><path d="M3 10.5L12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>),
  map: (<><path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3z" /><path d="M9 3v15" /><path d="M15 6v15" /></>),
  progress: (<><path d="M3 17l6-6 4 4 8-8" /><path d="M17 7h4v4" /></>),
  book: (<><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H20v15H6.5A1.5 1.5 0 0 0 5 19.5z" /><path d="M20 18v3H6.5A1.5 1.5 0 0 1 5 19.5" /></>),
  review: (<><path d="M9 11l3 3 7-7" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>),
  sliders: (<><path d="M4 6h9" /><path d="M17 6h3" /><circle cx="15" cy="6" r="2" /><path d="M4 12h3" /><path d="M11 12h9" /><circle cx="9" cy="12" r="2" /><path d="M4 18h9" /><path d="M17 18h3" /><circle cx="15" cy="18" r="2" /></>),
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></>),
  moon: (<><path d="M21 12.8A8 8 0 1 1 11.2 3a6 6 0 0 0 9.8 9.8z" /></>),
  monitor: (<><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>),
  logout: (<><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /></>),
  arrowRight: (<><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>),
  arrowLeft: (<><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></>),
  lock: (<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>),
  check: (<><path d="M5 13l4 4L19 7" /></>),
  checkCircle: (<><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  star: (<><path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 17.8 6.7 19.6l1.1-6L3.4 9.4l6-.8z" /></>),
  plus: (<><path d="M12 5v14M5 12h14" /></>),
  x: (<><path d="M6 6l12 12M18 6L6 18" /></>),
  chevronRight: (<><path d="M9 6l6 6-6 6" /></>),
  chevronDown: (<><path d="M6 9l6 6 6-6" /></>),
  menu: (<><path d="M4 6h16M4 12h16M4 18h16" /></>),
  idea: (<><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3z" /></>),
  trophy: (<><path d="M8 4h8v4a4 4 0 0 1-8 0z" /><path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3" /><path d="M12 12v3" /><path d="M9 20h6M10 15h4v5h-4z" /></>),
  flag: (<><path d="M5 21V4" /><path d="M5 4h11l-2 4 2 4H5" /></>),
  alert: (<><path d="M12 3l9 16H3z" /><path d="M12 10v4M12 17h.01" /></>),
  info: (<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>),
  link: (<><path d="M9 15l6-6" /><path d="M10.5 6.5l1-1a4 4 0 0 1 6 6l-1 1" /><path d="M13.5 17.5l-1 1a4 4 0 0 1-6-6l1-1" /></>),
  upload: (<><path d="M12 16V4" /><path d="M7 9l5-5 5 5" /><path d="M5 20h14" /></>),
  search: (<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></>),
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 20a8 8 0 0 1 16 0" /></>),
  users: (<><circle cx="9" cy="8" r="3.2" /><path d="M3 19a6 6 0 0 1 12 0" /><path d="M16 5.2a3.5 3.5 0 0 1 0 6.6" /><path d="M21 19a6 6 0 0 0-4.8-5.9" /></>),
  sparkles: (<><path d="M12 3l1.7 4 4 1.7-4 1.7L12 14.4l-1.7-4-4-1.7 4-1.7z" /><path d="M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" /></>),
  target: (<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /></>),
  layers: (<><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></>),
  grid: (<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>),
  flame: (<><path d="M12 3c.5 2.5-1 3.7-1 5.5 0 1 .6 1.8 1.5 1.8.6 0 1.1-.4 1.4-1 .9 1 1.4 2.3 1.4 3.5a5.3 5.3 0 0 1-10.6 0c0-2.6 1.9-4.4 2.2-6.8.8.6 1.6 1.3 1.9 2.4.7-1.3.6-3.4 1.8-5.4z" /></>),
  bolt: (<><path d="M13 3L4 14h7l-1 7 9-11h-7z" /></>),
  doc: (<><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /><path d="M9 13h6M9 17h6" /></>),
  video: (<><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3z" /></>),
  template: (<><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 9v12" /></>),
  tool: (<><path d="M14 7a4 4 0 0 0-5.5 5L3 17.5 6.5 21l5.5-5.5A4 4 0 0 0 17 10l-2.5 2.5L12 10l2.5-2.5z" /></>),
  pencil: (<><path d="M4 20l1-4L16 5l3 3L8 19z" /><path d="M14 7l3 3" /></>),
  image: (<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="M21 16l-5-5L5 20" /></>),
  filePlus: (<><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /><path d="M12 11v6M9 14h6" /></>),
  list: (<><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" /></>),
  inbox: (<><path d="M3 13l3-8h12l3 8v6H3z" /><path d="M3 13h5l1 2h6l1-2h5" /></>),
  award: (<><circle cx="12" cy="9" r="5" /><path d="M9 13.5L8 21l4-2 4 2-1-7.5" /></>),
  point: (<><circle cx="12" cy="12" r="9" /></>),
  hash: (<><path d="M5 9h14M5 15h14M9 4l-2 16M17 4l-2 16" /></>),
};

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  className = 'w-5 h-5',
  strokeWidth = 1.75,
  fill = 'none',
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
  fill?: string;
}) {
  const body = ICONS[name];
  if (!body) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {body}
    </svg>
  );
}
