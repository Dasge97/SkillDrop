// SubmissionView.jsx
function CriterionRow({ cr }) {
  return (
    <div className="py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{cr.name}</p>
          {cr.critico && <Badge tone="danger" className="!text-[10px] !px-1.5 shrink-0">crítico</Badge>}
        </div>
        <span className={cx('text-sm font-bold tabular-nums shrink-0', gradeText(cr.nota))}>{cr.nota}<span className="text-slate-400 font-medium">/10</span></span>
      </div>
      <ProgressBar value={cr.nota * 10} height="h-1.5" tone={gradeTone(cr.nota)} className="mb-1.5" />
      {cr.comentario && <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{cr.comentario}</p>}
    </div>
  );
}

const RESULT_MASCOT = { aprobado: 'celebración', mejoras: 'trabajando', rehacer: 'idea' };

function SubmissionView() {
  const nav = useNav();
  const { params } = nav.route;
  const pending = params.pending || params.id === 's-v3';
  const sub = SUBMISSIONS.find((s) => s.id === params.id) || SUBMISSIONS[1];

  if (pending) {
    return (
      <div>
        <PageHeader back={{ to: 'challenge', label: 'Volver al reto', params: { id: CHALLENGE.id } }}
          eyebrow="Entrega v3" title="En revisión" />
        <Card className="p-10 flex flex-col items-center text-center max-w-xl mx-auto">
          <Mascot variant="idea" label="idea (bombilla)" className="w-40 h-40 mb-6" />
          <EvalStatusBadge status="revision" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-4">Tu entrega está en la cola del mentor</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">Normalmente recibirás tu evaluación con rúbrica en menos de 24 h. Te avisaremos en cuanto esté lista.</p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => nav.go('dashboard')}>Ir al dashboard</Button>
            <Button variant="ghost" onClick={() => nav.go('submission', { id: 's-v2' })}>Ver una evaluación de ejemplo</Button>
          </div>
        </Card>
      </div>
    );
  }

  const ev = sub.eval;
  const aprobado = ev.estado === 'aprobado';

  return (
    <div>
      <PageHeader back={{ to: 'challenge', label: 'Volver al reto', params: { id: CHALLENGE.id } }}
        eyebrow={`Entrega v${sub.version} · ${sub.fecha}`} title={CHALLENGE.title} actions={<EvalStatusBadge status={ev.estado} />} />

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Detalle de la entrega */}
        <div className="space-y-6">
          <Card className="p-6">
            <SectionTitle icon="inbox" title="Tu entrega" />
            <a href={sub.figma} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline break-all">
              <Icon name="link" className="w-4 h-4 shrink-0" />{sub.figma}
            </a>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {sub.capturas.map((cap, i) => (
                <Mascot key={i} variant="captura" label={cap} className="aspect-[4/3]" />
              ))}
            </div>
            {sub.notas && (
              <div className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Tus notas</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{sub.notas}</p>
              </div>
            )}
          </Card>

          {/* Criterios */}
          <Card className="p-6">
            <SectionTitle icon="review" title="Rúbrica del mentor" action={<span className="text-xs text-slate-400">{CHALLENGE.umbral}</span>} />
            <div>{ev.criterios.map((cr) => <CriterionRow key={cr.name} cr={cr} />)}</div>
          </Card>

          {/* Mejoras */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-3"><Icon name="alert" className="w-5 h-5 text-amber-500" />Mejoras obligatorias</h3>
              <ul className="space-y-2">{ev.obligatorias.map((m, i) => <li key={i} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-300"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />{m}</li>)}</ul>
            </Card>
            <Card className="p-5">
              <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-3"><Icon name="sparkles" className="w-5 h-5 text-brand-500" />Mejoras opcionales</h3>
              <ul className="space-y-2">{ev.opcionales.map((m, i) => <li key={i} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-300"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />{m}</li>)}</ul>
            </Card>
          </div>
        </div>

        {/* Evaluación resumen */}
        <div className="space-y-5 lg:sticky lg:top-8">
          <Card className="p-6 text-center">
            <Mascot variant={RESULT_MASCOT[ev.estado]} label={`resultado: ${EVAL_STATUS[ev.estado].label}`} className="w-28 h-28 mx-auto mb-4" />
            <div className={cx('text-6xl font-extrabold tracking-tight tabular-nums', gradeText(ev.notaTotal))}>{ev.notaTotal.toFixed(1)}</div>
            <p className="text-sm text-slate-400 mb-3">nota total / 10</p>
            <EvalStatusBadge status={ev.estado} />
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed text-left">{ev.feedback}</p>
          </Card>

          {/* Nivel estimado */}
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Nivel estimado</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">{NIVELES[ev.nivel]}</p>
            <div className="flex items-center gap-1">
              {NIVELES.map((nv, i) => (
                <div key={nv} className="flex-1 group relative" title={nv}>
                  <div className={cx('h-1.5 rounded-full', i <= ev.nivel ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700')} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5"><span>Principiante</span><span>Profesional</span></div>
          </Card>

          {!aprobado && (
            <Card className="p-5 border-brand-200 dark:border-brand-500/40 bg-brand-50/40 dark:bg-brand-500/5">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">Aplica las mejoras obligatorias y vuelve a entregar. Estás cerca del dominio.</p>
              <Button className="w-full" icon="upload" onClick={() => nav.go('submit', { id: CHALLENGE.id })}>Reintentar el reto</Button>
            </Card>
          )}
          {aprobado && (
            <Card className="p-5 border-emerald-200 dark:border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-500/5">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">¡Dominio demostrado! Has desbloqueado la siguiente lección.</p>
              <Button className="w-full" variant="primary" iconRight="arrowRight" onClick={() => nav.go('phase', { n: CHALLENGE.phase })}>Continuar la fase</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SubmissionView, CriterionRow });
