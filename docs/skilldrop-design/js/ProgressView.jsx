// ProgressView.jsx
function ProgressView() {
  const s = STUDENT_STATS;
  return (
    <div>
      <PageHeader eyebrow={COURSE.title} title="Tu progreso" subtitle="Tu dominio crece reto a reto. Aquí ves todo lo que has demostrado." />

      {/* stats */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        <StatCard icon="bolt" label="XP total" value={s.xp.toLocaleString('es')} tone="violet" />
        <StatCard icon="layers" label="Habilidades activas" value={`${s.skillsActivas}`} suffix={`/${s.skillsTotales}`} tone="brand" />
        <StatCard icon="flame" label="Racha" value={s.streak} suffix=" días" tone="amber" />
      </div>

      {/* medallas */}
      <Card className="p-6 mb-7">
        <SectionTitle icon="trophy" title="Medallas" action={<span className="text-sm text-slate-400">{MEDALS.filter((m) => m.earned).length} de {MEDALS.length}</span>} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {MEDALS.map((m) => (
            <div key={m.id} className={cx('flex flex-col items-center text-center rounded-xl border p-4 transition',
              m.earned ? 'border-brand-200 dark:border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/10' : 'border-dashed border-slate-200 dark:border-slate-800 opacity-55')}>
              <div className={cx('w-11 h-11 rounded-full flex items-center justify-center mb-2', m.earned ? 'bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-800')}>
                <Icon name={m.earned ? m.icon : 'lock'} className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-tight">{m.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* árbol de habilidades */}
      <SectionTitle icon="layers" title="Árbol de habilidades" />
      <div className="space-y-6">
        {SKILL_TREE.map((group) => (
          <div key={group.cat}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">{group.cat}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {group.skills.map((sk) => (
                <Card key={sk.name} className="p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="font-medium text-slate-800 dark:text-slate-200">{sk.name}</p>
                    <span className={cx('text-sm font-bold tabular-nums', gradeText(sk.avg))}>{sk.avg != null ? sk.avg.toFixed(1) : '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <LevelDots value={sk.nivel} />
                    <span className="text-xs text-slate-400">{sk.retos} {sk.retos === 1 ? 'reto' : 'retos'}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.ProgressView = ProgressView;
