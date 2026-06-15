import { useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { Icon } from './icons';
import { Avatar, Badge, Button } from './ui';

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-brand-600 text-white shadow-sm shadow-brand-600/30">
        <Icon name="bolt" className="w-5 h-5" fill="currentColor" strokeWidth={0} />
      </span>
      {!compact && <span className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-white">SkillDrop</span>}
    </span>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const opts = [
    { v: 'light', icon: 'sun' },
    { v: 'dark', icon: 'moon' },
    { v: 'system', icon: 'monitor' },
  ] as const;
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5">
      {opts.map((o) => (
        <button
          key={o.v}
          onClick={() => setTheme(o.v)}
          title={o.v}
          aria-label={`Tema ${o.v}`}
          className={cn(
            'inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors',
            theme === o.v
              ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200',
          )}
        >
          <Icon name={o.icon} className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}

interface NavItem {
  to: string;
  label: string;
  icon: string;
  roles?: Array<'MENTOR' | 'ADMIN'>;
  group: string[];
}
const NAV: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: 'home', group: ['/dashboard'] },
  { to: '/courses', label: 'Cursos', icon: 'map', group: ['/courses', '/course', '/roadmap', '/phase', '/lesson', '/challenge', '/submit', '/submission'] },
  { to: '/progress', label: 'Progreso', icon: 'progress', group: ['/progress'] },
  { to: '/resources', label: 'Recursos', icon: 'book', group: ['/resources'] },
  { to: '/mentor', label: 'Revisión', icon: 'review', roles: ['MENTOR'], group: ['/mentor'] },
  { to: '/admin', label: 'Admin', icon: 'sliders', roles: ['ADMIN'], group: ['/admin'] },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMentor = user?.role === 'MENTOR' || user?.role === 'ADMIN';
  const isAdmin = user?.role === 'ADMIN';
  const items = NAV.filter((i) => !i.roles || (i.roles.includes('MENTOR') && isMentor) || (i.roles.includes('ADMIN') && isAdmin));

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 h-16 flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <Logo />
        <img src="/mascot/guide.png" alt="" className="ml-auto h-9 w-9 object-contain" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map((it) => {
          const on = it.group.some((g) => pathname === g || pathname.startsWith(g + '/'));
          return (
            <NavLink
              key={it.to}
              to={it.to}
              onClick={() => onNavigate?.()}
              className={cn(
                'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                on
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70',
              )}
            >
              <Icon name={it.icon} className="w-5 h-5 shrink-0" />
              {it.label}
              {it.roles && (
                <Badge tone="outline" className="ml-auto !text-[10px] !px-1.5">
                  {it.roles[0] === 'MENTOR' ? 'mentor' : 'admin'}
                </Badge>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 dark:border-slate-800 p-3 shrink-0">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <Avatar name={user?.name ?? ''} size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" icon="logout" onClick={() => { logout(); navigate('/login'); }}>
            Salir
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden lg:flex flex-col w-[264px] shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <div className="lg:hidden sticky top-0 z-30 h-14 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur">
        <Logo />
        <button onClick={() => setOpen(true)} className="p-2 -mr-2 text-slate-600 dark:text-slate-300" aria-label="Abrir menú">
          <Icon name="menu" className="w-6 h-6" />
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-slate-900 shadow-soft-lg animate-slidein">
            <button onClick={() => setOpen(false)} className="absolute -right-3 top-4 z-10 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow" aria-label="Cerrar menú">
              <Icon name="x" className="w-4 h-4" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-8">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  back,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  back?: { to: string; label: string };
}) {
  return (
    <div className="mb-7">
      {back && (
        <Link to={back.to} className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 mb-3">
          <Icon name="arrowLeft" className="w-4 h-4" /> {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400 mb-1.5">{eyebrow}</p>}
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
          {subtitle && <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
