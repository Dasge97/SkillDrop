// MentorReview.jsx
function ScorePicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1">
      {Array.from({ length: 10 }).map((_, i) => {
        const n = i + 1;
        const on = value === n;
        return (
          <button key={n} type="button" onClick={() => onChange(n)}
            className={cx('w-8 h-8 rounded-md text-sm font-semibold tabular-nums transition-colors',
              on ? (n >= 8 ? 'bg-emerald-500 text-white' : n >= 6.5 ? 'bg-amber-500 text-white' : 'bg-red-500 text-white')
                 : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700')}>
            {n}
          </button>
        );
      })}
    </div>
  );
}

function DynamicList({ label, icon, tone, items, setItems, placeholder }) {
  const update = (i, v) => setItems(items.map((x, idx) => (idx === i ? v : x)));
  return (
    <div>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5"><Icon name={icon} className={cx('w-4 h-4', tone)} />{label}</p>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <Input value={it} onChange={(e) => update(i, e.target.value)} placeholder={placeholder} />
            <Button type="button" variant="ghost" className="!px-3" onClick={() => setItems(items.filter((_, idx) => idx !== i))}><Icon name="x" className="w-4 h-4" /></Button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => setItems([...items, ''])} className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"><Icon name="plus" className="w-4 h-4" />Añadir</button>
    </div>
  );
}

function MentorReview() {
  const nav = useNav();
  const q = MENTOR_QUEUE.find((x) => x.id === nav.route.params.id) || MENTOR_QUEUE[0];
  const crits = CHALLENGE.criterios;
  const [scores, setScores] = React.useState(crits.map(() => null));
  const [comments, setComments] = React.useState(crits.map(() => ''));
  const [feedback, setFeedback] = React.useState('');
  const [obligatorias, setObligatorias] = React.useState(['']);
  const [opcionales, setOpcionales] = React.useState(['']);
  const [nivel, setNivel] = React.useState(2);
  const [saved, setSaved] = React.useState(false);

  const scored = scores.filter((s) => s != null);
  const media = scored.length ? scored.reduce((a, b) => a + b, 0) / scored.length : null;
  const criticosOk = crits.every((c, i) => !c.critico || scores[i] == null || scores[i] >= 7);
  const allScored = scores.every((s) => s != null);

  let estado = 'revision';
  if (allScored) {
    if (media >= 8 && criticosOk) estado = 'aprobado';
    else if (media < 6 || scores.some((s) => s < 4)) estado = 'rehacer';
    else estado = 'mejoras';
  }

  return (
    <div>
      <PageHeader back={{ to: 'mentor-queue', label: 'Cola de revisión' }} eyebrow={`Mentor · ${q.fase} · v${q.version}`} title={q.reto}
        actions={<div className="flex items-center gap-2"><Avatar name={q.alumno} size="sm" /><span className="text-sm text-slate-500 dark:text-slate-400">{q.alumno}</span></div>} />

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Rúbrica */}
        <div className="space-y-6">
          <Card className="p-6">
            <SectionTitle icon="review" title="Rúbrica de evaluación" action={
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">Media</span>
                <span className={cx('font-bold tabular-nums', gradeText(media))}>{media != null ? media.toFixed(1) : '—'}</span>
              </div>} />
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {crits.map((c, i) => (
                <div key={c.name} className="py-4 first:pt-0">
                  <div className="flex items-center gap-2 mb-2.5">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{c.name}</p>
                    {c.critico && <Badge tone="danger" className="!text-[10px] !px-1.5">crítico</Badge>}
                    {c.critico && scores[i] != null && scores[i] < 7 && <Badge tone="warning" className="!text-[10px]">crítico bajo</Badge>}
                  </div>
                  <ScorePicker value={scores[i]} onChange={(n) => setScores(scores.map((s, idx) => (idx === i ? n : s)))} />
                  <Input className="mt-2.5 !py-2 !text-sm" value={comments[i]} onChange={(e) => setComments(comments.map((x, idx) => (idx === i ? e.target.value : x)))} placeholder="Comentario para este criterio (opcional)" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 space-y-5">
            <Field label="Feedback general">
              <Textarea rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Resume el resultado y qué destaca o falta para el dominio…" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <DynamicList label="Mejoras obligatorias" icon="alert" tone="text-amber-500" items={obligatorias} setItems={setObligatorias} placeholder="Ej: unifica el espaciado a múltiplos de 8" />
              <DynamicList label="Mejoras opcionales" icon="sparkles" tone="text-brand-500" items={opcionales} setItems={setOpcionales} placeholder="Ej: prueba una versión compacta" />
            </div>
            <Field label="Nivel estimado">
              <Select value={nivel} onChange={(e) => setNivel(Number(e.target.value))}>
                {NIVELES.map((nv, i) => <option key={nv} value={i}>{nv}</option>)}
              </Select>
            </Field>
          </Card>
        </div>

        {/* Resumen / estado */}
        <div className="space-y-5 lg:sticky lg:top-8">
          <Card className="p-5">
            <Mascot variant="guía" label="guía (señalando)" className="w-full aspect-[5/3] mb-4" />
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Entrega del alumno</p>
            <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"><Icon name="link" className="w-4 h-4" />Abrir archivo de Figma</a>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {['Captura 1', 'Captura 2', 'Captura 3'].map((c) => <Mascot key={c} variant="captura" label={c} className="aspect-square" />)}
            </div>
          </Card>

          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Estado resultante</p>
            <div className="flex items-center justify-between mb-3">
              {estado === 'revision' ? <Badge tone="default">Completa la rúbrica</Badge> : <EvalStatusBadge status={estado} />}
              <span className={cx('text-2xl font-extrabold tabular-nums', gradeText(media))}>{media != null ? media.toFixed(1) : '—'}</span>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 flex gap-2">
              <Icon name="info" className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">El estado se asigna solo: <strong>Aprobado</strong> si la media ≥ 8 y ningún crítico &lt; 7; si no, <strong>Requiere mejoras</strong>; con media muy baja, <strong>Rehacer</strong>.</p>
            </div>
            {!criticosOk && <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5"><Icon name="alert" className="w-3.5 h-3.5" />Hay un criterio crítico por debajo de 7.</p>}
          </Card>

          <Button className="w-full" size="lg" icon="check" disabled={!allScored} onClick={() => { setSaved(true); setTimeout(() => nav.go('mentor-queue'), 1200); }}>
            {saved ? 'Guardada ✓' : 'Guardar evaluación'}
          </Button>
          {!allScored && <p className="text-xs text-center text-slate-400">Puntúa todos los criterios para guardar.</p>}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MentorReview, ScorePicker, DynamicList });
