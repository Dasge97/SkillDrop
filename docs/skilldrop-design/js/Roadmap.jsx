// Roadmap.jsx
function Roadmap() {
  const nav = useNav();
  return (
    <div>
      <PageHeader eyebrow={COURSE.title} title="Roadmap del curso"
        subtitle="13 fases que se desbloquean por dominio. Completa los retos de una fase para abrir la siguiente." />

      {/* legend */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(PHASE_STATUS).map((k) => <PhaseStatusBadge key={k} status={k} />)}
      </div>

      <div className="space-y-3">
        {PHASES.map((p) => {
          const locked = p.status === 'bloqueada';
          const done = p.status === 'completada';
          return (
            <Card key={p.n} as={locked ? 'div' : 'button'} onClick={locked ? undefined : () => nav.go('phase', { n: p.n })}
              className={cx('w-full text-left p-5 flex items-center gap-5 transition-all',
                locked ? 'opacity-60' : 'hover:shadow-soft-lg hover:border-brand-200 dark:hover:border-brand-500/40')}>
              {/* number / status circle */}
              <div className={cx('shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg',
                done ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                  : locked ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                  : 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400')}>
                {done ? <Icon name="check" className="w-6 h-6" /> : locked ? <Icon name="lock" className="w-5 h-5" /> : p.n}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500">FASE {p.n}</span>
                  <PhaseStatusBadge status={p.status} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{p.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{p.objetivo}</p>
                {!locked && p.progress > 0 && (
                  <div className="mt-3 max-w-md">
                    <ProgressBar value={p.progress} height="h-1.5" tone={done ? 'success' : 'brand'} />
                  </div>
                )}
              </div>

              {/* meta */}
              <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0 text-right">
                <div className="flex items-center gap-1.5 text-sm">
                  <Icon name="checkCircle" className={cx('w-4 h-4', gradeText(p.avg))} />
                  <span className={cx('font-semibold tabular-nums', gradeText(p.avg))}>{p.avg != null ? p.avg.toFixed(1) : '—'}</span>
                </div>
                <span className="text-xs text-slate-400">{p.retos} retos</span>
                {!locked && <Icon name="chevronRight" className="w-4 h-4 text-slate-300 dark:text-slate-600" />}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

window.Roadmap = Roadmap;
