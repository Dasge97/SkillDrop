import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { cn, initials } from '@/lib/utils';
import { Mascot } from './Mascot';
import { Badge, Button } from './ui';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  mentorOnly?: boolean;
}

const NAV: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/roadmap', label: 'Roadmap', icon: '🗺️' },
  { to: '/progress', label: 'Progreso', icon: '📈' },
  { to: '/resources', label: 'Recursos', icon: '📚' },
  { to: '/mentor', label: 'Revisión', icon: '🧑‍🏫', mentorOnly: true },
];

function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  return (
    <Button variant="ghost" size="sm" onClick={toggle} title="Cambiar tema" aria-label="Cambiar tema">
      {resolved === 'dark' ? '🌙' : '☀️'}
    </Button>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isMentor = user?.role === 'MENTOR' || user?.role === 'ADMIN';
  const items = NAV.filter((n) => !n.mentorOnly || isMentor);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-card transition-transform md:static md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center gap-2 px-5">
          <Mascot variant="login" className="h-9 w-9" />
          <span className="text-lg font-extrabold tracking-tight">SkillDrop</span>
        </div>
        <nav className="space-y-1 px-3 py-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
              {item.mentorOnly && <Badge tone="primary" className="ml-auto">Mentor</Badge>}
            </NavLink>
          ))}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {user ? initials(user.name) : '–'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Salir
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay móvil */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Contenido */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-border bg-card/60 px-4 backdrop-blur md:hidden">
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            ☰
          </Button>
          <Mascot variant="login" className="h-7 w-7" />
          <span className="font-bold">SkillDrop</span>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
