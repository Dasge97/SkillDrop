// ResourcesView.jsx
const RES_TYPE = {
  articulo: { icon: 'doc', label: 'Artículo', tone: 'default' },
  video: { icon: 'video', label: 'Vídeo', tone: 'primary' },
  plantilla: { icon: 'template', label: 'Plantilla', tone: 'success' },
  herramienta: { icon: 'tool', label: 'Herramienta', tone: 'warning' },
};

function ResourcesView() {
  return (
    <div>
      <PageHeader eyebrow={COURSE.title} title="Recursos" subtitle="Material complementario para cada fase: léelo cuando lo necesites, no para avanzar." />
      <div className="space-y-8">
        {RESOURCES.map((group) => (
          <div key={group.cat}>
            <SectionTitle icon="book" title={group.cat} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((r) => {
                const t = RES_TYPE[r.type];
                return (
                  <Card key={r.title} as="a" href="#" onClick={(e) => e.preventDefault()}
                    className="p-5 block hover:shadow-soft-lg hover:border-brand-200 dark:hover:border-brand-500/40 transition-all">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className={cx('w-10 h-10 rounded-lg flex items-center justify-center',
                        t.tone === 'primary' ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400'
                        : t.tone === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                        : t.tone === 'warning' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400')}>
                        <Icon name={t.icon} className="w-5 h-5" />
                      </div>
                      <Badge tone="outline">{r.fase}</Badge>
                    </div>
                    <Badge tone={t.tone} className="mb-2">{t.label}</Badge>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-snug">{r.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{r.desc}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ResourcesView, RES_TYPE });
