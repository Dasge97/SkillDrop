// Landing.jsx
function Landing() {
  const nav = useNav();
  const features = [
    { icon: 'target', title: 'Retos realistas', desc: 'Cada lección termina en un encargo con brief, restricciones y entregables como en un trabajo real.' },
    { icon: 'review', title: 'Evaluación tipo mentor', desc: 'Recibes una rúbrica del 1 al 10 por criterio, con feedback concreto y mejoras accionables.' },
    { icon: 'flag', title: 'Avance por dominio', desc: 'No pasas de fase por terminar vídeos: pasas cuando demuestras que sabes hacerlo.' },
    { icon: 'progress', title: 'Progreso visible', desc: 'Tu árbol de habilidades, tus notas y tu nivel estimado crecen reto a reto.' },
  ];
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 dark:border-slate-800/70 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => nav.go('login')}>Entrar</Button>
            <Button variant="primary" size="sm" onClick={() => nav.go('register')}>Crear cuenta</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Badge tone="primary" icon="sparkles" className="mb-5">Aprendizaje basado en maestría</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            Aprende diseño <span className="text-brand-600 dark:text-brand-400">demostrando</span> que lo dominas.
          </h1>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            SkillDrop es una plataforma de cursos donde no avanzas por completar lecciones, sino cuando un mentor confirma tu dominio con una rúbrica clara.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => nav.go('register')} iconRight="arrowRight">Crear cuenta gratis</Button>
            <Button size="lg" variant="outline" onClick={() => nav.go('login')}>Entrar</Button>
          </div>
          <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400 border-l-2 border-brand-400 pl-3 italic">“{GUIDING_PHRASE}”</p>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 bg-brand-500/10 blur-3xl rounded-full" aria-hidden="true" />
          <Mascot variant="hero" label="bienvenida / hero" className="relative aspect-square w-full max-w-md mx-auto" />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <Card key={f.title} className="p-6">
              <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                <Icon name={f.icon} className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Roadmap preview */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Un camino de 13 fases</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">Del primer frame a un proyecto de portafolio. Cada fase desbloquea la siguiente solo cuando demuestras dominio.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5">
          {PHASES.map((p) => (
            <div key={p.n} className={cx(
              'flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium',
              p.status === 'completada' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
                : p.status === 'bloqueada' ? 'border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600'
                : 'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300'
            )}>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/70 dark:bg-slate-950/40 text-xs font-bold">
                {p.status === 'completada' ? <Icon name="check" className="w-3.5 h-3.5" /> : p.status === 'bloqueada' ? <Icon name="lock" className="w-3 h-3" /> : p.n}
              </span>
              <span className="hidden sm:inline max-w-[150px] truncate">{p.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <Card className="overflow-hidden bg-gradient-to-br from-brand-600 to-brand-700 border-0 text-white">
          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center p-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Empieza por el Bootcamp de Figma</h2>
              <p className="mt-3 text-brand-50/90 max-w-lg">Un curso completo de UI/UX donde cada habilidad se gana con un reto real. Multi-curso: lo que aprendas aquí escala a todo lo que viene.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button size="lg" variant="secondary" className="!bg-white !text-brand-700 hover:!bg-brand-50" onClick={() => nav.go('register')} iconRight="arrowRight">Crear cuenta</Button>
                <Button size="lg" variant="ghost" className="!text-white hover:!bg-white/10" onClick={() => nav.go('login')}>Ya tengo cuenta</Button>
              </div>
            </div>
            <Mascot variant="celebración" label="celebración" className="w-44 h-44 !border-white/40 !bg-white/10" />
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <Logo />
          <p>© 2026 SkillDrop · Aprende demostrando dominio.</p>
        </div>
      </footer>
    </div>
  );
}

window.Landing = Landing;
