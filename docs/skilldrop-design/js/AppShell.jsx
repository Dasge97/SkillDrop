// AppShell.jsx — Logo, ThemeToggle, Sidebar, AppLayout
function Logo({ compact = false }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-brand-600 text-white shadow-sm shadow-brand-600/30">
        <Icon name="bolt" className="w-5 h-5" fill="currentColor" strokeWidth={0} />
      </span>
      {!compact && <span className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-white">SkillDrop</span>}
    </span>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const opts = [{ v: 'light', icon: 'sun' }, { v: 'dark', icon: 'moon' }, { v: 'system', icon: 'monitor' }];
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5">
      {opts.map((o) => (
        <button key={o.v} onClick={() => setTheme(o.v)} title={o.v}
          className={cx('inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors',
            theme === o.v ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200')}>
          <Icon name={o.icon} className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { id: 'roadmap', label: 'Roadmap', icon: 'map' },
  { id: 'progress', label: 'Progreso', icon: 'progress' },
  { id: 'resources', label: 'Recursos', icon: 'book' },
  { id: 'mentor-queue', label: 'Revisión', icon: 'review', roles: ['MENTOR'] },
  { id: 'admin', label: 'Admin', icon: 'sliders', roles: ['ADMIN'] },
];
// which nav item should highlight for a given route
const ROUTE_GROUP = {
  dashboard: 'dashboard', roadmap: 'roadmap', phase: 'roadmap', lesson: 'roadmap',
  challenge: 'roadmap', submit: 'roadmap', submission: 'roadmap',
  progress: 'progress', resources: 'resources',
  'mentor-queue': 'mentor-queue', 'mentor-review': 'mentor-queue', admin: 'admin',
};

function SidebarContent({ onNavigate }) {
  const nav = useNav();
  const { user, role, setRole, logout } = useAuth();
  const active = ROUTE_GROUP[nav.route.name];
  const items = NAV_ITEMS.filter((i) => !i.roles || i.roles.includes(role));
  const go = (id) => { nav.go(id); onNavigate && onNavigate(); };
  return (
    <div className="flex flex-col h-full">
      {/* brand */}
      <div className="px-5 h-16 flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <Logo />
        <Mascot variant="guía" label="mini" className="ml-auto w-9 h-9 !py-1 !px-1 [&_span]:hidden" />
      </div>

      {/* nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map((it) => {
          const on = active === it.id;
          return (
            <button key={it.id} onClick={() => go(it.id)} data-active-nav={on || undefined}
              className={cx('w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                on ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                   : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70')}>
              <Icon name={it.icon} className="w-5 h-5 shrink-0" />
              {it.label}
              {it.roles && <Badge tone="outline" className="ml-auto !text-[10px] !px-1.5">{it.roles[0] === 'MENTOR' ? 'mentor' : 'admin'}</Badge>}
            </button>
          );
        })}
      </nav>

      {/* demo role switcher */}
      <div className="px-3 pb-2">
        <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-1 px-1">Ver como (demo)</label>
        <Select value={role} onChange={(e) => setRole(e.target.value)} className="!py-2 !text-xs">
          <option value="STUDENT">Alumno · STUDENT</option>
          <option value="MENTOR">Mentor · MENTOR</option>
          <option value="ADMIN">Admin · ADMIN</option>
        </Select>
      </div>

      {/* user block */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-3 shrink-0">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <Avatar name={user.name} size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" icon="logout" onClick={() => { logout(); nav.go('landing'); }}>Salir</Button>
        </div>
      </div>
    </div>
  );
}

function AppLayout({ children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="min-h-screen lg:flex">
      {/* desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[264px] shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 h-14 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur">
        <Logo />
        <button onClick={() => setOpen(true)} className="p-2 -mr-2 text-slate-600 dark:text-slate-300"><Icon name="menu" className="w-6 h-6" /></button>
      </div>

      {/* mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-slate-900 shadow-soft-lg animate-[slidein_.2s_ease]">
            <button onClick={() => setOpen(false)} className="absolute -right-3 top-4 z-10 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow"><Icon name="x" className="w-4 h-4" /></button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* main */}
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-8">{children}</div>
      </main>

      <style>{`@keyframes slidein{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>
    </div>
  );
}

/* Page header used inside app screens */
function PageHeader({ eyebrow, title, subtitle, actions, back }) {
  const nav = useNav();
  return (
    <div className="mb-7">
      {back && (
        <button onClick={() => nav.go(back.to, back.params)} className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 mb-3">
          <Icon name="arrowLeft" className="w-4 h-4" /> {back.label}
        </button>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400 mb-1.5">{eyebrow}</p>}
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">{title}</h1>
          {subtitle && <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

Object.assign(window, { Logo, ThemeToggle, SidebarContent, AppLayout, PageHeader, NAV_ITEMS, ROUTE_GROUP });
