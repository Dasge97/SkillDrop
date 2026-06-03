// PhaseView.jsx
function lessonsForPhase(n) {
  if (n === 2) return LESSONS;
  const p = PHASES[n];
  const count = Math.min(p.retos, 5);
  const base = p.status === 'completada' ? 'completada' : 'disponible';
  return Array.from({ length: count }).map((_, i) => ({
    id: `l-${n}-${i + 1}`, phase: n, number: i + 1,
    title: `${p.skills[i % p.skills.length]} en la práctica`,
    objetivo: 'Aplica el concepto en un caso real y demuéstralo en el reto.',
    dif: 2 + (i % 3), time: `${25 + i * 5} min`,
    status: p.status === 'completada' ? 'completada' : (i === 0 && p.status !== 'bloqueada' ? base : (p.status === 'progreso' && i < 2 ? 'completada' : base)),
  }));
}

const LESSON_STATUS_META = {
  completada: { tone: 'success', icon: 'check', label: 'Completada' },
  progreso: { tone: 'warning', icon: 'pencil', label: 'En curso' },
  revision: { tone: 'primary', icon: 'clock', label: 'En revisión' },
  disponible: { tone: 'default', icon: 'arrowRight', label: 'Disponible' },
};

function PhaseView() {
  const nav = useNav();
  const n = nav.route.params.n ?? 2;
  const p = PHASES[n];
  const lessons = lessonsForPhase(n);

  return (
    <div>
      <PageHeader back={{ to: 'roadmap', label: 'Roadmap' }} eyebrow={`FASE ${p.n}`} title={p.title} subtitle={p.objetivo}
        actions={<PhaseStatusBadge status={p.status} />} />

      {/* header card */}
      <Card className="p-6 mb-6 grid sm:grid-cols-[1fr_auto] gap-5 items-center">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-500 dark:text-slate-400">Progreso de la fase</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{p.progress}%</span>
          </div>
          <ProgressBar value={p.progress} tone={p.status === 'completada' ? 'success' : 'brand'} className="mb-5" />
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Habilidades que desbloquea</p>
          <div className="flex flex-wrap gap-2">
            {p.skills.map((sk) => <Badge key={sk} tone="primary" icon="layers">{sk}</Badge>)}
          </div>
        </div>
        <Mascot variant="guía" label="guía (señalando)" className="w-28 h-28 hidden sm:flex" />
      </Card>

      <SectionTitle icon="book" title={`Lecciones (${lessons.length})`} />
      <div className="space-y-3">
        {lessons.map((l) => {
          const m = LESSON_STATUS_META[l.status] || LESSON_STATUS_META.disponible;
          return (
            <Card key={l.id} as="button" onClick={() => nav.go('lesson', { id: l.id })}
              className="w-full text-left p-4 flex items-center gap-4 hover:shadow-soft-lg hover:border-brand-200 dark:hover:border-brand-500/40 transition-all">
              <div className={cx('shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold',
                l.status === 'completada' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400')}>
                {l.status === 'completada' ? <Icon name="check" className="w-5 h-5" /> : l.number}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{l.title}</h3>
                  <Badge tone={m.tone} className="shrink-0">{m.label}</Badge>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{l.objetivo}</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 shrink-0 text-slate-400">
                <span className="flex items-center gap-1.5"><Stars value={l.dif} /></span>
                <span className="flex items-center gap-1 text-xs"><Icon name="clock" className="w-3.5 h-3.5" />{l.time}</span>
                <Icon name="chevronRight" className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

window.PhaseView = PhaseView;
