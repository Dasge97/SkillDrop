// Dashboard.jsx
function StatCard({ icon, label, value, suffix, tone = 'brand' }) {
  const tones = { brand: 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/15', emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15', amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15', violet: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/15' };
  return (
    <Card className="p-5">
      <div className={cx('w-9 h-9 rounded-lg flex items-center justify-center mb-3', tones[tone])}><Icon name={icon} className="w-5 h-5" /></div>
      <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}<span className="text-base font-medium text-slate-400 ml-0.5">{suffix}</span></p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
    </Card>
  );
}

function Dashboard() {
  const nav = useNav();
  const { user } = useAuth();
  const s = STUDENT_STATS;
  const last = SUBMISSIONS[1]; // v2, requiere mejoras
  const firstName = user.name.split(' ')[0];

  return (
    <div>
      {/* Welcome banner */}
      <Card className="overflow-hidden mb-7">
        <div className="grid sm:grid-cols-[auto_1fr_auto] items-center gap-5 p-6">
          <Mascot variant="guía" label="guía (señalando)" className="w-24 h-24 hidden sm:flex" />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">¡Hola de nuevo, {firstName}! 👋</p>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">{COURSE.title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 italic">“{GUIDING_PHRASE}”</p>
          </div>
          <Button size="lg" iconRight="arrowRight" onClick={() => nav.go('phase', { n: s.posicion.fase })}>Continuar</Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard icon="progress" label="Progreso del curso" value={s.progress} suffix="%" tone="brand" />
        <StatCard icon="checkCircle" label="Nota media" value={s.avg.toFixed(1)} tone="emerald" />
        <StatCard icon="bolt" label="XP total" value={s.xp.toLocaleString('es')} tone="violet" />
        <StatCard icon="flame" label="Racha" value={s.streak} suffix=" días" tone="amber" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Posición actual */}
        <Card className="p-6">
          <SectionTitle icon="target" title="Tu posición actual" />
          <div className="flex items-center gap-2 mb-1">
            <Badge tone="primary">FASE {s.posicion.fase}</Badge>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{s.posicion.faseTitle}</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Lección actual: <span className="font-medium text-slate-700 dark:text-slate-300">{s.posicion.leccion}</span></p>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span>Progreso de la fase</span><span className="font-medium">{PHASES[2].progress}%</span>
          </div>
          <ProgressBar value={PHASES[2].progress} className="mb-5" />
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Próximo reto</p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">{s.posicion.proximoReto}</p>
            <Button size="sm" variant="soft" iconRight="arrowRight" onClick={() => nav.go('challenge', { id: CHALLENGE.id })}>Ir al reto</Button>
          </div>
        </Card>

        {/* Última evaluación */}
        <Card className="p-6">
          <SectionTitle icon="review" title="Última evaluación" action={<button onClick={() => nav.go('submission', { id: last.id })} className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline">Ver detalle</button>} />
          <div className="flex items-center gap-5">
            <div className="text-center shrink-0">
              <div className={cx('text-5xl font-extrabold tracking-tight tabular-nums', gradeText(last.eval.notaTotal))}>{last.eval.notaTotal.toFixed(1)}</div>
              <div className="text-xs text-slate-400 mt-0.5">/ 10</div>
            </div>
            <div className="min-w-0">
              <EvalStatusBadge status={last.eval.estado} />
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">{last.eval.feedback}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <Mascot variant="trabajando" label="trabajando (lápiz)" className="w-16 h-16 shrink-0" />
            <p className="text-sm text-slate-600 dark:text-slate-300">Estás a un retoque de aprobar. Aplica las mejoras obligatorias y reintenta.</p>
          </div>
        </Card>

        {/* Puntos fuertes */}
        <Card className="p-6">
          <SectionTitle icon="sparkles" title="Tus puntos fuertes" />
          <div className="flex flex-wrap gap-2">
            {s.fuertes.map((t) => <Badge key={t} tone="success" icon="check">{t}</Badge>)}
          </div>
        </Card>

        {/* A mejorar */}
        <Card className="p-6">
          <SectionTitle icon="flag" title="A mejorar" />
          <div className="flex flex-wrap gap-2">
            {s.mejorar.map((t) => <Badge key={t} tone="warning" icon="alert">{t}</Badge>)}
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard, StatCard });
