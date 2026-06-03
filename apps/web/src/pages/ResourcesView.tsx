import { useQuery } from '@tanstack/react-query';
import type { ResourceDTO } from '@skilldrop/shared';
import { api } from '@/lib/api';
import { Icon } from '@/components/icons';
import { cx, Card, Badge, PageLoader, SectionTitle } from '@/components/ui';
import { PageHeader } from '@/components/Layout';

type TypeMeta = { icon: string; label: string; tone: 'primary' | 'success' | 'warning' | 'default' };

const TYPE_META: Record<string, TypeMeta> = {
  link:     { icon: 'link',     label: 'Enlace',    tone: 'default'  },
  video:    { icon: 'video',    label: 'Vídeo',     tone: 'primary'  },
  template: { icon: 'template', label: 'Plantilla', tone: 'success'  },
  library:  { icon: 'book',     label: 'Librería',  tone: 'warning'  },
  article:  { icon: 'doc',      label: 'Artículo',  tone: 'default'  },
};

const ICON_BG: Record<TypeMeta['tone'], string> = {
  primary: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400',
  success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  warning: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  default: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};

export function ResourcesView() {
  const { data: resources, isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: () => api.get<ResourceDTO[]>('/resources'),
  });

  if (isLoading || !resources) return <PageLoader />;

  const categories = [...new Set(resources.map((r) => r.category))];

  return (
    <div>
      <PageHeader
        eyebrow="SkillDrop"
        title="Recursos"
        subtitle="Material complementario para cada fase: úsalo cuando lo necesites, no para avanzar."
      />

      {/* Mascota + descripción */}
      <div className="flex items-center gap-4 mb-8">
        <img src="/mascot/idea.png" alt="" className="w-20 h-20 object-contain shrink-0" />
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
          Aquí encontrarás artículos, vídeos, plantillas y librerías curados para acompañar tu aprendizaje.
          No necesitas verlos todos; consulta los que sean relevantes para la fase en la que estés.
        </p>
      </div>

      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat}>
            <SectionTitle icon="book" title={cat} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources
                .filter((r) => r.category === cat)
                .map((r) => {
                  const meta = TYPE_META[r.type] ?? TYPE_META.link;
                  return (
                    <a
                      key={r.id}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <Card className="p-5 h-full hover:shadow-soft-lg hover:border-brand-200 dark:hover:border-brand-500/40 transition-all">
                        {/* Icono + badge de fase */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className={cx('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', ICON_BG[meta.tone])}>
                            <Icon name={meta.icon} className="w-5 h-5" />
                          </div>
                          {r.phaseCode && (
                            <Badge tone="outline">{r.phaseCode}</Badge>
                          )}
                        </div>

                        {/* Tipo */}
                        <Badge tone={meta.tone} className="mb-2">{meta.label}</Badge>

                        {/* Título y descripción */}
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                          {r.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {r.description}
                        </p>
                      </Card>
                    </a>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
