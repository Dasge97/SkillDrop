// Admin.jsx
const ROLE_TONE = { STUDENT: 'primary', MENTOR: 'success', ADMIN: 'warning' };

function MetricCard({ title, icon, children }) {
  return (
    <Card className="p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4"><Icon name={icon} className="w-5 h-5 text-brand-600 dark:text-brand-400" />{title}</h3>
      {children}
    </Card>
  );
}

function AdminResumen() {
  const m = ADMIN.metricas;
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <MetricCard title="Usuarios por rol" icon="users">
        <div className="space-y-2.5">
          {m.usuarios.map((u) => (
            <div key={u.rol} className="flex items-center justify-between">
              <Badge tone={ROLE_TONE[u.rol]}>{u.rol}</Badge>
              <span className="text-lg font-bold tabular-nums text-slate-800 dark:text-slate-100">{u.n}</span>
            </div>
          ))}
        </div>
      </MetricCard>

      <MetricCard title="Entregas por estado" icon="inbox">
        <div className="space-y-2.5">
          {m.entregas.map((e) => (
            <div key={e.estado} className="flex items-center justify-between">
              <Badge tone={e.tone}>{e.label}</Badge>
              <span className="text-lg font-bold tabular-nums text-slate-800 dark:text-slate-100">{e.n}</span>
            </div>
          ))}
        </div>
      </MetricCard>

      <MetricCard title="Contenido" icon="layers">
        <div className="grid grid-cols-2 gap-3">
          {m.contenido.map((c) => (
            <div key={c.label} className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
              <p className="text-2xl font-bold tabular-nums text-slate-800 dark:text-slate-100">{c.n}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{c.label}</p>
            </div>
          ))}
        </div>
      </MetricCard>

      <MetricCard title="Evaluaciones" icon="review">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-3xl font-bold tabular-nums text-slate-800 dark:text-slate-100">{m.evaluaciones.total}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">evaluaciones</p>
          </div>
          <div>
            <p className={cx('text-3xl font-bold tabular-nums', gradeText(m.evaluaciones.media))}>{m.evaluaciones.media.toFixed(1)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">media global</p>
          </div>
        </div>
      </MetricCard>
    </div>
  );
}

function AdminUsuarios() {
  const [users, setUsers] = React.useState(ADMIN.usuarios);
  const setRole = (email, rol) => setUsers((us) => us.map((u) => (u.email === email ? { ...u, rol } : u)));
  return (
    <Table head={['Usuario', 'Rol', 'XP', 'Entregas', 'Cambiar rol']}>
      {users.map((u) => (
        <tr key={u.email} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar name={u.name} size="sm" />
              <div><p className="font-medium text-slate-800 dark:text-slate-200">{u.name}</p><p className="text-xs text-slate-400">{u.email}</p></div>
            </div>
          </td>
          <td className="px-4 py-3"><Badge tone={ROLE_TONE[u.rol]}>{u.rol}</Badge></td>
          <td className="px-4 py-3 tabular-nums text-slate-600 dark:text-slate-300">{u.xp.toLocaleString('es')}</td>
          <td className="px-4 py-3 tabular-nums text-slate-600 dark:text-slate-300">{u.entregas}</td>
          <td className="px-4 py-3">
            <Select value={u.rol} onChange={(e) => setRole(u.email, e.target.value)} className="!py-1.5 !text-xs w-36">
              <option value="STUDENT">STUDENT</option><option value="MENTOR">MENTOR</option><option value="ADMIN">ADMIN</option>
            </Select>
          </td>
        </tr>
      ))}
    </Table>
  );
}

function AdminCursos() {
  const [sel, setSel] = React.useState({ type: 'fase', n: 2 });
  const [openPhase, setOpenPhase] = React.useState(2);
  const p = PHASES[openPhase];
  const lessons = openPhase === 2 ? LESSONS : [];

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-5 items-start">
      {/* tree */}
      <Card className="p-3">
        <div className="px-2 py-2 flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
          <Icon name="grid" className="w-4 h-4 text-brand-600 dark:text-brand-400" />{COURSE.title}
        </div>
        <div className="space-y-0.5 max-h-[60vh] overflow-y-auto">
          {PHASES.map((ph) => (
            <div key={ph.n}>
              <button onClick={() => { setOpenPhase(ph.n); setSel({ type: 'fase', n: ph.n }); }}
                className={cx('w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-left transition-colors',
                  sel.type === 'fase' && sel.n === ph.n ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300')}>
                <Icon name={openPhase === ph.n ? 'chevronDown' : 'chevronRight'} className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span className="font-mono text-xs text-slate-400">F{ph.n}</span>
                <span className="truncate flex-1">{ph.title}</span>
              </button>
              {openPhase === ph.n && (
                <div className="ml-7 border-l border-slate-200 dark:border-slate-800 pl-2 py-0.5 space-y-0.5">
                  {(ph.n === 2 ? LESSONS : []).length === 0 && <p className="text-xs text-slate-400 px-2 py-1">Sin lecciones cargadas</p>}
                  {(ph.n === 2 ? LESSONS : []).map((l) => (
                    <button key={l.id} onClick={() => setSel({ type: 'leccion', id: l.id })}
                      className={cx('w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-left transition-colors',
                        sel.type === 'leccion' && sel.id === l.id ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-500 dark:text-slate-400')}>
                      <span className="font-mono">{l.number}.</span><span className="truncate">{l.title}</span>
                    </button>
                  ))}
                  <button onClick={() => setSel({ type: 'reto', n: ph.n })} className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-left text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10">
                    <Icon name="target" className="w-3.5 h-3.5" />Reto + rúbrica
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* editor */}
      <Card className="p-6">
        {sel.type === 'fase' && <FaseEditor p={PHASES[sel.n]} />}
        {sel.type === 'leccion' && <LeccionEditor l={(LESSONS.find((x) => x.id === sel.id)) || LESSON_DETAIL} />}
        {sel.type === 'reto' && <RetoEditor />}
      </Card>
    </div>
  );
}

function FaseEditor({ p }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2"><Badge tone="primary">FASE {p.n}</Badge><PhaseStatusBadge status={p.status} /></div>
      <Field label="Título de la fase"><Input defaultValue={p.title} /></Field>
      <Field label="Objetivo"><Textarea rows={2} defaultValue={p.objetivo} /></Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Estado">
          <Select defaultValue={p.status}>{Object.keys(PHASE_STATUS).map((k) => <option key={k} value={k}>{PHASE_STATUS[k].label}</option>)}</Select>
        </Field>
        <Field label="Nº de retos"><Input type="number" defaultValue={p.retos} /></Field>
      </div>
      <Field label="Habilidades que desbloquea (separadas por comas)"><Input defaultValue={p.skills.join(', ')} /></Field>
      <div className="flex justify-end gap-2 pt-2"><Button variant="ghost">Cancelar</Button><Button icon="check">Guardar fase</Button></div>
    </div>
  );
}

function LeccionEditor({ l }) {
  return (
    <div className="space-y-5">
      <Badge tone="default">Lección {l.number}</Badge>
      <Field label="Título"><Input defaultValue={l.title} /></Field>
      <Field label="Objetivo"><Textarea rows={2} defaultValue={l.objetivo} /></Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Dificultad (1–5)"><Input type="number" min="1" max="5" defaultValue={l.dif} /></Field>
        <Field label="Tiempo estimado"><Input defaultValue={l.time} /></Field>
      </div>
      <div className="flex justify-end gap-2 pt-2"><Button variant="ghost">Cancelar</Button><Button icon="check">Guardar lección</Button></div>
    </div>
  );
}

function RetoEditor() {
  const [crits, setCrits] = React.useState(CHALLENGE.criterios.map((c) => ({ ...c })));
  const toggle = (i) => setCrits(crits.map((c, idx) => (idx === i ? { ...c, critico: !c.critico } : c)));
  const update = (i, k, v) => setCrits(crits.map((c, idx) => (idx === i ? { ...c, [k]: v } : c)));
  return (
    <div className="space-y-5">
      <Badge tone="primary" icon="target">Reto + rúbrica</Badge>
      <Field label="Título del reto"><Input defaultValue={CHALLENGE.title} /></Field>
      <Field label="Brief"><Textarea rows={3} defaultValue={CHALLENGE.brief} /></Field>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Criterios de la rúbrica</span>
          <button onClick={() => setCrits([...crits, { name: '', desc: '', critico: false }])} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"><Icon name="plus" className="w-4 h-4" />Añadir criterio</button>
        </div>
        <div className="space-y-2">
          {crits.map((c, i) => (
            <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 space-y-2">
              <div className="flex gap-2">
                <Input className="!py-2 !text-sm" value={c.name} onChange={(e) => update(i, 'name', e.target.value)} placeholder="Nombre del criterio" />
                <button onClick={() => toggle(i)} className={cx('shrink-0 px-3 rounded-lg text-xs font-medium border transition-colors', c.critico ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-500/15 dark:border-red-500/30 dark:text-red-300' : 'border-slate-200 dark:border-slate-700 text-slate-400')}>crítico</button>
                <Button variant="ghost" className="!px-2.5" onClick={() => setCrits(crits.filter((_, idx) => idx !== i))}><Icon name="x" className="w-4 h-4" /></Button>
              </div>
              <Input className="!py-2 !text-sm" value={c.desc} onChange={(e) => update(i, 'desc', e.target.value)} placeholder="Descripción de qué se evalúa" />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg bg-brand-50/60 dark:bg-brand-500/10 p-3 flex gap-2 text-xs text-slate-600 dark:text-slate-300"><Icon name="info" className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />{CHALLENGE.umbral}</div>
      <div className="flex justify-end gap-2 pt-1"><Button variant="ghost">Cancelar</Button><Button icon="check">Guardar reto</Button></div>
    </div>
  );
}

function Admin() {
  const [tab, setTab] = React.useState('resumen');
  const tabs = [{ id: 'resumen', label: 'Resumen', icon: 'grid' }, { id: 'usuarios', label: 'Usuarios', icon: 'users' }, { id: 'cursos', label: 'Cursos', icon: 'layers' }];
  return (
    <div>
      <PageHeader eyebrow="Admin" title="Panel de administración" subtitle="Gestiona usuarios, contenido y evaluaciones de SkillDrop." />
      <div className="flex items-center gap-1 mb-6 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cx('inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              tab === t.id ? 'border-brand-500 text-brand-700 dark:text-brand-300' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200')}>
            <Icon name={t.icon} className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>
      {tab === 'resumen' && <AdminResumen />}
      {tab === 'usuarios' && <AdminUsuarios />}
      {tab === 'cursos' && <AdminCursos />}
    </div>
  );
}

Object.assign(window, { Admin });
