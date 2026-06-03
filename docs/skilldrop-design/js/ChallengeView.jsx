// ChallengeView.jsx
function ListCard({ icon, title, items, tone = 'default', ordered }) {
  return (
    <Card className="p-5">
      <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-3">
        <Icon name={icon} className={cx('w-5 h-5', tone === 'danger' ? 'text-red-500' : 'text-brand-600 dark:text-brand-400')} />{title}
      </h3>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <span className={cx('mt-1.5 w-1.5 h-1.5 rounded-full shrink-0', tone === 'danger' ? 'bg-red-400' : 'bg-brand-400')} />
            {it}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ChallengeView() {
  const nav = useNav();
  const c = CHALLENGE;
  const subs = SUBMISSIONS;

  return (
    <div>
      <PageHeader back={{ to: 'lesson', label: 'Lección', params: { id: c.lessonId } }} />

      {/* Hero */}
      <Card className="p-6 mb-6 grid sm:grid-cols-[auto_1fr_auto] gap-5 items-center">
        <Mascot variant="trabajando" label="trabajando (lápiz)" className="w-24 h-24 hidden sm:flex" />
        <div>
          <Badge tone="primary" icon="target" className="mb-2">Reto práctico · FASE {c.phase}</Badge>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">{c.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">Dificultad <Stars value={c.dif} className="w-4 h-4" /></span>
            <Badge tone="default" icon="clock">{c.time}</Badge>
          </div>
        </div>
        <Button size="lg" icon="upload" onClick={() => nav.go('submit', { id: c.id })}>Entregar trabajo</Button>
      </Card>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-6">
          {/* Brief */}
          <Card className="p-6 space-y-5">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400 mb-1.5">Brief</h2>
              <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">{c.brief}</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 pt-1">
              {[['Contexto', c.contexto], ['Objetivo', c.objetivo], ['Usuario objetivo', c.usuario]].map(([t, d]) => (
                <div key={t}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">{t}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 4 cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <ListCard icon="lock" title="Restricciones" items={c.restricciones} />
            <ListCard icon="inbox" title="Entregables" items={c.entregables} />
            <ListCard icon="checkCircle" title="Checklist antes de entregar" items={c.checklist} />
            <ListCard icon="alert" title="Errores comunes" items={c.errores} tone="danger" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5 lg:sticky lg:top-8">
          {/* Criterios */}
          <Card className="p-5">
            <SectionTitle icon="review" title="Criterios de evaluación" className="!mb-3" />
            <div className="space-y-3">
              {c.criterios.map((cr) => (
                <div key={cr.name} className="border-b border-slate-100 dark:border-slate-800 last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{cr.name}</p>
                    {cr.critico && <Badge tone="danger" className="!text-[10px] !px-1.5">crítico</Badge>}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{cr.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg bg-brand-50/60 dark:bg-brand-500/10 p-3 flex gap-2">
              <Icon name="info" className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{c.umbral}</p>
            </div>
          </Card>

          {/* Skills */}
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Habilidades evaluadas</p>
            <div className="flex flex-wrap gap-2">{c.skills.map((s) => <Badge key={s} tone="primary" icon="layers">{s}</Badge>)}</div>
          </Card>

          {/* Historial */}
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Tus entregas</p>
            <div className="space-y-2">
              {subs.map((sub) => (
                <button key={sub.id} onClick={() => nav.go('submission', { id: sub.id })}
                  className="w-full flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2.5 hover:border-brand-300 dark:hover:border-brand-500/40 transition-colors text-left">
                  <span className="text-sm font-mono font-semibold text-slate-400">v{sub.version}</span>
                  <div className="flex-1 min-w-0">
                    <EvalStatusBadge status={sub.eval.estado} />
                  </div>
                  <span className={cx('text-sm font-bold tabular-nums', gradeText(sub.eval.notaTotal))}>{sub.eval.notaTotal.toFixed(1)}</span>
                  <Icon name="chevronRight" className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ChallengeView, ListCard });
